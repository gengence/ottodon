import axios from 'axios';
import { load } from 'cheerio';
import { DownloadResult, MediaDownloader } from './types';

export class TwitterDownloader implements MediaDownloader {
  private static readonly TWITTER_URL_REGEX = /https?:\/\/(www\.)?(twitter\.com|x\.com)/;
  
  canHandle(url: string): boolean {
    return TwitterDownloader.TWITTER_URL_REGEX.test(url);
  }
  
  async download(url: string): Promise<DownloadResult> {
    try {
      const videoUrl = await this.getVideoUrl(url);
      const videoBuffer = await this.downloadVideoBuffer(videoUrl);
      
      const tweetIdMatch = url.match(/status\/(\d+)/);
      const tweetId = tweetIdMatch ? tweetIdMatch[1] : Date.now().toString();
      const filename = `twitter_${tweetId}.mp4`;
      
      return {
        buffer: videoBuffer,
        originalName: filename,
        mimeType: 'video/mp4',
        size: videoBuffer.length
      };
    } catch (error) {
      throw new Error('Failed to download Twitter video');
    }
  }
  
  private async getVideoUrl(url: string): Promise<string> {
    try {
      const normalizedUrl = url.replace("x.com", "twitter.com");
      
      const parsedUrl = new URL(normalizedUrl);
      if (parsedUrl.hostname !== "twitter.com") {
        throw new Error("Not a Twitter URL");
      }
      
      const vxUrl = normalizedUrl.replace("twitter.com", "vxtwitter.com");
      
      const response = await axios.get(vxUrl, {
        headers: {
          "User-Agent": "TelegramBot (like TwitterBot)",
        },
      });
      
      if (!response.data) {
        throw new Error(`Failed to fetch tweet: ${response.status}`);
      }
      
      const $ = load(response.data);
      
      const getMetaContent = (name: string) => {
        const value =
          $(`meta[name="twitter:${name}"]`).attr("content") ??
          $(`meta[property="og:${name}"]`).attr("content");
        return value;
      };
      
      const videoUrl = getMetaContent("video");
      
      if (!videoUrl) {
        throw new Error("No video found in this tweet");
      }
      
      return videoUrl;
    } catch (error) {
      throw new Error('Failed to extract video URL from Twitter post');
    }
  }
  
  private async downloadVideoBuffer(url: string): Promise<Buffer> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://twitter.com/',
        },
        timeout: 30000,
      });
      
      return Buffer.from(response.data);
    } catch (error) {
      throw new Error('Failed to download video file');
    }
  }
} 