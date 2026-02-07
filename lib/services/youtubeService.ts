export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  topic: string;
  channel: string;
  views: string;
}

const MOCK_VIDEOS: VideoItem[] = [
  {
    id: "v-001",
    title: "Intro to Risk Management for Traders",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    duration: "12:34",
    topic: "Risk Management",
    channel: "Deriv",
    views: "45K",
  },
  {
    id: "v-002",
    title: "How to Trade Multipliers on Deriv",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    duration: "8:21",
    topic: "Multipliers",
    channel: "Deriv",
    views: "32K",
  },
  {
    id: "v-003",
    title: "Understanding Volatility Indices",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    duration: "15:07",
    topic: "Volatility",
    channel: "Deriv",
    views: "28K",
  },
  {
    id: "v-004",
    title: "Risk Management: Position Sizing Strategies",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    duration: "10:45",
    topic: "Risk Management",
    channel: "Deriv",
    views: "19K",
  },
  {
    id: "v-005",
    title: "Technical Analysis Masterclass",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    duration: "22:10",
    topic: "Technical Analysis",
    channel: "Deriv",
    views: "67K",
  },
  {
    id: "v-006",
    title: "Deriv MT5: Complete Beginner Guide",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    duration: "18:30",
    topic: "Platform",
    channel: "Deriv",
    views: "54K",
  },
  {
    id: "v-007",
    title: "Managing Risk in Volatile Markets",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    duration: "9:15",
    topic: "Risk Management",
    channel: "Deriv",
    views: "12K",
  },
  {
    id: "v-008",
    title: "How to Read Candlestick Charts",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    duration: "14:22",
    topic: "Technical Analysis",
    channel: "Deriv",
    views: "41K",
  },
];

export async function fetchDerivVideos(): Promise<VideoItem[]> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 600));
    return MOCK_VIDEOS;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCArkMZyQ_wDAkac5aB3PNFQ&maxResults=8&type=video&key=${apiKey}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`YouTube API ${res.status}`);

    const data = await res.json();

    if (!data.items || data.items.length === 0) return MOCK_VIDEOS;

    return data.items.map((item: {
      id: { videoId?: string };
      snippet: {
        title: string;
        thumbnails?: { medium?: { url: string } };
        channelTitle?: string;
      };
    }, i: number) => ({
      id: item.id.videoId || `yt-${i}`,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url ?? "",
      duration: "",
      topic: "General",
      channel: item.snippet.channelTitle ?? "Deriv",
      views: "",
    }));
  } catch {
    return MOCK_VIDEOS;
  }
}

// Topic detection keywords map
const TOPIC_KEYWORDS: Record<string, string[]> = {
  "Risk Management": ["risk", "management", "position size", "stop loss", "losing", "loss"],
  "Multipliers": ["multiplier", "leverage"],
  "Volatility": ["volatility", "volatile", "vol index"],
  "Technical Analysis": ["technical", "chart", "candlestick", "pattern", "indicator"],
  "Platform": ["mt5", "platform", "deriv app", "dtrader"],
};

export function detectTopicFromText(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return topic;
  }
  return null;
}
