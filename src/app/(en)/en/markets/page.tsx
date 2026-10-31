import { MarketsView, marketsMetadata } from "@/views/markets";

export const metadata = marketsMetadata("en");

export default function Page() {
  return <MarketsView locale="en" />;
}
