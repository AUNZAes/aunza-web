import { CustomProjectsView, customMetadata } from "@/views/custom-projects";

export const metadata = customMetadata("es");

export default function Page() {
  return <CustomProjectsView locale="es" />;
}
