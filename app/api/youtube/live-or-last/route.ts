import { NextResponse } from "next/server";

type YTChannelsResponse = {
  items?: Array<{
    contentDetails?: { relatedPlaylists?: { uploads?: string } };
  }>;
};

type YTPlaylistItemsResponse = {
  items?: Array<{
    contentDetails?: { videoId?: string };
    snippet?: {
      title?: string;
      publishedAt?: string;
      thumbnails?: { medium?: { url?: string } };
    };
  }>;
};

const YT_BASE = "https://www.googleapis.com/youtube/v3";

export const runtime = "nodejs";

// TTLs (ajústalos a tu gusto)
const TTL_UPLOADS = 60 * 60 * 24; // 24h
const TTL_LAST = 60 * 60;        // 60 min (puedes poner 6*60*60)

async function ytGet(
  path: string,
  params: Record<string, string>,
  ttlSeconds: number
) {
  const url = new URL(`${YT_BASE}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { next: { revalidate: ttlSeconds } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API error (${res.status}): ${text}`);
  }

  return res.json();
}

export async function GET() {
  try {
    const key = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!key || !channelId) {
      return NextResponse.json(
        { ok: false, error: "Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID" },
        { status: 500 }
      );
    }

    // 1) Obtener playlist uploads (cache 24h)
    const ch = (await ytGet(
      "channels",
      { part: "contentDetails", id: channelId, key },
      TTL_UPLOADS
    )) as YTChannelsResponse;

    const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploads) {
      return NextResponse.json(
        { ok: true, mode: "none", videoId: null, title: null, publishedAt: null, thumbnail: null },
        { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=120" } }
      );
    }

    // 2) Traer el último video (cache 60 min)
    const pl = (await ytGet(
      "playlistItems",
      {
        part: "snippet,contentDetails",
        playlistId: uploads,
        maxResults: "1",
        key,
      },
      TTL_LAST
    )) as YTPlaylistItemsResponse;

    const it = pl.items?.[0];
    const videoId = it?.contentDetails?.videoId ?? null;

    return NextResponse.json(
      {
        ok: true,
        mode: videoId ? "last" : "none",
        videoId,
        title: it?.snippet?.title ?? null,
        publishedAt: it?.snippet?.publishedAt ?? null,
        thumbnail: it?.snippet?.thumbnails?.medium?.url ?? null,
      },
      {
        // Cache compartido (CDN). Misma duración que TTL_LAST
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
