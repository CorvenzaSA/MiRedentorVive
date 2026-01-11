"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// shadcn
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// icons
import { FaYoutube } from "react-icons/fa";
import {
  HiOutlineArrowLeft,
  HiOutlineRefresh,
  HiOutlineExternalLink,
  HiOutlinePlay,
} from "react-icons/hi";

// utils
import { formatDate } from "@/lib/youtube";

type YoutubeVideoItem = {
  videoId: string | null;
  title: string | null;
  publishedAt: string | null;
  thumbnail: string | null;
};

type VideosApiResponse = {
  ok: boolean;
  featured: YoutubeVideoItem | null;
  items: YoutubeVideoItem[];
  nextPageToken: string | null;
  error?: string;
};

const PAGE_SIZE = 12;

function safeKey(v: YoutubeVideoItem, idx: number) {
  return v.videoId ?? `${v.title ?? "video"}-${v.publishedAt ?? "date"}-${idx}`;
}

export default function YoutubePage() {
  const topRef = useRef<HTMLDivElement | null>(null);

  const [data, setData] = useState<VideosApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Player
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  // Paginación real (YouTube pageToken)
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]); // stack para "Anterior"
  const [page, setPage] = useState(1);

  const playerVideoId = selectedVideoId ?? data?.featured?.videoId ?? null;

  const embedUrl = useMemo(() => {
    if (!playerVideoId) return null;
    return `https://www.youtube.com/embed/${playerVideoId}?autoplay=0&rel=0&modestbranding=1`;
  }, [playerVideoId]);

  function scrollToTop() {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function fetchPage(token?: string) {
    const qs = new URLSearchParams();
    qs.set("maxResults", String(PAGE_SIZE));
    if (token) qs.set("pageToken", token);

    const r = await fetch(`/api/youtube/videos?${qs.toString()}`);
    const j = (await r.json()) as VideosApiResponse;

    if (!j?.ok) throw new Error(j?.error ?? "No se pudieron cargar los videos.");
    return j;
  }

  async function loadFirstPage() {
    setLoading(true);
    try {
      const j = await fetchPage();
      setData(j);
      setNextToken(j.nextPageToken ?? null);
      setPrevTokens([]);
      setPage(1);

      // si no hay selección manual, dejar el featured
      setSelectedVideoId(null);
    } finally {
      setLoading(false);
    }
  }

  async function goNext() {
    if (!nextToken) return;
    setLoading(true);
    try {
      // Guardamos el token actual para poder volver
      setPrevTokens((s) => [...s, nextToken]);

      const j = await fetchPage(nextToken);
      setData((prev) => {
        // En páginas siguientes, featured suele venir null; mantenemos el featured original si existe.
        const keepFeatured = prev?.featured ?? j.featured ?? null;
        return { ...j, featured: keepFeatured };
      });
      setNextToken(j.nextPageToken ?? null);
      setPage((p) => p + 1);
      scrollToTop();
    } finally {
      setLoading(false);
    }
  }

  async function goPrev() {
    // Para regresar, usamos el stack de tokens: el anterior es el penúltimo token
    // Si estamos en página 2, volver a página 1 es simplemente loadFirstPage.
    if (page <= 1) return;

    setLoading(true);
    try {
      if (page === 2) {
        await loadFirstPage();
        scrollToTop();
        return;
      }

      // Para página >= 3: el token para ir atrás es el de dos posiciones atrás
      // porque el último token del stack es el token que usamos para ir a la página actual.
      const stack = [...prevTokens];
      stack.pop(); // quitamos el token de la página actual
      const tokenToGo = stack[stack.length - 1]; // token de la página anterior

      // Actualizamos el stack
      setPrevTokens(stack);

      const j = tokenToGo ? await fetchPage(tokenToGo) : await fetchPage();
      setData((prev) => {
        const keepFeatured = prev?.featured ?? j.featured ?? null;
        return { ...j, featured: keepFeatured };
      });
      setNextToken(j.nextPageToken ?? null);
      setPage((p) => Math.max(1, p - 1));
      scrollToTop();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = data?.ok ? data.items : [];
  const featured = data?.ok ? data.featured : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div ref={topRef} />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/panel" className="inline-flex items-center gap-2 hover:text-foreground">
              <HiOutlineArrowLeft className="h-4 w-4" />
              Volver al panel
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-muted">
              <FaYoutube className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Videos</h1>
              <p className="text-sm text-muted-foreground">
                Reproductor y listado del canal con consumo mínimo (cache server-side).
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              await loadFirstPage();
              scrollToTop();
            }}
            className="gap-2"
            disabled={loading}
          >
            <HiOutlineRefresh className="h-4 w-4" />
            Refrescar
          </Button>

          {playerVideoId && (
            <Button asChild variant="secondary" className="gap-2">
              <a
                href={`https://www.youtube.com/watch?v=${playerVideoId}`}
                target="_blank"
                rel="noreferrer"
              >
                Ver en YouTube <HiOutlineExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Player */}
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70" />

        <CardHeader className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Reproductor</CardTitle>
              <CardDescription className="text-xs">
                {featured?.title ? featured.title : "Selecciona un video para reproducirlo."}
              </CardDescription>
            </div>

            {(selectedVideoId || featured?.publishedAt) && (
              <Badge variant="outline" className="w-fit">
                {formatDate(
                  selectedVideoId
                    ? items.find((x) => x.videoId === selectedVideoId)?.publishedAt
                    : featured?.publishedAt
                )}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="w-full rounded-xl" style={{ height: 360 }} />
            </div>
          )}

          {!loading && data && !data.ok && (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              Error: {data.error ?? "No se pudo cargar el contenido."}
            </div>
          )}

          {!loading && !embedUrl && (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              No hay videos disponibles para reproducir.
            </div>
          )}

          {!loading && embedUrl && (
            <div className="w-full overflow-hidden rounded-xl border bg-black">
              <div className="aspect-video w-full">
                <iframe
                  title="YouTube Player"
                  src={embedUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* List + Pagination */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Listado</h2>
          <p className="text-sm text-muted-foreground">
            Página <span className="font-medium text-foreground">{page}</span> — {PAGE_SIZE} videos por página.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goPrev} disabled={loading || page <= 1}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={goNext} disabled={loading || !nextToken}>
            Siguiente
          </Button>
        </div>
      </div>

      {!loading && data && !data.ok && (
        <div className="rounded-lg border bg-muted/30 p-4 text-sm">
          Error: {data.error ?? "No se pudieron cargar los videos."}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="mt-3 flex gap-2">
                  <Skeleton className="h-9 w-full rounded-md" />
                  <Skeleton className="h-9 w-10 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && data?.ok && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((v, idx) => {
            const vid = v.videoId ?? "";
            const isSelected = !!vid && selectedVideoId === vid;

            return (
              <Card
                key={safeKey(v, idx)}
                className={[
                  "group overflow-hidden transition",
                  vid ? "hover:-translate-y-0.5 hover:shadow-md" : "",
                  isSelected ? "ring-2 ring-ring ring-offset-2" : "",
                ].join(" ")}
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-sm">
                      {v.title ?? "Sin título"}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Video
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{formatDate(v.publishedAt)}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="overflow-hidden rounded-lg border bg-muted">
                    <div className="aspect-video w-full">
                      {v.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={v.thumbnail}
                          alt={v.title ?? "Video"}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      className="w-full gap-2"
                      disabled={!vid}
                      onClick={() => {
                        if (!vid) return;
                        setSelectedVideoId(vid);
                        scrollToTop();
                      }}
                    >
                      <HiOutlinePlay className="h-4 w-4" />
                      {isSelected ? "Reproduciendo" : "Reproducir aquí"}
                    </Button>

                    {vid && (
                      <Button asChild size="sm" variant="outline" className="gap-2">
                        <a
                          href={`https://www.youtube.com/watch?v=${vid}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Ver en YouTube"
                        >
                          <HiOutlineExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
