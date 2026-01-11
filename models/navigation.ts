export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Información", href: "/Information" },
  { label: "Ministerios", href: "/Ministries" },
  { label: "En vivo", href: "/videos/panel" },
  { label: "Videos", href: "/videos" },
  { label: "Avisos", href: "/Advertisements" },
  { label: "Contacto", href: "/Contact" },
];
