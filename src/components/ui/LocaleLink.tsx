"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { localeOf, localePath } from "@/i18n/config";

/** A link that stays in the current language. Content and components only ever deal in unprefixed paths. */
export default function LocaleLink({ href, ...props }: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  const pathname = usePathname();
  return <NextLink href={localePath(localeOf(pathname), href)} {...props} />;
}
