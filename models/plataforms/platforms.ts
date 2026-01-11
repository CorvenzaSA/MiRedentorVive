export type PlatformKey =
  | "youtube"
  | "facebook"
  | "twitch"
  | "tiktok"
  | "instagram"
  | "kick"
  | "custom";

export type Platform = {
  key: PlatformKey;
  name: string;
  description: string;
  href: string; // "/panel/youtube"
  enabled?: boolean;
};

export const PLATFORMS: Platform[] = [
  { key: "youtube", name: "YouTube", description: "En vivos, últimos directos y videos del canal.", href: "/panel/youtube", enabled: true },
  { key: "facebook", name: "Facebook", description: "En vivos y publicaciones de tu página.", href: "/panel/facebook", enabled: true },
  { key: "twitch", name: "Twitch", description: "Canal en vivo y transmisiones recientes.", href: "/panel/twitch", enabled: true },
  { key: "tiktok", name: "TikTok", description: "Directos y videos cortos.", href: "/panel/tiktok", enabled: true },
  { key: "instagram", name: "Instagram", description: "Reels y lives (según integración).", href: "/panel/instagram", enabled: false },
  { key: "kick", name: "Kick", description: "Panel de canal en Kick.", href: "/panel/kick", enabled: false },
  { key: "custom", name: "Personalizado", description: "Conectar una fuente RTMP/URL personalizada.", href: "/panel/custom", enabled: false },
];
