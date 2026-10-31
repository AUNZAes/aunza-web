import { ProjectsView, projectsMetadata } from "@/views/projects";

export const metadata = projectsMetadata("es");

export default function Page() {
  return <ProjectsView locale="es" />;
}
