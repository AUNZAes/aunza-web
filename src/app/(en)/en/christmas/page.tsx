import { ChristmasView, christmasMetadata } from "@/views/christmas";

export const metadata = christmasMetadata("en");

export default function Page() {
  return <ChristmasView locale="en" />;
}
