import type { AssetId } from "@/components/ui/Asset";

export type Project = {
  id: string;
  name: string;
  headline: string;
  text: string;
  items: string[];
  image: AssetId;
};

// Real, delivered work only, shown with permission. Nothing here that hasn't been confirmed: no quantities, results or quotes.
export const projects = {
  meta: {
    title: "Projects",
    description: "Custom cups and napkins, branded team items and a Christmas gift box: projects AUNZA has delivered.",
  },
  label: "Projects",
  lines: ["IDEAS THAT", "ARE ALREADY REAL."],
  text: "Three projects we've delivered, from the first idea to the finished product.",
  viewAll: "View the projects",
  cta: { title: "Your project could be next.", label: "START YOUR PROJECT", href: "/quote" },
  items: [
    {
      id: "jan-food-catering",
      name: "Jan Food Catering",
      headline: "From generic to a look of its own.",
      text: "Jan Food Catering was serving with generic cups and napkins that carried no logo. We created cups in two sizes and two designs, with matching napkins, so its brand would be present throughout the service.",
      items: ["Cups in two sizes and two designs", "Matching napkins"],
      image: "PJ1",
    },
    {
      id: "propo",
      name: "Propo",
      headline: "One identity for the whole team.",
      text: "Polo shirt, notebook, lanyard with badge holder and mug, customized with Propo's identity so every piece works as one set.",
      items: ["Polo shirt", "Notebook", "Lanyard with badge holder", "Mug"],
      image: "PJ2",
    },
    {
      id: "arantxa-events",
      name: "Arantxa Events",
      headline: "A thank-you you can open.",
      text: "Arantxa Events wanted to thank its best clients at Christmas. We created a custom Christmas box with a bottle of wine inside.",
      items: ["Custom Christmas box", "A bottle of wine inside"],
      image: "PJ3",
    },
  ] as Project[],
};
