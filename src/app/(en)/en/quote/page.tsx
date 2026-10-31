import { QuoteView, quoteMetadata } from "@/views/quote";

export const metadata = quoteMetadata("en");

export default function Page() {
  return <QuoteView locale="en" />;
}
