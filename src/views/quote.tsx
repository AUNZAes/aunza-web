import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { getContent } from "@/content";
import { alternates, type Locale } from "@/i18n/config";

type Props = { locale: Locale };

export const quoteMetadata = (locale: Locale): Metadata => ({ ...getContent(locale).form.quote.meta, alternates: alternates("/quote", locale) });

export function QuoteView({ locale }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { progressText, review: { editLabel, ...review }, done, meta, ...copy } = getContent(locale).form.quote;
  return (
    <section data-theme="light" className="min-h-svh bg-sand pb-20 pt-[calc(var(--header-h)+2rem)] md:pt-[calc(var(--header-h)+3.5rem)]">
      <div className="wrap">
        <Suspense>
          <QuoteForm
            locale={locale}
            copy={{
              ...copy,
              review,
              done: { headline: done.headline, back: done.back, text: done.text("{email}") },
              progressTemplate: progressText(0, 0, "{name}").replace("0", "{step}").replace("0", "{total}"),
              editTemplate: editLabel("{name}"),
            }}
          />
        </Suspense>
      </div>
    </section>
  );
}
