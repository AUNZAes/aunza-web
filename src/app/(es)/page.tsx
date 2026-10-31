import { HomeView, homeMetadata } from "@/views/home";

export const metadata = homeMetadata("es");

export default function Page() {
  return <HomeView locale="es" />;
}
