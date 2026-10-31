import { ContactView, contactMetadata } from "@/views/contact";

export const metadata = contactMetadata("es");

export default function Page() {
  return <ContactView locale="es" />;
}
