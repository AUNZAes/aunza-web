import { NotFoundView } from "@/views/not-found";

export const metadata = { robots: { index: false } };

// scripts/finish-export.mjs turns this page into the host's /404.html.
export default function Page() {
  return <NotFoundView locale="es" />;
}
