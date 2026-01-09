import Link from "next/link";
import { HOME_CARDS } from "@/models/home/home";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VerseCallout } from "@/components/share/verse-callout";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
   
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Fondo suave */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/70 to-background" />
        <div className="absolute left-1/2 top-[-120px] -z-10 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-muted blur-3xl opacity-60" />

        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Comunidad • Fe • Servicio
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Mi Redentor Vive
            </h1>

            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              Un lugar para conocer a Dios, crecer en la fe y vivir el Evangelio a través
              de la palabra, la adoración y la comunión.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/lives">Ver transmisiones</Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <Link href="/Information">Conócenos</Link>
              </Button>

              <Button asChild size="lg" variant="secondary">
                <Link href="/Ministries">Ver ministerios</Link>
              </Button>
            </div>

            <div className="mt-10">
              <Separator className="my-6" />
              <div className="grid gap-4 sm:grid-cols-3 text-sm text-left sm:text-center">
                <div className="rounded-lg border bg-card p-4">
                  <p className="font-medium">Reuniones</p>
                  <p className="mt-1 text-muted-foreground">
                    Domingos y entre semana
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="font-medium">Transmisión</p>
                  <p className="mt-1 text-muted-foreground">
                    En vivo y grabaciones
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="font-medium">Apoyo</p>
                  <p className="mt-1 text-muted-foreground">
                    Oración y consejería
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TARJETAS (mapeo desde model) */}
      <section className="container mx-auto px-6 pb-14 md:pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Explora la iglesia
            </h2>
            <p className="mt-2 text-muted-foreground">
              Accede rápidamente a transmisiones, avisos, videos y ministerios.
            </p>
          </div>

          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/Information">Ver información</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {HOME_CARDS.map((item) => (
            <Card
              key={item.title}
              className="group hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <CardHeader className="space-y-2">
                {item.tag ? (
                  <Badge variant="secondary" className="w-fit">
                    {item.tag}
                  </Badge>
                ) : null}

                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                <p className="leading-relaxed">{item.description}</p>

                <div className="mt-5">
                  <Button asChild variant="link" className="px-0">
                    <Link href={item.href} className="group-hover:underline">
                      {item.cta}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* VERSÍCULO */}
      <VerseCallout />

    </main>
  );
}
