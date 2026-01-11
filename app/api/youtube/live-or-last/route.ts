import { NextResponse } from "next/server";

type YTSearchResponse = {
  items?: Array<{
    id?: { videoId?: string };
    snippet?: {
      title?: string;
      publishedAt?: string;
      thumbnails?: { medium?: { url?: string } };
    };
  }>;
};

const YT_BASE = "https://www.googleapis.com/youtube/v3";

async function ytSearch(params: Record<string, string>) {
  const url = new URL(`${YT_BASE}/search`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API error (${res.status}): ${text}`);
  }
  return (await res.json()) as YTSearchResponse;
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

    // 1) Live actual
    const live = await ytSearch({
      part: "snippet",
      channelId,
      eventType: "live",
      type: "video",
      maxResults: "1",
      key,
    });

    const liveItem = live.items?.[0];
    const liveVideoId = liveItem?.id?.videoId;

    if (liveVideoId) {
      return NextResponse.json({
        ok: true,
        mode: "live",
        videoId: liveVideoId,
        title: liveItem?.snippet?.title ?? null,
        publishedAt: liveItem?.snippet?.publishedAt ?? null,
        thumbnail: liveItem?.snippet?.thumbnails?.medium?.url ?? null,
      });
    }

    // 2) Último live finalizado
    const completed = await ytSearch({
      part: "snippet",
      channelId,
      eventType: "completed",
      type: "video",
      order: "date",
      maxResults: "1",
      key,
    });

    const lastItem = completed.items?.[0];
    const lastVideoId = lastItem?.id?.videoId;

    return NextResponse.json({
      ok: true,
      mode: lastVideoId ? "last_completed" : "none",
      videoId: lastVideoId ?? null,
      title: lastItem?.snippet?.title ?? null,
      publishedAt: lastItem?.snippet?.publishedAt ?? null,
      thumbnail: lastItem?.snippet?.thumbnails?.medium?.url ?? null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
