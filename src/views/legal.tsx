import type { Metadata } from "next";
import { getContent } from "@/content";
import { alternates, type Locale } from "@/i18n/config";

type Props = { locale: Locale };

export const legalMetadata = (locale: Locale): Metadata => ({ ...getContent(locale).legal.meta, alternates: alternates("/legal", locale), robots: { index: false } });

const INLINE = /(\*\*.+?\*\*|hola@aunza\.es|https:\/\/[^\s]+?(?=[.,]?(?:\s|$)))/;

/** Legal copy is plain text: bold labels are marked with **, and email and web addresses become links. */
function Inline({ text }: { text: string }) {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**")) return <strong key={i} className="font-medium text-charcoal"><Inline text={part.slice(2, -2)} /></strong>;
    if (part === "hola@aunza.es") return <a key={i} href={`mailto:${part}`} className="link-line">{part}</a>;
    if (part.startsWith("https://")) return <a key={i} href={part} className="link-line">{part}</a>;
    return part;
  });
}

export function LegalView({ locale }: Props) {
  const c = getContent(locale).legal;
  return (
    <section data-theme="light" className="bg-paper pb-24 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
      <div className="wrap max-w-[52rem]">
        <h1 className="headline">{c.title}</h1>
        <p className="mt-6 text-charcoal/70">{c.updated}</p>
        {c.note ? <p className="mt-6 border-l-2 border-terracotta pl-4 text-charcoal/80">{c.note}</p> : null}
        <nav aria-label={c.index} className="mt-10 border-y border-charcoal/15 py-6">
          <p className="label text-charcoal/60">{c.index}</p>
          <ul className="mt-3 space-y-2">
            {c.parts.map((part) => (
              <li key={part.id}><a href={`#${part.id}`} className="link-line">{part.title}</a></li>
            ))}
          </ul>
        </nav>
        {c.parts.map((part) => (
          <section key={part.id} id={part.id} className="mt-16 scroll-mt-[calc(var(--header-h)+1.5rem)] [&_h3]:mt-9 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:tracking-[-0.01em] [&_h4]:mt-5 [&_h4]:font-medium [&_p]:mt-3 [&_p]:text-charcoal/80 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-charcoal/80">
            <h2 className="text-3xl font-medium tracking-[-0.02em]">{part.title}</h2>
            {part.blocks.map((b, i) => {
              if ("h" in b) return <h3 key={i}>{b.h}</h3>;
              if ("sub" in b) return <h4 key={i}>{b.sub}</h4>;
              if ("ul" in b) return <ul key={i}>{b.ul.map((item) => <li key={item}><Inline text={item} /></li>)}</ul>;
              return <p key={i}><Inline text={b.p} /></p>;
            })}
          </section>
        ))}
      </div>
    </section>
  );
}
