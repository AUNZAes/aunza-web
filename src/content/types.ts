import type { AssetId } from "@/components/ui/Asset";

export type Item = { name: string; note?: string };

export type DetailPage = {
  slug: string;
  name: string;
  /** One line for cards and metadata. */
  short: string;
  headline: string;
  intro: string;
  products: Item[];
  customization: Item[];
  applications: Item[];
  /** Product family slugs. */
  related: string[];
  hero: AssetId;
  detail: AssetId;
};

export type Market = DetailPage & {
  /** The audience line, shown on the market grid. */
  who: string;
};

export type ProductFamily = DetailPage;
