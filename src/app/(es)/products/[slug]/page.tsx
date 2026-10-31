import type { Metadata } from "next";
import { ProductView, productMetadata, productParams } from "@/views/products";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = productParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return productMetadata((await params).slug, "es");
}

export default async function Page({ params }: Props) {
  return <ProductView slug={(await params).slug} locale="es" />;
}
