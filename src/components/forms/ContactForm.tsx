"use client";

import Link from "@/components/ui/LocaleLink";
import { useState } from "react";
import { Arrow } from "@/components/ui/ProductIcon";
import type { Content } from "@/content";
import type { Locale } from "@/i18n/config";
import { FORMS_URL } from "@/lib/forms";
import { EMAIL_RE } from "@/lib/quote";
import { FieldError, FieldShell, Honeypot, PrivacyInfo, describedBy } from "./fields";

type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;
type ContactCopy = Omit<Content["form"]["contact"], "done"> & { done: string };

export function ContactForm({ copy, locale }: { copy: ContactCopy; locale: Locale }) {
  const [v, setV] = useState({ name: "", email: "", message: "", consent: false, website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [failure, setFailure] = useState("");

  const set = (patch: Partial<typeof v>) => {
    setV((p) => ({ ...p, ...patch }));
    setErrors({});
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (v.name.trim().length < 2) errs.name = copy.errors.name;
    if (!EMAIL_RE.test(v.email.trim())) errs.email = copy.errors.email;
    if (v.message.trim().length < 5) errs.message = copy.errors.message;
    if (!v.consent) errs.consent = copy.errors.consent;
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`${FORMS_URL}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, locale }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
      } else {
        if (data.errors) setErrors(data.errors);
        setFailure(data.error ?? copy.unknown);
        setStatus("failed");
      }
    } catch {
      setFailure(copy.network);
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="border-t border-charcoal pt-6">
        <p className="subhead">{copy.done.replace("{email}", v.email)}</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="relative space-y-8">
      <Honeypot onChange={(website) => setV((p) => ({ ...p, website }))} />
      <FieldShell id="name" label={copy.fields.name} optional={copy.optional} required error={errors.name}>
        <input id="name" name="name" autoComplete="name" value={v.name} onChange={(e) => set({ name: e.target.value })} aria-invalid={errors.name ? true : undefined} aria-describedby={describedBy("name", undefined, errors.name)} className="field" />
      </FieldShell>
      <FieldShell id="email" label={copy.fields.email} optional={copy.optional} required error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" value={v.email} onChange={(e) => set({ email: e.target.value })} aria-invalid={errors.email ? true : undefined} aria-describedby={describedBy("email", undefined, errors.email)} className="field" />
      </FieldShell>
      <FieldShell id="message" label={copy.fields.message} optional={copy.optional} required error={errors.message}>
        <textarea id="message" name="message" rows={5} value={v.message} onChange={(e) => set({ message: e.target.value })} aria-invalid={errors.message ? true : undefined} aria-describedby={describedBy("message", undefined, errors.message)} className="field resize-y" />
      </FieldShell>
      <PrivacyInfo copy={copy.privacy} />
      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="consent" checked={v.consent} onChange={(e) => set({ consent: e.target.checked })} aria-invalid={errors.consent ? true : undefined} className="mt-1 h-5 w-5 shrink-0 accent-charcoal" />
          <span className="text-[0.9375rem]">
            {copy.consent.before} <Link href="/legal#privacy" target="_blank" className="link-line">{copy.consent.link}</Link>{copy.consent.after}
          </span>
        </label>
        <FieldError id="consent" error={errors.consent} />
      </div>
      {status === "failed" ? <p role="alert" className="border-l-2 border-[#8f2d18] pl-4 font-medium text-[#8f2d18]">{failure}</p> : null}
      <button type="submit" disabled={status === "sending"} className="btn btn-ink w-full sm:w-auto">
        {status === "sending" ? copy.buttons.sending : copy.buttons.send} {status === "sending" ? null : <Arrow />}
      </button>
    </form>
  );
}
