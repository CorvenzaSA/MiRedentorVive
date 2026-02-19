export type HomeCardItem = {
  title: string;
  description: string;
  href: string;
  cta: string;
  tag?: string;
};

export const HOME_CARDS: HomeCardItem[] = [
  {
    title: "Ministerios",
    description:
      "Conoce los ministerios que sirven a niños, jóvenes, familias y comunidad.",
    href: "/Ministries",
    cta: "Explorar ministerios",
    tag: "Servicio",
  },
  {
    title: "Transmisiones en vivo",
    description:
      "Acompáñanos en vivo y revive los mensajes cuando lo necesites.",
    href: "/videos/lives",
    cta: "Ir a transmisiones",
    tag: "En vivo",
  },
  {
    title: "Videos",
    description:
      "Predicaciones y contenido publicado para ver en cualquier momento.",
    href: "/videos",
    cta: "Ver videos",
    tag: "Archivo",
  },
  {
    title: "Noticias y avisos",
    description:
      "Mantente al día con actividades, comunicados, horarios y eventos.",
    href: "/Advertisements",
    cta: "Ver avisos",
    tag: "Comunidad",
  },
  {
    title: "Contacto",
    description:
      "Escríbenos si necesitas oración, consejería o información.",
    href: "/Contact",
    cta: "Escribir ahora",
    tag: "Apoyo",
  },
];
