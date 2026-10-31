import type { AssetId } from "@/components/ui/Asset";

// Every button goes to the site's single quote form. `campaign` tags the request; `category` only preselects an answer.
const QUOTE = {
  proposal: "/quote?campaign=christmas",
  giftSet: "/quote?category=corporate-gifts&campaign=christmas",
  packaging: "/quote?category=packaging&campaign=christmas",
  custom: "/quote?category=custom-products&campaign=christmas",
};

export type ChristmasChapter = {
  id: string;
  letter: string;
  name: string;
  headline: string;
  text: string;
  items: string[];
  main: AssetId;
  details: AssetId[];
  cta?: { label: string; href: string };
};

export const christmas = {
  meta: {
    title: "Christmas Collection: Corporate Gifts & Custom Packaging",
    description:
      "Custom Christmas gifts and packaging for businesses: gourmet gifts, corporate gift sets, packaging and projects developed around your brand.",
  },
  hero: {
    label: "AUNZA Christmas Collection",
    lines: ["MAKE THIS", "CHRISTMAS", "MEMORABLE."],
    text: "Thoughtful gifts. Custom-made details. A Christmas collection designed for businesses.",
    cta: { label: "REQUEST A CHRISTMAS PROPOSAL", href: QUOTE.proposal },
  },
  opening: {
    label: "The Christmas gift, opened",
    captions: [
      { at: -0.03, until: 0.16, title: "It starts with a closed box.", note: "Wrapped by hand, with your name on it." },
      { at: 0.19, until: 0.34, title: "The ribbon comes undone.", note: "The first detail anyone notices." },
      { at: 0.37, until: 0.54, title: "Then the lid lifts.", note: "Tissue, seal and what's waiting beneath." },
      { at: 0.57, until: 0.81, title: "Every object carries your brand.", note: "A gift put together around your company." },
      { at: 0.85, until: 1.03, title: "It can start with a single bottle.", note: "Or become a whole Christmas collection." },
    ],
  },
  chapters: [
    {
      id: "gourmet",
      letter: "A",
      name: "Gourmet Gifts",
      headline: "A gift to share at the table.",
      text: "Wine, olive oil, chocolate and biscuits, presented with your own labels and packaging so that the whole gift feels like yours.",
      items: ["Wine and cava with custom labels", "Olive oil with custom packaging", "Chocolate boxes", "Biscuit tins", "Coffee and tea kits", "Gourmet baskets and boxes"],
      main: "XG1",
      details: ["XG2", "XG3"],
      cta: { label: "REQUEST A CHRISTMAS PROPOSAL", href: QUOTE.proposal },
    },
    {
      id: "corporate",
      letter: "B",
      name: "Corporate Gift Sets",
      headline: "Things people choose to keep.",
      text: "Considered sets for employees, clients, partners and collaborators, put together around the people who will receive them.",
      items: ["Insulated bottles", "Notebooks and pens", "Candles", "Blankets and umbrellas", "Desk accessories", "Card holders and welcome kits"],
      main: "XC1",
      details: ["XC2", "P06"],
      cta: { label: "CREATE YOUR GIFT SET", href: QUOTE.giftSet },
    },
    {
      id: "packaging",
      letter: "C",
      name: "Christmas Packaging",
      headline: "Opening it is part of the gift.",
      text: "Boxes, bags, paper, ribbon and seals developed for your Christmas campaign, including what you already sell.",
      items: ["Rigid and magnetic boxes", "Premium bags", "Wrapping and tissue paper", "Labels, cards and stickers", "Ribbons", "Packaging for gourmet products"],
      main: "XP1",
      details: ["XP2", "MD2"],
      cta: { label: "PERSONALIZE YOUR PACKAGING", href: QUOTE.packaging },
    },
  ] as ChristmasChapter[],
  people: {
    id: "people",
    letter: "D",
    name: "Employee & Client Gifts",
    headline: "One Christmas, two kinds of thank you.",
    text: "A company can prepare one collection for its team and another for its clients, with the same identity running through both.",
    team: {
      title: "For your team",
      text: "Sweatshirts, T-shirts, bottles, notebooks and bags, with a card to go with them.",
      image: "XE1" as AssetId,
    },
    clients: {
      title: "For your clients",
      text: "Candles, cards and personalized kits in a box they'll want to hold on to.",
      image: "XE2" as AssetId,
    },
    cta: { label: "REQUEST A CHRISTMAS PROPOSAL", href: QUOTE.proposal },
  },
  custom: {
    id: "custom",
    letter: "E",
    name: "Custom Christmas Projects",
    headline: "Something nobody else will give this year.",
    text: "We can develop a proposal from your company's needs, starting with a sketch, a material or just an idea.",
    items: ["A completely custom Christmas box", "A corporate kit designed from scratch", "A packaging collection for your brand", "A special gift for VIP clients", "A complete Christmas campaign"],
    main: "XJ1" as AssetId,
    detail: "XJ2" as AssetId,
    cta: { label: "START A CUSTOM PROJECT", href: QUOTE.custom },
  },
  final: {
    lines: ["WHAT WILL YOU", "GIVE THIS", "CHRISTMAS?"],
    text: "Tell us what you have in mind. We'll prepare a proposal adapted to your needs, quantities and budget.",
    cta: { label: "REQUEST A CHRISTMAS PROPOSAL", href: QUOTE.proposal },
  },
};
