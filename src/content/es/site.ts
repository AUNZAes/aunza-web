import type { about as enAbout, contact as enContact, customProjects as enCustomProjects, detail as enDetail, experiences as enExperiences, home as enHome, pages as enPages, site as enSite } from "../en/site";

// Escrito en castellano, no traducido: tuteo, tono directo y frases pensadas para sonar naturales en España.

export const site: typeof enSite = {
  name: "AUNZA",
  tagline: "IDEAS HECHAS REALIDAD.",
  secondary: "Tu marca, en todas partes.",
  metaTitle: "AUNZA — Productos personalizados para empresas",
  description:
    "AUNZA crea productos personalizados para empresas: packaging, vasos y botellas, ropa, regalos corporativos y productos desarrollados a partir de tu idea.",
  nav: [
    { href: "/products", label: "Productos" },
    { href: "/markets", label: "Sectores" },
    { href: "/projects", label: "Proyectos" },
    { href: "/custom-projects", label: "Proyectos a medida" },
    { href: "/christmas", label: "Navidad" },
    { href: "/about", label: "Nosotros" },
    { href: "/contact", label: "Contacto" },
  ],
  quoteLabel: "Pedir presupuesto",
  footer: { products: "Productos", markets: "Sectores", legal: "Aviso legal y privacidad" },
  a11y: {
    skip: "Saltar al contenido",
    home: "AUNZA, inicio",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    mainNav: "Principal",
    mobileNav: "Móvil",
    language: "Idioma",
  },
};

export const home: typeof enHome = {
  hero: {
    lines: ["IDEAS", "HECHAS", "REALIDAD."],
    size: "min(7.2vw, 13svh)",
    text: "Desde lo más cotidiano hasta experiencias de marca únicas. Convertimos tus ideas en productos a medida.",
    primary: "VER NUESTROS PRODUCTOS",
    secondary: "EMPEZAR MI PROYECTO",
  },
  intro: {
    headline: "TU MARCA MERECE QUE LA VEAN.",
    text: "Cada empresa tiene su propia identidad. Te ayudamos a darle vida con productos diseñados en torno a tu marca.",
  },
  transformation: {
    label: "La transformación del producto",
    headline: "DE UNA IDEA SENCILLA A ALGO REAL.",
    text: "Descubre cómo un solo producto puede convertirse en toda una experiencia de marca.",
    closing: ["UN PRODUCTO.", "INFINITAS POSIBILIDADES."],
    stages: [
      { at: 0.03, until: 0.15, title: "Todo empieza con un objeto.", note: "Un vaso sencillo. Una superficie en blanco." },
      { at: 0.17, until: 0.3, title: "Aparece tu identidad.", note: "Tu logo, colocado con cuidado." },
      { at: 0.32, until: 0.47, title: "El color que necesites.", note: "Ajustado a tu marca." },
      { at: 0.49, until: 0.63, title: "Gráficos que lo envuelven.", note: "Cada lado tiene algo que decir." },
      { at: 0.66, until: 0.84, title: "Y entonces, crece.", note: "Bolsa, servilleta y caja de comida: una sola identidad." },
    ],
  },
  markets: {
    label: "Nuestros sectores",
    lines: ["UNA MARCA.", "TODOS LOS SECTORES."],
    text: "Empresas distintas. Necesidades distintas. Un mismo enfoque: hacer tangible tu marca.",
    discover: "Descubrir",
  },
  collections: {
    label: "Colecciones de producto",
    lines: ["HECHO A LA MEDIDA", "DE TU MARCA."],
    text: "Esto es un punto de partida, no un límite. Trabajamos con muchos más productos de los que ves aquí.",
    different: "¿Buscas algo distinto? Cuéntanos qué tienes en mente.",
    cta: "PEDIR UN PRODUCTO A MEDIDA",
    merchLabel: "Una identidad en todo",
    merchHeadline: "Una colección, pieza a pieza.",
    merch: [
      { id: "G01", name: "Botella" },
      { id: "G02", name: "Cuaderno" },
      { id: "G03", name: "Bolsa de tela" },
      { id: "G04", name: "Bolígrafo" },
      { id: "G05", name: "Sudadera" },
      { id: "G06", name: "Vaso de café" },
    ],
  },
  process: {
    label: "Cómo funciona",
    headline: "TU IDEA. NUESTRO PROCESO.",
    lines: ["TU IDEA.", "NUESTRO PROCESO."],
    stages: [
      { n: "01", title: "DESCUBRIR", text: "Conocemos tu empresa, tus necesidades y tu visión.", image: "D01" },
      { n: "02", title: "DISEÑAR", text: "Exploramos materiales, opciones de personalización y posibilidades de producto.", image: "D02" },
      { n: "03", title: "CREAR", text: "Tus productos se fabrican según las especificaciones aprobadas.", image: "D03" },
      { n: "04", title: "ENTREGAR", text: "Coordinamos la entrega de tu pedido.", image: "D04" },
    ],
  },
  custom: {
    label: "Proyectos a medida",
    lines: ["NADA CORRIENTE.", "NADA DE CATÁLOGO."],
    text: "Hay ideas que necesitan algo diferente. Cuéntanos qué quieres crear y exploraremos las posibilidades.",
    cta: "CREEMOS ALGO JUNTOS",
  },
  why: {
    label: "Por qué AUNZA",
    lines: ["MÁS QUE UN PRODUCTO.", "UNA EXPERIENCIA COMPLETA."],
    principles: [
      { title: "Un mundo de posibilidades.", text: "Packaging, ropa, vasos y botellas, regalos o algo que aún no existe." },
      { title: "Soluciones pensadas para tu marca.", text: "Partimos de tu identidad y tus necesidades, no de un catálogo." },
      { title: "Atención a cada detalle.", text: "Materiales, acabados y esas pequeñas cosas en las que casi nadie piensa." },
      { title: "Un único interlocutor en todo el proyecto.", text: "Una sola conversación, desde la primera idea hasta la entrega." },
    ],
  },
  final: {
    lines: ["¿QUÉ CREAMOS", "JUNTOS?"],
    text: "Tu próximo gran producto empieza con una idea. Hagámosla realidad.",
    cta: "EMPEZAR MI PROYECTO",
  },
};

export const about: typeof enAbout = {
  meta: { title: "Nosotros" },
  label: "Sobre AUNZA",
  headline: "CREEMOS QUE TODA IDEA MERECE CONVERTIRSE EN ALGO REAL.",
  lead: "AUNZA existe para ayudar a las empresas a expresar su identidad a través de productos físicos.",
  body: [
    "Creemos que el packaging, los uniformes, las botellas, el merchandising y los objetos de cada día pueden convertirse en potentes experiencias de marca. Un vaso puede hacer que alguien recuerde una cafetería. Una caja puede convertir una pequeña compra en una ocasión especial.",
    "Reunimos posibilidades de producto, personalización y producción coordinada para que las empresas creen productos que sientan realmente suyos.",
  ],
  how: {
    label: "Cómo trabajamos",
    headline: "Un solo equipo entre tu idea y el producto terminado.",
    points: [
      { title: "Trabajas con nosotros", text: "Nos ocupamos de la gestión comercial, la selección de producto y la personalización, y nos compras directamente a AUNZA." },
      { title: "Elegimos la producción adecuada", text: "La fabricación puede correr a cargo de fabricantes externos seleccionados, según lo que requiera cada proyecto." },
      { title: "Lo llevamos hasta el final", text: "Coordinamos la producción y la entrega, para que tengas una sola conversación de principio a fin." },
    ],
  },
  beliefs: {
    label: "En qué creemos",
    items: [
      "Los detalles no son extras.",
      "Toda empresa tiene algo que merece hacerse visible.",
      "Los buenos objetos se conservan.",
      "Las mejores ideas no siempre caben en un catálogo.",
    ],
  },
};

export const customProjects: typeof enCustomProjects = {
  meta: {
    title: "Proyectos a medida",
    description: "Desarrollo de productos a medida para empresas. Tráenos un boceto, una referencia o solo una necesidad, y exploraremos qué es posible.",
  },
  label: "Proyectos a medida",
  lines: ["NADA CORRIENTE.", "NADA DE", "CATÁLOGO."],
  text: "Hay ideas que necesitan algo diferente. Cuéntanos qué quieres crear y exploraremos las posibilidades.",
  cta: "CREEMOS ALGO JUNTOS",
  closing: "Cuéntanos qué quieres crear.",
  starts: {
    label: "Por dónde puede empezar un proyecto",
    items: [
      { title: "Un boceto", text: "Un dibujo en una servilleta nos vale. Veremos cómo podría hacerse." },
      { title: "Una referencia", text: "Algo que has visto y te gustaría hacer tuyo." },
      { title: "Una necesidad", text: "Aún no sabes qué objeto es, solo lo que tiene que hacer." },
      { title: "Un material", text: "Una textura, un acabado o un color a partir del cual crear algo." },
    ],
  },
  stepsLabel: "Qué pasa después",
  steps: [
    "Nos cuentas lo que tienes en mente, sin necesidad de tenerlo todo claro.",
    "Volvemos con preguntas, materiales y posibles caminos.",
    "Acordamos una especificación y, si hace falta, una muestra.",
    "Nosotros coordinamos la producción y la entrega.",
  ],
};

export const contact: typeof enContact = {
  meta: { title: "Contacto", description: "Habla con AUNZA sobre productos personalizados para tu empresa." },
  label: "Contacto",
  lines: ["HABLEMOS", "DE TU", "MARCA."],
  lede: "Una pregunta, una idea a medio hacer o simple curiosidad por saber qué es posible. Escríbenos.",
  alternative: "¿Ya sabes lo que necesitas? Con el formulario de presupuesto podremos darte una respuesta más detallada.",
};

export const pages: typeof enPages = {
  products: {
    meta: {
      title: "Productos personalizados",
      description: "Packaging a medida, vasos y botellas, bolsas, uniformes, papelería y regalos corporativos, además de productos desarrollados a partir de tu propia idea.",
    },
    label: "Productos",
  },
  markets: {
    meta: {
      title: "Sectores",
      description: "Productos personalizados para hostelería, retail, empresas, eventos, moda, belleza, hoteles y deporte.",
    },
    label: "Sectores",
  },
  notFound: { label: "404", headline: "ESTA IDEA AÚN NO ES REAL.", back: "Volver al inicio" },
};

export const detail: typeof enDetail = {
  relevant: { label: "Productos destacados", note: "Un punto de partida, no un límite. Si lo que necesitas no aparece, cuéntanoslo." },
  customization: { label: "Opciones de personalización", note: "Las opciones dependen del producto y se confirman al revisar tu proyecto." },
  applications: "Ejemplos de aplicación",
  related: "Categorías relacionadas",
  band: {
    generic: "Cuéntanos qué tienes en mente.",
    named: () => "Cuéntanos tu proyecto.",
  },
  marketTitle: (name) => `Productos personalizados: ${name}`,
  productTitle: (name) => name,
};

export const experiences: typeof enExperiences = {
  packaging: {
    label: "La transformación del packaging",
    captions: [
      { at: 0.02, until: 0.18, title: "Una caja cerrada.", note: "Impresa en tu color, con tu nombre." },
      { at: 0.2, until: 0.46, title: "Se abre.", note: "El interior también forma parte de la historia." },
      { at: 0.5, until: 0.76, title: "Se despliega.", note: "Cada superficie puede llevar tu marca." },
      { at: 0.78, until: 0.97, title: "Cada panel, bien pensado.", note: "Por fuera y por dentro, impreso según tus especificaciones." },
    ],
  },
  apparel: {
    label: "La transformación de la ropa",
    colourLabel: "Color de la prenda",
    garment: (colour) => `Camiseta en color ${colour.toLowerCase()}`,
    swatches: ["Blanco cálido", "Arena", "Salvia", "Terracota", "Azul profundo", "Carbón"],
    stages: [
      { title: "Una camiseta neutra.", note: "Algodón grueso, todavía sin nada." },
      { title: "Tu color.", note: "Teñida o elegida para que combine con tu marca." },
      { title: "Gráficos impresos.", note: "Una serigrafía con verdadera presencia." },
      { title: "Detalles bordados.", note: "Un hilo que se nota al pasar el dedo." },
    ],
  },
};
