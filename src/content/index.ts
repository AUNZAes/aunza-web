import * as enSite from "./en/site";
import { christmas as enChristmas } from "./en/christmas";
import { form as enForm } from "./en/form";
import { legal as enLegal } from "./en/legal";
import { markets as enMarkets } from "./en/markets";
import { products as enProducts } from "./en/products";
import { projects as enProjects } from "./en/projects";
import * as esSite from "./es/site";
import { christmas as esChristmas } from "./es/christmas";
import { form as esForm } from "./es/form";
import { legal as esLegal } from "./es/legal";
import { markets as esMarkets } from "./es/markets";
import { products as esProducts } from "./es/products";
import { projects as esProjects } from "./es/projects";
import type { Locale } from "@/i18n/config";

// Server-side only. Client components receive just the slices of copy they need, as props,
// so that a page never ships the other language or the rest of the dictionary.
const en = { ...enSite, christmas: enChristmas, form: enForm, legal: enLegal, markets: enMarkets, products: enProducts, projects: enProjects };

export type Content = typeof en;

const dictionaries: Record<Locale, Content> = {
  en,
  es: { ...esSite, christmas: esChristmas, form: esForm, legal: esLegal, markets: esMarkets, products: esProducts, projects: esProjects },
};

export const getContent = (locale: Locale): Content => dictionaries[locale];

export const getMarket = (slug: string, locale: Locale) => dictionaries[locale].markets.find((m) => m.slug === slug);
export const getProduct = (slug: string, locale: Locale) => dictionaries[locale].products.find((p) => p.slug === slug);
