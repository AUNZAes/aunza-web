import { ProductsView, productsMetadata } from "@/views/products";

export const metadata = productsMetadata("en");

export default function Page() {
  return <ProductsView locale="en" />;
}
