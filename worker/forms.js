// AUNZA forms server. A single Cloudflare Worker file: paste it into the Cloudflare editor.
// Needs two secrets in the Worker's settings: RESEND_API_KEY and SUPABASE_SERVICE_ROLE_KEY.
// A request counts as delivered if email or database accepted it; otherwise the visitor is told it failed.

const EMAIL_TO = "hola@aunza.es";
const EMAIL_FROM = "AUNZA <web@aunza.es>";
const SUPABASE_URL = "https://xjzmacwammuxumqrcbhi.supabase.co";
const ORIGINS = /^(https:\/\/(www\.)?aunza\.es|http:\/\/localhost:\d+)$/;

const MAX_TEXT = 5000;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".ai", ".eps", ".svg"];
const LINK_DAYS = 30;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Same wording as src/content/*/form.ts. Field-level messages live in the browser, which checks first.
const MESSAGES = {
  es: {
    tooMany: "Demasiadas solicitudes. Vuelve a intentarlo en unos minutos.",
    unreadable: "No hemos podido leer la solicitud. Puede que sea demasiado grande.",
    check: "Revisa los campos marcados.",
    failedQuote: "No hemos podido enviar tu solicitud, así que todavía no nos ha llegado nada. Tus respuestas siguen aquí: vuelve a intentarlo dentro de un momento.",
    failedContact: "No hemos podido enviar tu mensaje, así que todavía no nos ha llegado nada. Vuelve a intentarlo dentro de un momento.",
  },
  en: {
    tooMany: "Too many requests. Please try again in a few minutes.",
    unreadable: "We couldn't read the request. It may be too large.",
    check: "Please check the marked fields.",
    failedQuote: "We couldn't send your request, so nothing has reached us yet. Your answers are still here: please try again in a moment.",
    failedContact: "We couldn't send your message, so nothing has reached us yet. Please try again in a moment.",
  },
};

// The team always reads requests in English, whatever the visitor's language was.
const LABELS = {
  industry: { hospitality: "Hospitality & Food Service", retail: "Retail & Ecommerce", corporate: "Corporate & Business", events: "Events & Marketing", fashion: "Fashion & Apparel", beauty: "Beauty & Wellness", hotels: "Hotels & Lifestyle", sports: "Sports & Leisure", other: "Something else" },
  category: { packaging: "Packaging", drinkware: "Drinkware", bags: "Bags & Accessories", apparel: "Apparel & Uniforms", stationery: "Office & Stationery", "corporate-gifts": "Corporate Gifts", hospitality: "Hospitality Products", "beauty-wellness": "Beauty & Wellness", "custom-products": "Something not listed" },
  designStatus: { ready: "Yes, ready to use", "logo-only": "I have a logo, but need a design", none: "No, not yet" },
};
const CAMPAIGNS = { christmas: "Christmas" };

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const display = (v) => (Array.isArray(v) ? v.join(", ") : v ?? "—");

async function sendEmail(env, s) {
  const cell = (v) => (/^https:\/\//.test(String(v)) ? `<a href="${esc(v)}">Open file</a>` : esc(String(display(v))));
  const rows = Object.entries(s.fields)
    .map(([k, v]) => `<tr><th align="left" valign="top" style="padding:6px 16px 6px 0;font-weight:600">${esc(k)}</th><td style="padding:6px 0;white-space:pre-wrap">${cell(v)}</td></tr>`)
    .join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      reply_to: s.replyTo,
      subject: s.subject,
      html: `<table style="font-family:Arial,sans-serif;font-size:14px;color:#1f1f1f">${rows}</table>`,
      text: Object.entries(s.fields).map(([k, v]) => `${k}: ${display(v)}`).join("\n"),
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

const supabaseHeaders = (env) => ({ apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` });

/** Files go to private storage and reach the team as a temporary link, which keeps the Worker within its free CPU limit. */
async function storeFile(env, kind, file) {
  const safe = file.name.replace(/[^\w.-]+/g, "_");
  const path = `${kind}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safe}`;
  const up = await fetch(`${SUPABASE_URL}/storage/v1/object/form-uploads/${path}`, {
    method: "POST",
    headers: { ...supabaseHeaders(env), "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!up.ok) throw new Error(`Supabase storage responded ${up.status}: ${await up.text()}`);
  const signed = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/form-uploads/${path}`, {
    method: "POST",
    headers: { ...supabaseHeaders(env), "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn: LINK_DAYS * 24 * 60 * 60 }),
  });
  if (!signed.ok) throw new Error(`Supabase sign responded ${signed.status}: ${await signed.text()}`);
  const { signedURL } = await signed.json();
  return { path, url: `${SUPABASE_URL}/storage/v1${signedURL}` };
}

async function storeRow(env, s, attachmentPath) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/form_submissions`, {
    method: "POST",
    headers: { ...supabaseHeaders(env), "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ kind: s.kind, reply_to: s.replyTo, data: s.fields, attachment_path: attachmentPath }),
  });
  if (!res.ok) throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
}

async function deliver(env, s, file) {
  let attachmentPath = null;
  if (file) {
    s.fields["Reference file"] = `${file.name} (received, but it could not be stored: ask the sender for it)`;
    if (env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const stored = await storeFile(env, s.kind, file);
        attachmentPath = stored.path;
        s.fields["Reference file"] = stored.url;
      } catch (e) {
        console.error("[forms] file storage failed:", e);
      }
    }
  }
  const tasks = [];
  if (env.RESEND_API_KEY) tasks.push(sendEmail(env, s));
  if (env.SUPABASE_SERVICE_ROLE_KEY) tasks.push(storeRow(env, s, attachmentPath));
  if (!tasks.length) {
    console.error(`[forms] ${s.kind} rejected: no delivery provider is configured.`);
    return false;
  }
  const results = await Promise.allSettled(tasks);
  results.filter((r) => r.status === "rejected").forEach((r) => console.error("[forms] delivery failed:", r.reason));
  return results.some((r) => r.status === "fulfilled");
}

// Small in-memory limiter: a first line of defence against scripted abuse, per Worker instance.
const hits = new Map();
function rateLimited(key, limit = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > limit;
}

function quoteErrors(v, file, check) {
  const errors = {};
  for (const name of ["fullName", "company", "country"]) if (v[name].length < 2) errors[name] = check;
  for (const name of ["industry", "category", "quantity", "designStatus", "budget"]) if (!v[name]) errors[name] = check;
  if (!EMAIL_RE.test(v.email)) errors.email = check;
  if (v.description.length < 10) errors.description = check;
  if (!v.customization.length) errors.customization = check;
  if (!v.consent) errors.consent = check;
  if (file && (file.size > MAX_FILE_BYTES || !FILE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext)))) errors.file = check;
  return errors;
}

async function handleQuote(req, env, reply, ip) {
  const guess = req.headers.get("referer")?.includes("/en/") ? "en" : "es";
  if (rateLimited(ip)) return reply({ ok: false, error: MESSAGES[guess].tooMany }, 429);

  let form;
  try {
    form = await req.formData();
  } catch {
    return reply({ ok: false, error: MESSAGES[guess].unreadable }, 400);
  }
  const locale = form.get("locale") === "en" ? "en" : "es";
  const copy = MESSAGES[locale];

  // Honeypot: real people never see this field. Answer normally without delivering anything to bots.
  if (form.get("website")) return reply({ ok: true });

  const text = (k) => String(form.get(k) ?? "").trim().slice(0, MAX_TEXT);
  const v = {
    fullName: text("fullName"),
    company: text("company"),
    email: text("email"),
    country: text("country"),
    industry: text("industry"),
    category: text("category"),
    description: text("description"),
    quantity: text("quantity"),
    customization: form.getAll("customization").map(String).slice(0, 12),
    designStatus: text("designStatus"),
    budget: text("budget"),
    deliveryDate: text("deliveryDate"),
    details: text("details"),
    consent: form.get("consent") === "true",
  };
  const entry = form.get("file");
  const file = entry && typeof entry !== "string" && entry.size > 0 ? entry : null;

  const errors = quoteErrors(v, file, copy.check);
  if (Object.keys(errors).length) return reply({ ok: false, error: copy.check, errors }, 422);

  const campaign = CAMPAIGNS[form.get("campaign")];
  const category = LABELS.category[v.category] ?? v.category;
  const delivered = await deliver(env, {
    kind: "quote",
    subject: `${campaign ? `[${campaign}] ` : ""}Quote request: ${v.company} (${category})`,
    replyTo: v.email,
    fields: {
      "Full name": v.fullName,
      Company: v.company,
      "Business email": v.email,
      Country: v.country,
      Industry: LABELS.industry[v.industry] ?? v.industry,
      "Product category": category,
      "Product description": v.description,
      "Approximate quantity": v.quantity,
      "Customization requirements": v.customization,
      "Logo or design": LABELS.designStatus[v.designStatus] ?? v.designStatus,
      "Approximate budget": v.budget,
      "Desired delivery date": v.deliveryDate || null,
      "Additional details": v.details || null,
      ...(campaign ? { Campaign: campaign } : {}),
      Language: locale === "es" ? "Spanish" : "English",
    },
  }, file);
  return delivered ? reply({ ok: true }) : reply({ ok: false, error: copy.failedQuote }, 503);
}

async function handleContact(req, env, reply, ip) {
  const body = await req.json().catch(() => null);
  const locale = body?.locale === "en" ? "en" : "es";
  const copy = MESSAGES[locale];
  if (rateLimited(`contact:${ip}`)) return reply({ ok: false, error: copy.tooMany }, 429);
  if (!body || typeof body !== "object") return reply({ ok: false, error: copy.unreadable }, 400);
  if (body.website) return reply({ ok: true });

  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, MAX_TEXT);

  const errors = {};
  if (name.length < 2) errors.name = copy.check;
  if (!EMAIL_RE.test(email)) errors.email = copy.check;
  if (message.length < 5) errors.message = copy.check;
  if (body.consent !== true) errors.consent = copy.check;
  if (Object.keys(errors).length) return reply({ ok: false, error: copy.check, errors }, 422);

  const delivered = await deliver(env, {
    kind: "contact",
    subject: `Contact message from ${name}`,
    replyTo: email,
    fields: { Name: name, Email: email, Message: message, Language: locale === "es" ? "Spanish" : "English" },
  });
  return delivered ? reply({ ok: true }) : reply({ ok: false, error: copy.failedContact }, 503);
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("origin") ?? "";
    const cors = ORIGINS.test(origin)
      ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", Vary: "Origin" }
      : { Vary: "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const reply = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...cors, "Content-Type": "application/json" } });
    const { pathname } = new URL(req.url);
    const ip = req.headers.get("cf-connecting-ip") ?? "unknown";
    if (req.method === "POST" && pathname === "/quote") return handleQuote(req, env, reply, ip);
    if (req.method === "POST" && pathname === "/contact") return handleContact(req, env, reply, ip);
    return reply({ ok: false }, 404);
  },
};
