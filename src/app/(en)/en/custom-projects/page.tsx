import { CustomProjectsView, customMetadata } from "@/views/custom-projects";

export const metadata = customMetadata("en");

export default function Page() {
  return <CustomProjectsView locale="en" />;
}
