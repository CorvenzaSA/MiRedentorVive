export type MomentItem = {
  title: string;
  description: string;
  imageUrl: string;
  href?: string;
  date?: string;
};

export const HOME_MOMENTS: MomentItem[] = [
  {
    title: "Bautizos",
    description: "Celebración de fe y testimonio público.",
    imageUrl: "/moments/bautizos.jpg",
    href: "/Advertisements",
    date: "2026",
  },
  {
    title: "Convivencias",
    description: "Tiempo de comunión y unidad.",
    imageUrl: "/moments/convivencias.jpg",
    href: "/Advertisements",
    date: "2026",
  },
  {
    title: "Servicio",
    description: "Apoyo a la comunidad y actividades solidarias.",
    imageUrl: "/moments/servicio.jpg",
    href: "/Advertisements",
    date: "2026",
  },
  {
    title: "Alabanza",
    description: "Adoración y gratitud a Dios.",
    imageUrl: "/moments/alabanza.jpg",
    href: "/videos",
    date: "2026",
  },
];
