"use client";

import Link from "next/link";
import { PLATFORMS } from "@/models/plataforms/platforms";

// shadcn
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// react-icons
import {
  FaYoutube,
  FaFacebook,
  FaTwitch,
  FaTiktok,
  FaInstagram,
  FaLink,
} from "react-icons/fa";
import { RiLiveFill } from "react-icons/ri";
import { HiOutlineArrowRight } from "react-icons/hi";

type PlatformKey = (typeof PLATFORMS)[number]["key"];

function PlatformIcon({ keyName }: { keyName: PlatformKey }) {
  const cls = "h-6 w-6";
  switch (keyName) {
    case "youtube":
      return <FaYoutube className={cls} />;
    case "facebook":
      return <FaFacebook className={cls} />;
    case "twitch":
      return <FaTwitch className={cls} />;
    case "tiktok":
      return <FaTiktok className={cls} />;
    case "instagram":
      return <FaInstagram className={cls} />;
    default:
      return <FaLink className={cls} />;
  }
}

function StatusBadge({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return (
      <Badge variant="secondary" className="gap-2">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
        Próximamente
      </Badge>
    );
  }

  return (
    <Badge className="gap-2 bg-emerald-500 text-white hover:bg-emerald-500">
      <span className="h-2 w-2 rounded-full bg-white/90" />
      Activo
    </Badge>
  );
}

function PlatformCard({
  name,
  description,
  href,
  enabled,
  keyName,
}: {
  name: string;
  description: string;
  href: string;
  enabled: boolean;
  keyName: PlatformKey;
}) {
  const inner = (
    <Card
      className={[
        "group h-full overflow-hidden transition",
        enabled
          ? "hover:-translate-y-0.5 hover:shadow-lg"
          : "opacity-70",
      ].join(" ")}
    >
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70" />

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={[
                "flex h-11 w-11 items-center justify-center rounded-xl border",
                enabled
                  ? "bg-muted text-foreground"
                  : "bg-muted text-muted-foreground",
              ].join(" ")}
            >
              <PlatformIcon keyName={keyName} />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-base">{name}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>

          <StatusBadge enabled={enabled} />
        </div>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {enabled ? "Acceder al panel" : "No disponible aún"}
        </span>

        {enabled ? (
          <Button size="sm" className="gap-2">
            Abrir <HiOutlineArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" variant="secondary" disabled>
            Próximamente
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (!enabled) return <div>{inner}</div>;

  // Card completa clickeable + focus accesible
  return (
    <Link
      href={href}
      className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {inner}
    </Link>
  );
}

export default function PanelPage() {
  const active = PLATFORMS.filter((p) => p.enabled !== false);
  const coming = PLATFORMS.filter((p) => p.enabled === false);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border bg-background">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <RiLiveFill className="h-4 w-4 text-emerald-500" />
                Panel de transmisiones
              </div>

              <h1 className="text-3xl font-semibold tracking-tight">Panel</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Selecciona la plataforma para administrar o visualizar transmisiones. Las opciones “Próximamente”
                se activarán conforme avances con las integraciones.
              </p>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/">Ir al inicio</Link>
              </Button>
              <Button asChild className="gap-2">
                <Link href="/panel/youtube">
                  Ver YouTube <HiOutlineArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-background/70 p-4 backdrop-blur">
              <div className="text-xs text-muted-foreground">Plataformas activas</div>
              <div className="mt-1 text-2xl font-semibold">{active.length}</div>
            </div>
            <div className="rounded-xl border bg-background/70 p-4 backdrop-blur">
              <div className="text-xs text-muted-foreground">Próximamente</div>
              <div className="mt-1 text-2xl font-semibold">{coming.length}</div>
            </div>
            <div className="rounded-xl border bg-background/70 p-4 backdrop-blur">
              <div className="text-xs text-muted-foreground">Modo</div>
              <div className="mt-1 text-2xl font-semibold">Panel</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activas */}
      <div className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Plataformas activas</h2>
            <p className="text-sm text-muted-foreground">
              Acceso rápido a los paneles habilitados.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((p) => (
            <PlatformCard
              key={p.key}
              name={p.name}
              description={p.description}
              href={p.href}
              enabled={p.enabled !== false}
              keyName={p.key as PlatformKey}
            />
          ))}
        </div>
      </div>

      <Separator className="my-10" />

      {/* Próximamente */}
      <div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Próximamente</h2>
            <p className="text-sm text-muted-foreground">
              Estas integraciones se habilitarán más adelante.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coming.map((p) => (
            <PlatformCard
              key={p.key}
              name={p.name}
              description={p.description}
              href={p.href}
              enabled={false}
              keyName={p.key as PlatformKey}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
