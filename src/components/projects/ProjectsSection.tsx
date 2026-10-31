import Link from "@/components/ui/LocaleLink";
import { Asset } from "@/components/ui/Asset";
import { Arrow } from "@/components/ui/ProductIcon";
import { Lines, SectionLabel } from "@/components/ui/Text";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";

/** The home page's short version: all three at a glance, leading to the projects page. */
export function ProjectsSection({ locale }: { locale: Locale }) {
  const c = getContent(locale).projects;
  return (
    <section data-theme="light" id="projects" className="bg-paper py-24 md:py-36">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-12">
          <SectionLabel className="md:col-span-12">{c.label}</SectionLabel>
          <Lines lines={c.lines} className="headline md:col-span-8" />
          <p data-reveal className="lede self-end md:col-span-4">{c.text}</p>
        </div>

        <ul className="mt-14 grid gap-x-6 gap-y-12 md:mt-20 md:grid-cols-3">
          {c.items.map((p) => (
            <li key={p.id}>
              <Link href={`/projects#${p.id}`} data-reveal className="group block">
                <div className="card-media relative aspect-[3/2] overflow-hidden">
                  <Asset id={p.image} sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <p className="label mt-5 text-charcoal/70">{p.name}</p>
                <h3 className="mt-2 text-xl font-medium leading-snug tracking-[-0.02em] md:text-[1.5rem]">{p.headline}</h3>
              </Link>
            </li>
          ))}
        </ul>

        <Link data-reveal href="/projects" className="btn btn-line-dark mt-14 w-full sm:w-auto">
          {c.viewAll} <Arrow />
        </Link>
      </div>
    </section>
  );
}
