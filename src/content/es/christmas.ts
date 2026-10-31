import type { christmas as en, ChristmasChapter } from "../en/christmas";

const QUOTE = {
  proposal: "/quote?campaign=christmas",
  giftSet: "/quote?category=corporate-gifts&campaign=christmas",
  packaging: "/quote?category=packaging&campaign=christmas",
  custom: "/quote?category=custom-products&campaign=christmas",
};

export const christmas: typeof en = {
  meta: {
    title: "Colección de Navidad: regalos de empresa y packaging a medida",
    description:
      "Regalos de Navidad y packaging personalizados para empresas: regalos gourmet, sets corporativos, packaging y proyectos desarrollados en torno a tu marca.",
  },
  hero: {
    label: "Colección de Navidad AUNZA",
    lines: ["QUE ESTA", "NAVIDAD SE", "RECUERDE."],
    text: "Regalos bien pensados. Detalles hechos a medida. Una colección de Navidad diseñada para empresas.",
    cta: { label: "PEDIR UNA PROPUESTA DE NAVIDAD", href: QUOTE.proposal },
  },
  opening: {
    label: "El regalo de Navidad, abierto",
    captions: [
      { at: -0.03, until: 0.16, title: "Empieza con una caja cerrada.", note: "Envuelta a mano, con tu nombre." },
      { at: 0.19, until: 0.34, title: "La cinta se suelta.", note: "El primer detalle en el que se fija todo el mundo." },
      { at: 0.37, until: 0.54, title: "Y se levanta la tapa.", note: "Papel de seda, un sello y lo que espera debajo." },
      { at: 0.57, until: 0.81, title: "Cada objeto lleva tu marca.", note: "Un regalo pensado en torno a tu empresa." },
      { at: 0.85, until: 1.03, title: "Puede empezar con una sola botella.", note: "O convertirse en toda una colección de Navidad." },
    ],
  },
  chapters: [
    {
      id: "gourmet",
      letter: "A",
      name: "Regalos gourmet",
      headline: "Un regalo para compartir en la mesa.",
      text: "Vino, aceite de oliva, chocolate y galletas, presentados con tus propias etiquetas y tu packaging para que todo el regalo se sienta tuyo.",
      items: ["Vino y cava con etiquetas personalizadas", "Aceite de oliva con packaging a medida", "Cajas de bombones", "Latas de galletas", "Kits de café y té", "Cestas y cajas gourmet"],
      main: "XG1",
      details: ["XG2", "XG3"],
      cta: { label: "PEDIR UNA PROPUESTA DE NAVIDAD", href: QUOTE.proposal },
    },
    {
      id: "corporate",
      letter: "B",
      name: "Sets de regalo corporativo",
      headline: "Cosas que la gente decide conservar.",
      text: "Sets bien pensados para empleados, clientes, socios y colaboradores, preparados en función de quien los va a recibir.",
      items: ["Botellas térmicas", "Cuadernos y bolígrafos", "Velas", "Mantas y paraguas", "Accesorios de escritorio", "Tarjeteros y kits de bienvenida"],
      main: "XC1",
      details: ["XC2", "P06"],
      cta: { label: "CREAR MI SET DE REGALO", href: QUOTE.giftSet },
    },
    {
      id: "packaging",
      letter: "C",
      name: "Packaging de Navidad",
      headline: "Abrirlo también es parte del regalo.",
      text: "Cajas, bolsas, papel, cinta y sellos desarrollados para tu campaña de Navidad, también para lo que ya vendes.",
      items: ["Cajas rígidas y magnéticas", "Bolsas premium", "Papel de regalo y de seda", "Etiquetas, tarjetas y adhesivos", "Cintas", "Packaging para productos gourmet"],
      main: "XP1",
      details: ["XP2", "MD2"],
      cta: { label: "PERSONALIZAR MI PACKAGING", href: QUOTE.packaging },
    },
  ] as ChristmasChapter[],
  people: {
    id: "people",
    letter: "D",
    name: "Regalos para equipos y clientes",
    headline: "Una Navidad, dos formas de dar las gracias.",
    text: "Una empresa puede preparar una colección para su equipo y otra para sus clientes, con la misma identidad presente en las dos.",
    team: {
      title: "Para tu equipo",
      text: "Sudaderas, camisetas, botellas, cuadernos y bolsas, con una tarjeta que los acompañe.",
      image: "XE1",
    },
    clients: {
      title: "Para tus clientes",
      text: "Velas, tarjetas y kits personalizados en una caja que querrán conservar.",
      image: "XE2",
    },
    cta: { label: "PEDIR UNA PROPUESTA DE NAVIDAD", href: QUOTE.proposal },
  },
  custom: {
    id: "custom",
    letter: "E",
    name: "Proyectos de Navidad a medida",
    headline: "Algo que nadie más regalará este año.",
    text: "Podemos desarrollar una propuesta a partir de las necesidades de tu empresa, empezando por un boceto, un material o solo una idea.",
    items: ["Una caja de Navidad completamente a medida", "Un kit corporativo diseñado desde cero", "Una colección de packaging para tu marca", "Un regalo especial para clientes VIP", "Una campaña de Navidad completa"],
    main: "XJ1",
    detail: "XJ2",
    cta: { label: "EMPEZAR UN PROYECTO A MEDIDA", href: QUOTE.custom },
  },
  final: {
    lines: ["¿QUÉ VAS A", "REGALAR ESTA", "NAVIDAD?"],
    text: "Cuéntanos qué tienes en mente. Prepararemos una propuesta adaptada a tus necesidades, tus cantidades y tu presupuesto.",
    cta: { label: "PEDIR UNA PROPUESTA DE NAVIDAD", href: QUOTE.proposal },
  },
};
