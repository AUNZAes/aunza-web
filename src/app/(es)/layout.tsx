import { RootShell, rootMetadata, viewport } from "@/components/layout/RootShell";

export const metadata = rootMetadata("es");
export { viewport };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="es">{children}</RootShell>;
}
