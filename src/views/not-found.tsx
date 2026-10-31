import Link from "@/components/ui/LocaleLink";
import { Arrow } from "@/components/ui/ProductIcon";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";

type Props = { locale: Locale };

export function NotFoundView({ locale }: Props) {
  const c = getContent(locale).pages.notFound;
  return (
    <section data-theme="dark" className="flex min-h-svh flex-col justify-end bg-charcoal pb-16 pt-32 text-paper">
      <div className="wrap">
        <p className="label text-paper/60">{c.label}</p>
        <h1 className="display mt-6 !text-[clamp(2.9rem,10vw,10rem)]">{c.headline}</h1>
        <Link href="/" className="btn btn-paper mt-10 w-full sm:w-auto">
          {c.back} <Arrow />
        </Link>
      </div>
    </section>
  );
}
