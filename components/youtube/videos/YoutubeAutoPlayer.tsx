"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type YoutubeVideoItem = {
  videoId: string | null;
  title: string | null;
  publishedAt: string | null;
  thumbnail: string | null;
};

type VideosResponse = {
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

/**
 * Formatea publishedAt (ISO UTC de YouTube) a un formato legible en español (Guatemala).
 * Ejemplo: "2026-01-11T02:23:12Z" -> "10 de enero de 2026, 8:23 p. m."
 */
function formatDate(iso?: string | null): string {
  if (!iso) return "";

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat("es-GT", {
    timeZone: "America/Guatemala",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

export default function YoutubeHistoryVideos() {
  const topRef = useRef<HTMLDivElement | null>(null);

  const [data, setData] = useState<VideosResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Player
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  // Paginación real
  const [page, setPage] = useState(1);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [tokenStack, setTokenStack] = useState<string[]>([]);

  const playerVideoId = selectedVideoId ?? data?.featured?.videoId ?? null;

  const embedUrl = useMemo(() => {
    if (!playerVideoId) return null;
    return `https://www.youtube.com/embed/${playerVideoId}?rel=0&modestbranding=1`;
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
    const j = (await r.json()) as VideosResponse;

    if (!j.ok) throw new Error(j.error ?? "No se pudo cargar.");
    return j;
  }

  async function loadFirstPage() {
    setLoading(true);
    try {
      const j = await fetchPage();
      setData(j);
      setNextToken(j.nextPageToken ?? null);
      setTokenStack([]);
      setPage(1);

      // Si el usuario no seleccionó nada, usar featured automáticamente
      setSelectedVideoId(null);
    } catch (e: any) {
      setData({
        ok: false,
        featured: null,
        items: [],
        nextPageToken: null,
        error: e?.message ?? "Error",
      });
    } finally {
      setLoading(false);
    }
  }

  async function goNext() {
    if (!nextToken) return;

    setLoading(true);
    try {
      setTokenStack((s) => [...s, nextToken]);

      const j = await fetchPage(nextToken);

      // featured solo viene en primera página; lo preservamos si ya existía
      setData((prev) => ({
        ...j,
        featured: prev?.featured ?? j.featured ?? null,
      }));

      setNextToken(j.nextPageToken ?? null);
      setPage((p) => p + 1);
      scrollToTop();
    } catch (e: any) {
      setData((prev) =>
        prev ?? {
          ok: false,
          featured: null,
          items: [],
          nextPageToken: null,
          error: e?.message ?? "Error",
        }
      );
    } finally {
      setLoading(false);
    }
  }

  async function goPrev() {
    if (page <= 1) return;

    setLoading(true);
    try {
      if (page === 2) {
        await loadFirstPage();
        scrollToTop();
        return;
      }

      const stack = [...tokenStack];
      stack.pop();
      const tokenToGo = stack[stack.length - 1];

      setTokenStack(stack);

      const j = tokenToGo ? await fetchPage(tokenToGo) : await fetchPage();

      setData((prev) => ({
        ...j,
        featured: prev?.featured ?? j.featured ?? null,
      }));

      setNextToken(j.nextPageToken ?? null);
      setPage((p) => Math.max(1, p - 1));
      scrollToTop();
    } catch (e: any) {
      setData((prev) =>
        prev ?? {
          ok: false,
          featured: null,
          items: [],
          nextPageToken: null,
          error: e?.message ?? "Error",
        }
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = data?.ok ? data.items : [];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div ref={topRef} />

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>YouTube — Historial</h2>
        <p style={{ marginTop: 6, opacity: 0.8 }}>
          Predicaciones, transmisiones pasadas y videos del canal (consumo mínimo).
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={loadFirstPage}
            disabled={loading}
            style={{ width: "fit-content", padding: "8px 12px", cursor: "pointer" }}
          >
            Refrescar
          </button>

          {playerVideoId && (
            <a
              href={`https://www.youtube.com/watch?v=${playerVideoId}`}
              target="_blank"
              rel="noreferrer"
              style={{ padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: 8 }}
            >
              Ver en YouTube
            </a>
          )}
        </div>
      </section>

      {/* Player */}
      <section>
        {loading && <p>Cargando…</p>}

        {!loading && data && !data.ok && <p>Error: {data.error ?? "No se pudo cargar."}</p>}

        {!loading && embedUrl && (
          <div style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 12, overflow: "hidden" }}>
            <iframe
              title="YouTube Player"
              src={embedUrl}
              style={{ width: "100%", height: "100%", border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        {!loading && !embedUrl && data?.ok && <p>No hay videos disponibles para reproducir.</p>}
      </section>

      <hr />

      {/* Paginación */}
      {data?.ok && (
        <section style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ opacity: 0.8 }}>
              Página <strong>{page}</strong> — mostrando {items.length} videos
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                disabled={loading || page <= 1}
                onClick={goPrev}
                style={{ padding: "8px 12px", cursor: "pointer" }}
              >
                Anterior
              </button>
              <button
                disabled={loading || !nextToken}
                onClick={goNext}
                style={{ padding: "8px 12px", cursor: "pointer" }}
              >
                Siguiente
              </button>
            </div>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {items.map((v, idx) => {
              const vid = v.videoId;
              const isSelected = !!vid && selectedVideoId === vid;

              return (
                <div
                  key={safeKey(v, idx)}
                  style={{
                    display: "grid",
                    gap: 8,
                    border: "1px solid #e5e5e5",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  {v.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.thumbnail}
                      alt={v.title ?? "Video"}
                      style={{ width: "100%", height: "auto", borderRadius: 8 }}
                      loading="lazy"
                    />
                  )}

                  <div style={{ fontWeight: 600, fontSize: 14 }}>{v.title ?? "Sin título"}</div>

                  {/* FECHA ARREGLADA */}
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {formatDate(v.publishedAt)}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      disabled={!vid}
                      onClick={() => {
                        if (!vid) return;
                        setSelectedVideoId(vid);
                        scrollToTop();
                      }}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        cursor: "pointer",
                        opacity: vid ? 1 : 0.6,
                      }}
                    >
                      {isSelected ? "Reproduciendo" : "Reproducir aquí"}
                    </button>

                    {vid && (
                      <a
                        href={`https://www.youtube.com/watch?v=${vid}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #e5e5e5",
                          borderRadius: 8,
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
