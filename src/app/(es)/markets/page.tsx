import { MarketsView, marketsMetadata } from "@/views/markets";

export const metadata = marketsMetadata("es");

export default function Page() {
  return <MarketsView locale="es" />;
}
