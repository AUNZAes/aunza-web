import { RootShell, rootMetadata, viewport } from "@/components/layout/RootShell";

export const metadata = rootMetadata("en");
export { viewport };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>;
}
