import type { Metadata } from "next";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { BrandIntro, CustomProjects, FinalCta, Hero, Markets, WhyAunza } from "@/components/home/Sections";
import { CupExperience } from "@/components/home/CupExperience";
import { Collections } from "@/components/home/Collections";
import { MerchReveal } from "@/components/home/MerchReveal";
import { Process } from "@/components/home/Process";
import { getContent } from "@/content";
import { alternates, type Locale } from "@/i18n/config";

type Props = { locale: Locale };

export const homeMetadata = (locale: Locale): Metadata => ({ alternates: alternates("/", locale) });

export function HomeView({ locale }: Props) {
  const { home, products } = getContent(locale);
  return (
    <>
      <Hero locale={locale} />
      <BrandIntro locale={locale} />
      <CupExperience copy={home.transformation} />
      <Markets locale={locale} />
      <Collections copy={home.collections} products={products.map(({ slug, name, short, hero }) => ({ slug, name, short, hero }))} />
      <MerchReveal copy={home.collections} />
      <Process copy={home.process} />
      <CustomProjects locale={locale} />
      <ProjectsSection locale={locale} />
      <WhyAunza locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}
