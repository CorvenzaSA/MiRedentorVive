export type Verse = {
  text: string;
  ref: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export const CALLING_VERSES: Verse[] = [
  {
    text: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.",
    ref: "Mateo 11:28",
    ctaLabel: "Pedir oración",
    ctaHref: "/Contact",
  },
  {
    text: "Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu.",
    ref: "Salmo 34:18",
    ctaLabel: "Hablar con nosotros",
    ctaHref: "/Contact",
  },
  {
    text: "Si alguno tiene sed, venga a mí y beba.",
    ref: "Juan 7:37",
    ctaLabel: "Conócenos",
    ctaHref: "/Information",
  },
  {
    text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito…",
    ref: "Juan 3:16",
    ctaLabel: "Misión y visión",
    ctaHref: "/Information",
  },
  {
    text: "Gustad, y ved que es bueno Jehová; dichoso el hombre que confía en él.",
    ref: "Salmo 34:8",
    ctaLabel: "Ver ministerios",
    ctaHref: "/Ministries",
  },
];

// Helper simple para elegir uno al azar
export function pickRandomVerse(list: Verse[]): Verse {
  const i = Math.floor(Math.random() * list.length);
  return list[i]!;
}
