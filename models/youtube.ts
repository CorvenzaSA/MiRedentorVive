export type LiveOrLastResponse = {
  ok: boolean;
  mode: "live" | "last_completed" | "none";
  videoId: string | null;
  title: string | null;
  publishedAt: string | null;
  thumbnail: string | null;
  error?: string;
};

export type YoutubeVideoItem = {
  videoId: string | null;
  title: string | null;
  publishedAt: string | null;
  thumbnail: string | null;
};

export type VideosResponse = {
  ok: boolean;
  items: YoutubeVideoItem[];
  nextPageToken: string | null;
  error?: string;
};
