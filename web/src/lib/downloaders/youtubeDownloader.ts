import ytdl from '@distube/ytdl-core';
import { DownloadResult, MediaDownloader } from './types';
import fs from 'fs/promises';
import path from 'path';

export interface YouTubeVideo {
  id: string;
  title: string;
  author: string;
  description: string;
  duration: number;
  formats: ytdl.videoFormat[];
}

export class YouTubeDownloader implements MediaDownloader {
  private static readonly YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/|m\.youtube\.com\/watch\?v=)/;
  
  private readonly cookies = [
    {
      name: 'CONSENT',
      value: 'YES+cb',
      domain: '.youtube.com',
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'none'
    }
  ];
  
  canHandle(url: string): boolean {
    return YouTubeDownloader.YOUTUBE_URL_REGEX.test(url);
  }
  
  private async cleanupWatchFiles() {
    try {
      const files = await fs.readdir(process.cwd());
      const watchFiles = files.filter(file => file.endsWith('-watch.html'));
      
      for (const file of watchFiles) {
        try {
          await fs.unlink(path.join(process.cwd(), file));
        } catch (err) {
        }
      }
    } catch (err) {
    }
  }
  
  async download(url: string): Promise<DownloadResult> {
    try {
      await this.cleanupWatchFiles();
      
      if (!ytdl.validateURL(url)) {
        throw new Error('Invalid YouTube URL');
      }
      
      const agent = ytdl.createAgent(this.cookies);
      
      let info;
      let useAgent = true;
      try {
        info = await ytdl.getInfo(url, {
          agent,
          requestOptions: {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept-Language': 'en-US,en;q=0.9',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1'
            }
          }
        });
      } catch (infoError) {
        try {
          process.env.YTDL_NO_UPDATE = '1';
          info = await ytdl.getInfo(url);
          useAgent = false;
        } catch (fallbackError) {
          await this.cleanupWatchFiles();
          throw infoError;
        }
      }
      
      let format = ytdl.chooseFormat(info.formats, { 
        quality: 'highest',
        filter: (format) => format.hasVideo && format.hasAudio && format.container === 'mp4'
      });
      
      if (!format) {
        format = ytdl.chooseFormat(info.formats, { 
          quality: 'highest',
          filter: (format) => format.hasVideo && format.hasAudio
        });
      }
      
      if (!format) {
        format = ytdl.chooseFormat(info.formats, { 
          quality: 'highestvideo'
        });
      }
      
      if (!format) {
        throw new Error('No suitable format found');
      }
      
      const downloadOptions: any = { 
        format,
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': '*/*',
            'Referer': 'https://www.youtube.com/',
            'Origin': 'https://www.youtube.com',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site'
          }
        },
        highWaterMark: 1 << 25,
        dlChunkSize: 1024 * 1024 * 10
      };
      
      if (useAgent) {
        downloadOptions.agent = agent;
      }
      
      const videoStream = ytdl(url, downloadOptions);
      
      const chunks: Buffer[] = [];
      let downloadedBytes = 0;
      
      return new Promise((resolve, reject) => {
        videoStream.on('data', (chunk) => {
          chunks.push(chunk);
          downloadedBytes += chunk.length;
        });
        
        videoStream.on('end', async () => {
          const buffer = Buffer.concat(chunks);
          
          await this.cleanupWatchFiles();
          
          const safeTitle = info.videoDetails.title
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 100);
          
          const extension = format.container || 'mp4';
          const filename = `youtube_${safeTitle}_${info.videoDetails.videoId}.${extension}`;
          
          resolve({
            buffer,
            originalName: filename,
            mimeType: format.mimeType || 'video/mp4',
            size: buffer.length
          });
        });
        
        videoStream.on('error', async (error) => {
          await this.cleanupWatchFiles();
          reject(error);
        });
        
        setTimeout(async () => {
          videoStream.destroy();
          await this.cleanupWatchFiles();
          reject(new Error('Download timeout after 5 minutes'));
        }, 5 * 60 * 1000);
      });
      
    } catch (error) {
      await this.cleanupWatchFiles();
      
      if (error instanceof Error) {
        if (error.message.includes('Could not extract')) {
          throw new Error('YouTube has changed their page structure. The downloader needs to be updated.');
        } else if (error.message.includes('Status code: 410')) {
          throw new Error('This video format is no longer available. Try a different video.');
        } else if (error.message.includes('private video')) {
          throw new Error('This video is private and cannot be downloaded.');
        } else if (error.message.includes('age-restricted')) {
          throw new Error('This video is age-restricted and cannot be downloaded.');
        } else if (error.message.includes('429')) {
          throw new Error('Too many requests. Please try again later.');
        }
      }
      
      throw new Error(`Failed to download YouTube video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async getVideoMetadata(url: string): Promise<YouTubeVideo> {
    try {
      const agent = ytdl.createAgent(this.cookies);
      const info = await ytdl.getInfo(url, {
        agent,
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        }
      });
      
      return {
        id: info.videoDetails.videoId,
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        description: info.videoDetails.description || '',
        duration: parseInt(info.videoDetails.lengthSeconds),
        formats: info.formats
      };
    } catch (error) {
      throw new Error('Failed to get YouTube video metadata');
    } finally {
      await this.cleanupWatchFiles();
    }
  }
} 