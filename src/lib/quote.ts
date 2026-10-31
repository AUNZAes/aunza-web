// Shared by the browser form and the API route, so both validate by exactly the same rules.
// Values are stable, language-free identifiers; every label and message comes from the content dictionaries.

export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const FILE_ACCEPT = ".jpg,.jpeg,.png,.webp,.pdf,.ai,.eps,.svg";
const FILE_EXTENSIONS = FILE_ACCEPT.split(",");

export const INDUSTRIES = ["hospitality", "retail", "corporate", "events", "fashion", "beauty", "hotels", "sports", "other"];

export const CATEGORIES = ["packaging", "drinkware", "bags", "apparel", "stationery", "corporate-gifts", "hospitality", "beauty-wellness", "custom-products"];

/** Campaigns a request can be tagged with through `?campaign=`. Anything else is ignored. */
export const CAMPAIGNS = [{ value: "christmas", label: "Christmas" }];

export const QUANTITIES = ["Under 100", "100 to 500", "500 to 1,000", "1,000 to 5,000", "5,000 to 10,000", "More than 10,000", "Not sure yet"];

export const BUDGETS = ["Under €1,000", "€1,000 to €5,000", "€5,000 to €10,000", "€10,000 to €50,000", "More than €50,000", "Not sure yet"];

export const CUSTOMIZATIONS = ["Logo print", "Full-surface print", "Embroidery", "Engraving", "Custom colours", "Custom shape or size", "Custom packaging", "Not sure yet"];

export const DESIGN_STATUS = ["ready", "logo-only", "none"];

export type QuoteValues = {
  fullName: string;
  company: string;
  email: string;
  country: string;
  industry: string;
  category: string;
  description: string;
  quantity: string;
  customization: string[];
  designStatus: string;
  budget: string;
  deliveryDate: string;
  details: string;
  consent: boolean;
};

export const EMPTY_QUOTE: QuoteValues = {
  fullName: "",
  company: "",
  email: "",
  country: "",
  industry: "",
  category: "",
  description: "",
  quantity: "",
  customization: [],
  designStatus: "",
  budget: "",
  deliveryDate: "",
  details: "",
  consent: false,
};

export type QuoteErrors = Partial<Record<keyof QuoteValues | "file", string>>;

/** The validation messages, in the visitor's language. */
export type ErrorCopy = Record<Exclude<keyof QuoteValues, "details"> | "fileSize" | "fileType", string>;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Fields shown on each step, in order. */
export const STEP_FIELDS: (keyof QuoteValues)[][] = [
  ["fullName", "company", "email", "country"],
  ["industry", "category"],
  ["description", "quantity", "customization", "designStatus"],
  ["budget", "deliveryDate", "details"],
  ["consent"],
];

export function validateField(name: keyof QuoteValues, v: QuoteValues, copy: ErrorCopy): string | undefined {
  switch (name) {
    case "fullName":
      return v.fullName.trim().length < 2 ? copy.fullName : undefined;
    case "company":
      return v.company.trim().length < 2 ? copy.company : undefined;
    case "email":
      return EMAIL_RE.test(v.email.trim()) ? undefined : copy.email;
    case "country":
      return v.country.trim().length < 2 ? copy.country : undefined;
    case "industry":
      return v.industry ? undefined : copy.industry;
    case "category":
      return v.category ? undefined : copy.category;
    case "description":
      return v.description.trim().length < 10 ? copy.description : undefined;
    case "quantity":
      return v.quantity ? undefined : copy.quantity;
    case "customization":
      return v.customization.length ? undefined : copy.customization;
    case "designStatus":
      return v.designStatus ? undefined : copy.designStatus;
    case "budget":
      return v.budget ? undefined : copy.budget;
    case "deliveryDate": {
      if (!v.deliveryDate) return undefined;
      const d = new Date(`${v.deliveryDate}T23:59:59`);
      return Number.isNaN(d.getTime()) || d.getTime() < Date.now() ? copy.deliveryDate : undefined;
    }
    case "consent":
      return v.consent ? undefined : copy.consent;
    default:
      return undefined;
  }
}

export function validateStep(step: number, v: QuoteValues, copy: ErrorCopy): QuoteErrors {
  const errors: QuoteErrors = {};
  for (const name of STEP_FIELDS[step]) {
    const e = validateField(name, v, copy);
    if (e) errors[name] = e;
  }
  return errors;
}

export function validateQuote(v: QuoteValues, copy: ErrorCopy): QuoteErrors {
  return STEP_FIELDS.reduce<QuoteErrors>((all, _, i) => ({ ...all, ...validateStep(i, v, copy) }), {});
}

export function validateFile(file: { name: string; size: number } | null, copy: ErrorCopy): string | undefined {
  if (!file || file.size === 0) return undefined;
  if (file.size > MAX_FILE_BYTES) return copy.fileSize;
  const name = file.name.toLowerCase();
  if (!FILE_EXTENSIONS.some((ext) => name.endsWith(ext))) return copy.fileType;
  return undefined;
}
