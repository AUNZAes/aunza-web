import { ChristmasView, christmasMetadata } from "@/views/christmas";

export const metadata = christmasMetadata("es");

export default function Page() {
  return <ChristmasView locale="es" />;
}
