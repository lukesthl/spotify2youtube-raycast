import { youtube, youtube_v3 } from "@googleapis/youtube";
import { getPreferenceValues } from "@raycast/api";
import { GaxiosResponse } from "googleapis-common";

class YouTubeClientSinleton {
  private client: youtube_v3.Youtube;

  constructor() {
    const pref = getPreferenceValues();
    const apiKey = (pref.apikey as string) || "";
    this.client = youtube({ version: "v3", auth: apiKey });
  }

  private async search(
    query: string,
    type: SearchType,
    channedId?: string | undefined
  ): Promise<GaxiosResponse<youtube_v3.Schema$SearchListResponse>> {
    const data = await this.client.search.list({
      q: query,
      part: ["id", "snippet"],
      type: [type],
      maxResults: 1,
      channelId: channedId,
    });
    return data;
  }

  public async searchVideos(query: string, channedId?: string | undefined): Promise<Video[]> {
    const data = await this.search(query, SearchType.video, channedId);
    const items = data?.data.items;
    const result: Video[] = [];
    if (items) {
      for (const r of items) {
        const vid = r.id?.videoId;
        if (vid) {
          const v: Video = {
            id: vid,
            title: r.snippet?.title || "?",
            description: r.snippet?.description || undefined,
            publishedAt: r.snippet?.publishedAt || "?",
            channelId: r.snippet?.channelId || "",
            channelTitle: r.snippet?.channelTitle || "?",
            thumbnails: {
              default: {
                url: r.snippet?.thumbnails?.default?.url || undefined,
              },
              high: {
                url: r.snippet?.thumbnails?.high?.url || undefined,
              },
            },
          };
          result.push(v);
        }
      }
    }
    return result;
  }
}
export const YouTubeClient = new YouTubeClientSinleton();

export enum SearchType {
  channel = "channel",
  video = "video",
}

export interface VideoStatistics {
  commentCount: string;
  dislikeCount: string;
  favoriteCount: string;
  likeCount: string;
  viewCount: string;
}

export interface ChannelStatistics {
  commentCount: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
}

export interface Thumbnail {
  url?: string;
}

export interface Thumbnails {
  default?: Thumbnail;
  high?: Thumbnail;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  duration?: string | undefined;
  publishedAt: string;
  thumbnails: Thumbnails;
  statistics?: VideoStatistics;
  channelId: string;
  channelTitle: string;
}
