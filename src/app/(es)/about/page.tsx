import { AboutView, aboutMetadata } from "@/views/about";

export const metadata = aboutMetadata("es");

export default function Page() {
  return <AboutView locale="es" />;
}
