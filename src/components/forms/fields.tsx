"use client";

import type { ReactNode } from "react";
import Link from "@/components/ui/LocaleLink";

export function FieldShell({ id, label, hint, error, required, optional, children }: { id: string; label: string; hint?: string; error?: string; required?: boolean; optional: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.9375rem] font-medium tracking-[-0.01em]">
        {label}
        {required ? null : <span className="ml-2 font-normal text-charcoal/55">{optional}</span>}
      </label>
      {hint ? <p id={`${id}-hint`} className="mt-0.5 text-[0.875rem] text-charcoal/65">{hint}</p> : null}
      {children}
      <FieldError id={id} error={error} />
    </div>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? (
    <p id={`${id}-error`} className="mt-2 text-[0.875rem] font-medium text-[#8f2d18]">
      {error}
    </p>
  ) : null;
}

export function describedBy(id: string, hint?: string, error?: string) {
  return [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
}

/** The first layer of privacy information, shown right above the consent box. */
export function PrivacyInfo({ copy }: { copy: { title: string; rows: string[][]; more: { label: string; before: string; link: string; after: string } } }) {
  return (
    <div className="border-l-2 border-charcoal/20 pl-4 text-[0.8125rem] leading-relaxed text-charcoal/75">
      <p className="font-medium text-charcoal">{copy.title}</p>
      {copy.rows.map(([label, text]) => (
        <p key={label} className="mt-1"><span className="font-medium">{label}:</span> {text}</p>
      ))}
      <p className="mt-1">
        <span className="font-medium">{copy.more.label}:</span> {copy.more.before}{" "}
        <Link href="/legal#privacy" target="_blank" className="link-line">{copy.more.link}</Link>{copy.more.after}
      </p>
    </div>
  );
}

type Choice = string | { value: string; label: string };
const value = (c: Choice) => (typeof c === "string" ? c : c.value);
const text = (c: Choice) => (typeof c === "string" ? c : c.label);

/** Chips built on real radio or checkbox inputs, so keyboard and screen readers just work. */
export function ChipGroup({
  name,
  legend,
  options,
  selected,
  multiple,
  error,
  onChange,
}: {
  name: string;
  legend: string;
  options: Choice[];
  selected: string | string[];
  multiple?: boolean;
  error?: string;
  onChange: (next: string | string[]) => void;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="text-[0.9375rem] font-medium tracking-[-0.01em]">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const v = value(o);
          const checked = multiple ? (selected as string[]).includes(v) : selected === v;
          return (
            <label key={v} className="cursor-pointer">
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={v}
                checked={checked}
                className="sr-only"
                aria-invalid={error ? true : undefined}
                onChange={() => {
                  if (!multiple) return onChange(v);
                  const list = selected as string[];
                  onChange(checked ? list.filter((x) => x !== v) : [...list, v]);
                }}
              />
              <span className="chip">{text(o)}</span>
            </label>
          );
        })}
      </div>
      <FieldError id={name} error={error} />
    </fieldset>
  );
}

export function Honeypot({ onChange }: { onChange?: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" onChange={(e) => onChange?.(e.target.value)} />
      </label>
    </div>
  );
}
