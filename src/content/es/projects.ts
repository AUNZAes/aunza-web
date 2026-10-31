import type { Project, projects as en } from "../en/projects";

export const projects: typeof en = {
  meta: {
    title: "Proyectos",
    description: "Vasos y servilletas personalizados, artículos de marca para equipos y una caja de regalo navideña: proyectos entregados por AUNZA.",
  },
  label: "Proyectos",
  lines: ["IDEAS QUE", "YA SON REALES."],
  text: "Tres proyectos ya entregados, de la primera idea al producto terminado.",
  viewAll: "Ver los proyectos",
  cta: { title: "El próximo puede ser el tuyo.", label: "EMPEZAR MI PROYECTO", href: "/quote" },
  items: [
    {
      id: "jan-food-catering",
      name: "Jan Food Catering",
      headline: "De lo genérico a una imagen propia.",
      text: "Jan Food Catering servía con vasos y servilletas genéricos, sin su logo. Creamos vasos en dos tamaños y dos diseños, y servilletas a juego, para que su marca estuviera presente en todo el servicio.",
      items: ["Vasos en dos tamaños y dos diseños", "Servilletas a juego"],
      image: "PJ1",
    },
    {
      id: "propo",
      name: "Propo",
      headline: "Una identidad para todo el equipo.",
      text: "Polo, libreta, lanyard con acreditación y taza, personalizados con la identidad de Propo para que todas las piezas formen un mismo conjunto.",
      items: ["Polo", "Libreta", "Lanyard con acreditación", "Taza"],
      image: "PJ2",
    },
    {
      id: "arantxa-events",
      name: "Arantxa Events",
      headline: "Un agradecimiento que se abre.",
      text: "Arantxa Events quería dar las gracias a sus mejores clientes por Navidad. Creamos una caja navideña personalizada con un vino en su interior.",
      items: ["Caja navideña personalizada", "Una botella de vino en su interior"],
      image: "PJ3",
    },
  ] as Project[],
};
