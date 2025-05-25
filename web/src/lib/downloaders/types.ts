export interface DownloadResult {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface MediaDownloader {
  canHandle(url: string): boolean;
  download(url: string): Promise<DownloadResult>;
}

export interface TikTokVideo {
  id: string;
  url: string;
  authorName: string;
  description: string;
  noWatermarkUrl?: string;
} 