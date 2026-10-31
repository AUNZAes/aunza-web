import { ContactView, contactMetadata } from "@/views/contact";

export const metadata = contactMetadata("en");

export default function Page() {
  return <ContactView locale="en" />;
}
