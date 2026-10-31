import type { Metadata } from "next";
import { MarketView, marketMetadata, marketParams } from "@/views/markets";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = marketParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return marketMetadata((await params).slug, "en");
}

export default async function Page({ params }: Props) {
  return <MarketView slug={(await params).slug} locale="en" />;
}
