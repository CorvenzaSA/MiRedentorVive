import Link from "next/link";
import { HOME_MOMENTS } from "@/models/home/moments";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M5 12h12" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function MomentCard({
  title,
  description,
  imageUrl,
  href,
  date,
}: {
  title: string;
  description: string;
  imageUrl: string;
  href?: string;
  date?: string;
}) {
  const content = (
    <Card className="group relative overflow-hidden rounded-2xl border bg-card/70 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl focus-within:ring-2 focus-within:ring-ring">
      {/* Imagen + overlays */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Brillo suave al hover */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-white/10 via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute left-4 top-4">
          <Badge variant="secondary" className="backdrop-blur">
            {date ?? "Iglesia"}
          </Badge>
        </div>

        {/* CTA flotante */}
        <div className="absolute right-4 top-4">
          <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-white backdrop-blur transition-all group-hover:bg-black/40">
            Ver
            <ArrowIcon className="h-4 w-4" />
          </div>
        </div>

        {/* Título sobre la imagen (opcional) */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-base font-semibold text-white drop-shadow">
            {title}
          </h3>
        </div>
      </div>

      {/* Contenido */}
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Link secundario (se mantiene, pero ya no es necesario) */}
        {href ? (
          <div className="mt-4">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground/90 group-hover:text-foreground">
              Ver más <ArrowIcon className="h-4 w-4" />
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  // Si hay href: toda la card clickeable
  if (href) {
    return (
      <Link
        href={href}
        className="block outline-none"
        aria-label={`Abrir ${title}`}
      >
        {content}
      </Link>
    );
  }

  // Si no hay href, se muestra normal
  return content;
}

export function HomeMoments() {
  return (
    <section className="container mx-auto px-6 pb-14 md:pb-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Nuestros momentos
          </h2>
          <p className="mt-2 text-muted-foreground">
            Bautizos, convivencias, servicio y actividades que edifican.
          </p>
        </div>

        <Button asChild variant="outline" className="w-fit">
          <Link href="/Advertisements">Ver avisos</Link>
        </Button>
      </div>


      <Carousel className="w-full">
        <CarouselContent>
          {HOME_MOMENTS.map((item) => (
            <CarouselItem
              key={item.title}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <MomentCard
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                href={item.href}
                date={item.date}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-6 flex items-center justify-end gap-2">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </section>
  );
}
