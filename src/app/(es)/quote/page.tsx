import { QuoteView, quoteMetadata } from "@/views/quote";

export const metadata = quoteMetadata("es");

export default function Page() {
  return <QuoteView locale="es" />;
}
