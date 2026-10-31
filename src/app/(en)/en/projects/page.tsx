import { ProjectsView, projectsMetadata } from "@/views/projects";

export const metadata = projectsMetadata("en");

export default function Page() {
  return <ProjectsView locale="en" />;
}
