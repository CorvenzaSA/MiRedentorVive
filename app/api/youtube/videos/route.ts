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

async function ytGet(path: string, params: Record<string, string>) {
  const url = new URL(`${YT_BASE}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { cache: "no-store" });
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

    // 1) Obtener playlist uploads del canal
    const ch = (await ytGet("channels", {
      part: "contentDetails",
      id: channelId,
      key,
    })) as YTChannelsResponse;

    const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploads) {
      return NextResponse.json({ ok: true, items: [], nextPageToken: null });
    }

    // 2) Listar videos del playlist uploads
    const pl = (await ytGet("playlistItems", {
      part: "snippet,contentDetails",
      playlistId: uploads,
      maxResults,
      pageToken,
      key,
    })) as YTPlaylistItemsResponse;

    const items =
      pl.items?.map((it) => ({
        videoId: it.contentDetails?.videoId ?? null,
        title: it.snippet?.title ?? null,
        publishedAt: it.snippet?.publishedAt ?? null,
        thumbnail: it.snippet?.thumbnails?.medium?.url ?? null,
      })) ?? [];

    return NextResponse.json({
      ok: true,
      items: items.filter((x) => x.videoId),
      nextPageToken: pl.nextPageToken ?? null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
