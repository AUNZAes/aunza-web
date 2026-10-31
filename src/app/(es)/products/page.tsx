import { ProductsView, productsMetadata } from "@/views/products";

export const metadata = productsMetadata("es");

export default function Page() {
  return <ProductsView locale="es" />;
}
