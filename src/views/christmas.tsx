import type { Metadata } from "next";
import { ChristmasChapterSection, ChristmasCustom, ChristmasFinal, ChristmasHero, ChristmasPeople } from "@/components/christmas/Sections";
import { GiftExperience } from "@/components/christmas/GiftExperience";
import { getContent } from "@/content";
import { alternates, type Locale } from "@/i18n/config";

type Props = { locale: Locale };

export const christmasMetadata = (locale: Locale): Metadata => ({ ...getContent(locale).christmas.meta, alternates: alternates("/christmas", locale) });

export function ChristmasView({ locale }: Props) {
  const c = getContent(locale).christmas;
  return (
    <>
      <ChristmasHero locale={locale} />
      <GiftExperience copy={c.opening} />
      {c.chapters.map((chapter, i) => (
        <ChristmasChapterSection key={chapter.id} chapter={chapter} tone={i % 2 ? "paper" : "sand"} />
      ))}
      <ChristmasPeople locale={locale} />
      <ChristmasCustom locale={locale} />
      <ChristmasFinal locale={locale} />
    </>
  );
}
