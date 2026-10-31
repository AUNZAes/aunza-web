import Link from "@/components/ui/LocaleLink";
import { Asset } from "@/components/ui/Asset";
import { Arrow } from "@/components/ui/ProductIcon";
import type { DetailPage } from "@/content/types";

/** Grid of market or product family cards, with the first of every five shown large. */
export function IndexGrid({ items, base }: { items: DetailPage[]; base: string }) {
  return (
    <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-6">
      {items.map((item, i) => {
        const big = i % 5 === 0 || i % 5 === 1;
        return (
          <li key={item.slug} className={big ? "lg:col-span-3" : "lg:col-span-2"}>
            <Link href={`${base}/${item.slug}`} data-reveal className="group block">
              <div className={`card-media relative overflow-hidden ${big ? "aspect-[3/2]" : "aspect-[4/5] md:aspect-[3/2] lg:aspect-[4/5]"}`}>
                <Asset id={item.hero} sizes={big ? "(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"} alt="" />
              </div>
              <h2 className="mt-4 flex items-center justify-between gap-4 text-xl font-medium tracking-[-0.02em] md:text-[1.625rem]">
                {item.name}
                <Arrow className="w-6 shrink-0 transition-transform duration-500 ease-[var(--ease-brand)] group-hover:translate-x-1.5" />
              </h2>
              <p className="mt-1 max-w-[32em] text-[0.9375rem] text-charcoal/70">{item.short}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
