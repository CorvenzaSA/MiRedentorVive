"use client";

import React, { useEffect, useState } from "react";

type LiveOrLastResponse = {
  ok: boolean;
  mode: "live" | "last_completed" | "none";
  videoId: string | null;
  title: string | null;
  publishedAt: string | null;
  thumbnail: string | null;
  error?: string;
};

type VideosResponse = {
  ok: boolean;
  items: Array<{
    videoId: string | null;
    title: string | null;
    publishedAt: string | null;
    thumbnail: string | null;
  }>;
  nextPageToken: string | null;
  error?: string;
};

export default function YoutubeAutoPlayer() {
  const [live, setLive] = useState<LiveOrLastResponse | null>(null);
  const [videos, setVideos] = useState<VideosResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/youtube/live-or-last", { cache: "no-store" }),
        fetch("/api/youtube/videos?maxResults=12", { cache: "no-store" }),
      ]);

      setLive((await r1.json()) as LiveOrLastResponse);
      setVideos((await r2.json()) as VideosResponse);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();

    // Para detectar live automáticamente (prueba): refresca solo el estado del live cada 30s
    const id = window.setInterval(() => {
      fetch("/api/youtube/live-or-last", { cache: "no-store" })
        .then((r) => r.json())
        .then((j: LiveOrLastResponse) => setLive(j))
        .catch(() => {});
    }, 30_000);

    return () => window.clearInterval(id);
  }, []);

  const embedUrl = live?.videoId
    ? `https://www.youtube.com/embed/${live.videoId}?rel=0`
    : null;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>En vivo / Último en vivo</h2>

        {loading && <p>Cargando…</p>}

        {!loading && (!live || !live.ok) && (
          <p>Error: {live?.error ?? "No se pudo cargar."}</p>
        )}

        {!loading && live?.ok && live.mode === "none" && (
          <p>No hay en vivo y no se encontró un en vivo anterior.</p>
        )}

        {!loading && live?.ok && live.videoId && (
          <div style={{ display: "grid", gap: 8 }}>
            <p style={{ margin: 0 }}>
              Estado: <strong>{live.mode === "live" ? "EN VIVO" : "Último en vivo"}</strong>
            </p>
            {live.title && <p style={{ margin: 0 }}>{live.title}</p>}

            <div style={{ width: "100%", aspectRatio: "16 / 9" }}>
              <iframe
                title="YouTube Player"
                src={embedUrl ?? undefined}
                style={{ width: "100%", height: "100%", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <button
              onClick={loadAll}
              style={{ width: "fit-content", padding: "8px 12px", cursor: "pointer" }}
            >
              Refrescar
            </button>
          </div>
        )}
      </section>

      <hr />

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Videos</h2>

        {!loading && (!videos || !videos.ok) && (
          <p>Error: {videos?.error ?? "No se pudo cargar."}</p>
        )}

        {videos?.ok && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {videos.items.map((v) => (
              <a
                key={v.videoId ?? crypto.randomUUID()}
                href={v.videoId ? `https://www.youtube.com/watch?v=${v.videoId}` : "#"}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "grid",
                  gap: 6,
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid #e5e5e5",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                {v.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={v.thumbnail}
                    alt={v.title ?? "Video"}
                    style={{ width: "100%", height: "auto", borderRadius: 6 }}
                  />
                )}
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {v.title ?? "Sin título"}
                </div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {v.publishedAt ?? ""}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
