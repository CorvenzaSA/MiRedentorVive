import { NextResponse } from "next/server";

type YTChannelsResponse = {
  items?: Array<{
    contentDetails?: { relatedPlaylists?: { uploads?: string } };
  }>;
};

type YTPlaylistItemsResponse = {
  nextPageToken?: string;
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

// TTLs
const TTL_UPLOADS = 60 * 60 * 24; // 24h
const TTL_FIRST_PAGE = 60 * 60;   // 60 min (featured + lista principal)
const TTL_OTHER_PAGES = 60 * 15;  // 15 min

function toVideo(it: NonNullable<YTPlaylistItemsResponse["items"]>[number]) {
  return {
    videoId: it.contentDetails?.videoId ?? null,
    title: it.snippet?.title ?? null,
    publishedAt: it.snippet?.publishedAt ?? null,
    thumbnail: it.snippet?.thumbnails?.medium?.url ?? null,
  };
}

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

export async function GET(req: Request) {
  try {
    const key = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!key || !channelId) {
      return NextResponse.json(
        { ok: false, error: "Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const maxResults = searchParams.get("maxResults") ?? "12";
    const pageToken = searchParams.get("pageToken") ?? "";
    const isFirstPage = pageToken.trim() === "";

    // TTL dinámico: primera página más “estable”, otras páginas menos
    const ttl = isFirstPage ? TTL_FIRST_PAGE : TTL_OTHER_PAGES;

    // 1) Obtener playlist uploads del canal (cache 24h)
    const ch = (await ytGet(
      "channels",
      { part: "contentDetails", id: channelId, key },
      TTL_UPLOADS
    )) as YTChannelsResponse;

    const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploads) {
      return NextResponse.json(
        { ok: true, featured: null, items: [], nextPageToken: null },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=120",
          },
        }
      );
    }

    // 2) Listar videos del playlist uploads (cache ttl)
    const pl = (await ytGet(
      "playlistItems",
      {
        part: "snippet,contentDetails",
        playlistId: uploads,
        maxResults,
        ...(isFirstPage ? {} : { pageToken }),
        key,
      },
      ttl
    )) as YTPlaylistItemsResponse;

    const rawItems = pl.items ?? [];
    const mapped = rawItems.map(toVideo).filter((x) => x.videoId);

    // Featured SOLO en primera página (para no recalcular innecesario)
    const featured = isFirstPage && mapped.length ? mapped[0] : null;

    return NextResponse.json(
      {
        ok: true,
        featured,
        items: mapped,
        nextPageToken: pl.nextPageToken ?? null,
      },
      {
        headers: {
          // Cache compartido por usuarios (CDN)
          "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=120`,
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
