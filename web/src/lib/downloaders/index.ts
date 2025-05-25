import { MediaDownloader } from './types';
import { TikTokDownloader } from './tikTokDownloader';
import { YouTubeDownloader } from './youtubeDownloader';
import { TwitterDownloader } from './twitterDownloader';


export class DownloaderFactory {
  private downloaders: MediaDownloader[] = [];

  constructor() {
    this.registerDownloader(new TikTokDownloader());
    this.registerDownloader(new YouTubeDownloader());
    this.registerDownloader(new TwitterDownloader());
  }


  registerDownloader(downloader: MediaDownloader): void {
    this.downloaders.push(downloader);
  }

 
  getDownloaderForUrl(url: string): MediaDownloader | null {
    for (const downloader of this.downloaders) {
      if (downloader.canHandle(url)) {
        return downloader;
      }
    }
    return null;
  }

 
  canHandleUrl(url: string): boolean {
    return this.downloaders.some(downloader => downloader.canHandle(url));
  }
}

export const downloaderFactory = new DownloaderFactory(); 