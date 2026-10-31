import { NotFoundView } from "@/views/not-found";

export const metadata = { robots: { index: false } };

export default function Page() {
  return <NotFoundView locale="en" />;
}
