"use client";

import Link from "@/components/ui/LocaleLink";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Wordmark } from "@/components/brand/Logo";
import { Arrow } from "@/components/ui/ProductIcon";
import type { Content } from "@/content";
import type { Locale } from "@/i18n/config";
import {
  BUDGETS,
  CAMPAIGNS,
  CATEGORIES,
  CUSTOMIZATIONS,
  DESIGN_STATUS,
  EMPTY_QUOTE,
  FILE_ACCEPT,
  INDUSTRIES,
  QUANTITIES,
  STEP_FIELDS,
  validateFile,
  validateStep,
  type QuoteErrors,
  type QuoteValues,
} from "@/lib/quote";
import { FORMS_URL } from "@/lib/forms";
import { ChipGroup, FieldError, FieldShell, Honeypot, describedBy } from "./fields";

const DRAFT_KEY = "aunza-quote-draft";

type QuoteCopy = Omit<Content["form"]["quote"], "progressText" | "review" | "done" | "meta"> & {
  review: Omit<Content["form"]["quote"]["review"], "editLabel">;
  done: { headline: string; back: string; text: string };
};

/** The site's single quote form. Function-valued copy doesn't cross to the client, so it arrives as templates. */
export function QuoteForm({ copy, locale }: { copy: QuoteCopy & { progressTemplate: string; editTemplate: string }; locale: Locale }) {
  const params = useSearchParams();
  const options = copy.options;
  const choices = (values: string[], labels: Record<string, string>) => values.map((value) => ({ value, label: labels[value] }));
  const [values, setValues] = useState<QuoteValues>(() => {
    const industry = params.get("industry") ?? "";
    const category = params.get("category") ?? "";
    return {
      ...EMPTY_QUOTE,
      industry: INDUSTRIES.includes(industry) ? industry : "",
      category: CATEGORIES.includes(category) ? category : "",
    };
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [failure, setFailure] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Keep a draft for this tab only, so a mistaken refresh doesn't lose a long answer. Files can't be kept.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) setValues((v) => ({ ...JSON.parse(saved), industry: v.industry || JSON.parse(saved).industry, category: v.category || JSON.parse(saved).category }));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    } catch {}
  }, [values]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [step, status]);

  const set = <K extends keyof QuoteValues>(k: K, v: QuoteValues[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const focusFirstError = (errs: QuoteErrors) => {
    const name = [...STEP_FIELDS[step], "file"].find((f) => errs[f as keyof QuoteErrors]);
    if (!name) return;
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[name="${name}"]`)?.focus());
  };

  const next = () => {
    const errs = validateStep(step, values, copy.errors);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    setStep((s) => s + 1);
  };

  const submit = async () => {
    const errs: QuoteErrors = validateStep(step, values, copy.errors);
    const fileError = validateFile(file, copy.errors);
    if (fileError) errs.file = fileError;
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);

    setStatus("sending");
    setFailure("");
    const body = new FormData();
    for (const [k, v] of Object.entries(values)) {
      if (Array.isArray(v)) v.forEach((x) => body.append(k, x));
      else body.append(k, String(v));
    }
    if (file) body.append("file", file);
    if (honeypot) body.append("website", honeypot);
    body.append("locale", locale);
    const campaign = params.get("campaign");
    if (CAMPAIGNS.some((o) => o.value === campaign)) body.append("campaign", campaign as string);

    try {
      const res = await fetch(`${FORMS_URL}/quote`, { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch {}
        return;
      }
      if (data.errors) {
        setErrors(data.errors);
        const firstStep = STEP_FIELDS.findIndex((fields) => fields.some((f) => data.errors[f]));
        if (firstStep >= 0) setStep(firstStep);
      }
      setFailure(data.error ?? copy.unknown);
      setStatus("failed");
    } catch {
      setFailure(copy.network);
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex min-h-[70svh] flex-col justify-center">
        <h1 ref={heading} tabIndex={-1} className="display !text-[clamp(2.75rem,9vw,9.5rem)] outline-none">
          {copy.done.headline}
        </h1>
        <p className="lede mt-8">{copy.done.text.replace("{email}", values.email)}</p>
        <div className="mt-10">
          <Link href="/" className="btn btn-ink w-full sm:w-auto">{copy.done.back} <Arrow /></Link>
        </div>
      </div>
    );
  }

  const STEPS = copy.steps;
  const f = copy.fields;
  const progress = ((step + 1) / STEPS.length) * 100;
  const last = step === STEPS.length - 1;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (last) void submit();
        else next();
      }}
      className="relative mx-auto grid max-w-[80rem] gap-10 lg:grid-cols-12"
    >
      <Honeypot onChange={setHoneypot} />

      <aside className="lg:col-span-4">
        <p className="label">{copy.label}</p>
        <div
          role="progressbar"
          aria-label={copy.progress}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
          aria-valuetext={copy.progressTemplate.replace("{step}", String(step + 1)).replace("{total}", String(STEPS.length)).replace("{name}", STEPS[step].label)}
          className="mt-5 h-px w-full bg-charcoal/20"
        >
          <div className="h-full origin-left bg-charcoal transition-[width] duration-500 ease-[var(--ease-brand)]" style={{ width: `${progress}%` }} />
        </div>
        <ol className="mt-4 flex justify-between gap-2 lg:mt-6 lg:block lg:space-y-2">
          {STEPS.map((s, i) => (
            <li key={s.label} className={`flex gap-2 text-[0.8125rem] transition-opacity lg:text-[0.9375rem] ${i === step ? "opacity-100" : "opacity-70"}`}>
              <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className={i === step ? "" : "hidden lg:inline"}>{s.label}</span>
            </li>
          ))}
        </ol>
      </aside>

      <div className="lg:col-span-7 lg:col-start-6">
        <h1 ref={heading} tabIndex={-1} className="headline !text-[clamp(2rem,4.6vw,4.5rem)] outline-none">
          {STEPS[step].title}
        </h1>

        <div className="mt-10 space-y-8">
          {step === 0 ? (
            <>
              <TextField name="fullName" label={f.fullName} optional={copy.optional} autoComplete="name" values={values} errors={errors} set={set} />
              <TextField name="company" label={f.company} optional={copy.optional} autoComplete="organization" values={values} errors={errors} set={set} />
              <TextField name="email" label={f.email} optional={copy.optional} type="email" autoComplete="email" inputMode="email" placeholder={f.emailPlaceholder} values={values} errors={errors} set={set} />
              <TextField name="country" label={f.country} optional={copy.optional} autoComplete="country-name" values={values} errors={errors} set={set} />
            </>
          ) : null}

          {step === 1 ? (
            <>
              <ChipGroup name="industry" legend={f.industry} options={choices(INDUSTRIES, options.industry)} selected={values.industry} error={errors.industry} onChange={(v) => set("industry", v as string)} />
              <ChipGroup name="category" legend={f.category} options={choices(CATEGORIES, options.category)} selected={values.category} error={errors.category} onChange={(v) => set("category", v as string)} />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <FieldShell id="description" label={f.description} hint={f.descriptionHint} optional={copy.optional} required error={errors.description}>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={values.description}
                  onChange={(e) => set("description", e.target.value)}
                  aria-invalid={errors.description ? true : undefined}
                  aria-describedby={describedBy("description", "hint", errors.description)}
                  className="field resize-y"
                />
              </FieldShell>
              <ChipGroup name="quantity" legend={f.quantity} options={choices(QUANTITIES, options.quantity)} selected={values.quantity} error={errors.quantity} onChange={(v) => set("quantity", v as string)} />
              <ChipGroup name="customization" legend={f.customization} multiple options={choices(CUSTOMIZATIONS, options.customization)} selected={values.customization} error={errors.customization} onChange={(v) => set("customization", v as string[])} />
              <ChipGroup name="designStatus" legend={f.designStatus} options={choices(DESIGN_STATUS, options.designStatus)} selected={values.designStatus} error={errors.designStatus} onChange={(v) => set("designStatus", v as string)} />
            </>
          ) : null}

          {step === 3 ? (
            <>
              <ChipGroup name="budget" legend={f.budget} options={choices(BUDGETS, options.budget)} selected={values.budget} error={errors.budget} onChange={(v) => set("budget", v as string)} />
              <FieldShell id="deliveryDate" label={f.deliveryDate} optional={copy.optional} error={errors.deliveryDate}>
                <input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="date"
                  value={values.deliveryDate}
                  onChange={(e) => set("deliveryDate", e.target.value)}
                  aria-invalid={errors.deliveryDate ? true : undefined}
                  aria-describedby={describedBy("deliveryDate", undefined, errors.deliveryDate)}
                  className="field"
                />
              </FieldShell>
              <FieldShell id="details" label={f.details} optional={copy.optional}>
                <textarea id="details" name="details" rows={4} value={values.details} onChange={(e) => set("details", e.target.value)} className="field resize-y" />
              </FieldShell>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <FieldShell id="file" label={f.file} hint={f.fileHint} optional={copy.optional} error={errors.file}>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept={FILE_ACCEPT}
                  aria-invalid={errors.file ? true : undefined}
                  aria-describedby={describedBy("file", "hint", errors.file)}
                  onChange={(e) => {
                    const chosen = e.target.files?.[0] ?? null;
                    const err = validateFile(chosen, copy.errors);
                    setFile(err ? null : chosen);
                    setErrors((prev) => ({ ...prev, file: err }));
                  }}
                  className="mt-3 block w-full cursor-pointer text-[0.9375rem] file:mr-4 file:cursor-pointer file:rounded-full file:border file:border-charcoal file:bg-transparent file:px-4 file:py-2.5 file:text-[0.875rem] file:text-charcoal"
                />
                {file ? <p className="mt-2 text-[0.875rem] text-charcoal/70">{f.attached}: {file.name}</p> : null}
              </FieldShell>

              <dl className="divide-y divide-charcoal/15 border-y border-charcoal/15 text-[0.9375rem]">
                <Review label={copy.review.you} edit={copy.review.edit} editTemplate={copy.editTemplate} value={`${values.fullName}, ${values.company}. ${values.email}, ${values.country}`} onEdit={() => setStep(0)} />
                <Review label={copy.review.business} edit={copy.review.edit} editTemplate={copy.editTemplate} value={`${options.industry[values.industry] ?? ""}. ${options.category[values.category] ?? ""}`} onEdit={() => setStep(1)} />
                <Review label={copy.review.product} edit={copy.review.edit} editTemplate={copy.editTemplate} value={`${values.description} (${options.quantity[values.quantity] ?? ""}). ${values.customization.map((c) => options.customization[c]).join(", ")}. ${options.designStatus[values.designStatus] ?? ""}`} onEdit={() => setStep(2)} />
                <Review label={copy.review.timing} edit={copy.review.edit} editTemplate={copy.editTemplate} value={`${options.budget[values.budget] ?? ""}${values.deliveryDate ? `. ${copy.review.by} ${values.deliveryDate}` : ""}${values.details ? `. ${values.details}` : ""}`} onEdit={() => setStep(3)} />
              </dl>

              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={values.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    aria-invalid={errors.consent ? true : undefined}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    className="mt-1 h-5 w-5 shrink-0 accent-charcoal"
                  />
                  <span className="text-[0.9375rem]">
                    {copy.consent.before}{" "}
                    <Link href="/legal" target="_blank" className="link-line">{copy.consent.link}</Link>
                    {copy.consent.after}
                  </span>
                </label>
                <FieldError id="consent" error={errors.consent} />
              </div>
            </>
          ) : null}
        </div>

        {status === "failed" ? (
          <p role="alert" className="mt-8 border-l-2 border-[#8f2d18] pl-4 font-medium text-[#8f2d18]">{failure}</p>
        ) : null}

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} disabled={status === "sending"} className="btn btn-line-dark w-full sm:w-auto">
              {copy.buttons.back}
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={status === "sending"} className="btn btn-ink w-full sm:w-auto">
            {status === "sending" ? copy.buttons.sending : last ? copy.buttons.send : copy.buttons.next} {status === "sending" ? null : <Arrow />}
          </button>
        </div>

        <div className="mt-16 hidden text-charcoal/20 lg:block">
          <Wordmark className="h-4 w-auto" />
        </div>
      </div>
    </form>
  );
}

function TextField({
  name,
  label,
  optional,
  values,
  errors,
  set,
  ...rest
}: {
  name: "fullName" | "company" | "email" | "country";
  label: string;
  optional: string;
  values: QuoteValues;
  errors: QuoteErrors;
  set: <K extends keyof QuoteValues>(k: K, v: QuoteValues[K]) => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell id={name} label={label} optional={optional} required error={errors[name]}>
      <input
        id={name}
        name={name}
        type="text"
        value={values[name]}
        onChange={(e) => set(name, e.target.value)}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={describedBy(name, undefined, errors[name])}
        className="field"
        {...rest}
      />
    </FieldShell>
  );
}

function Review({ label, value, edit, editTemplate, onEdit }: { label: string; value: string; edit: string; editTemplate: string; onEdit: () => void }) {
  return (
    <div className="flex items-baseline gap-4 py-3">
      <dt className="w-20 shrink-0 font-medium">{label}</dt>
      <dd className="min-w-0 flex-1 break-words text-charcoal/75">{value}</dd>
      <button type="button" onClick={onEdit} aria-label={editTemplate.replace("{name}", label)} className="link-line shrink-0 text-[0.875rem]">{edit}</button>
    </div>
  );
}
