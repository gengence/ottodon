import axios from 'axios';
import { DownloadResult, MediaDownloader, TikTokVideo } from './types';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);

export class TikTokDownloader implements MediaDownloader {
  private static readonly TIKTOK_URL_REGEX = /https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com/;
  private cookieJar: CookieJar;
  private client: ReturnType<typeof wrapper>;
  
  constructor() {
    this.cookieJar = new CookieJar();
    
    this.client = wrapper(axios.create({ 
      jar: this.cookieJar,
      withCredentials: true
    }));
    
    const webId = `69${this.generateRandomString(17)}`;
    this.cookieJar.setCookieSync(
      `tt_webid_v2=${webId}; Domain=tiktok.com; Path=/; Secure; hostOnly=false`,
      'https://tiktok.com'
    );
  }
  
  canHandle(url: string): boolean {
    return TikTokDownloader.TIKTOK_URL_REGEX.test(url);
  }
  
  async download(url: string): Promise<DownloadResult> {
    try {
      console.log('Starting TikTok download process for:', url);
      
      const videoData = await this.getVideoMetadata(url);
      console.log('Successfully extracted video metadata, ID:', videoData.id);
      
      let videoBuffer: Buffer;
      
      if (videoData.noWatermarkUrl) {
        console.log('Attempting to download without watermark');
        try {
          videoBuffer = await this.downloadVideoBuffer(videoData.noWatermarkUrl);
        } catch (error) {
          console.warn('Failed to download no watermark version, falling back to regular version');
          videoBuffer = await this.downloadVideoBuffer(videoData.url);
        }
      } else {
        console.log('No watermark URL not available, downloading regular version');
        videoBuffer = await this.downloadVideoBuffer(videoData.url);
      }
      
      return {
        buffer: videoBuffer,
        originalName: `tiktok_${videoData.id}.mp4`,
        mimeType: 'video/mp4',
        size: videoBuffer.length
      };
    } catch (error) {
      console.error('Error in TikTok download process:', error);
      throw new Error('Failed to download TikTok video');
    }
  }
  
  private async downloadVideoBuffer(url: string): Promise<Buffer> {
    console.log('Downloading video from URL:', url);
    
    try {
      const response = await this.client.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
          'Referer': 'https://www.tiktok.com/',
          'Range': 'bytes=0-',
          'Connection': 'keep-alive'
        }
      });
      
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading video buffer:', error);
      throw error;
    }
  }
  
  private async getVideoMetadata(url: string): Promise<TikTokVideo> {
    try {
      console.log('Fetching HTML content from:', url);
      const response = await this.client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
          'Referer': 'https://www.tiktok.com/'
        }
      });
      
      const html = response.data;
      console.log('HTML content length:', html.length);
      
      let videoData;
      
      if (html.includes('__NEXT_DATA__')) {
        console.log('Extracting video data via __NEXT_DATA__');
        const parts = html.split('<script id="__NEXT_DATA__" type="application/json" nonce="');
        if (parts.length > 1) {
          const secondPart = parts[1].split('</script>')[0];
          const jsonContent = secondPart.split('crossorigin="anonymous">')[1];
          if (jsonContent) {
            try {
              const jsonData = JSON.parse(jsonContent);
              videoData = jsonData.props?.pageProps?.itemInfo?.itemStruct;
              if (!videoData) {
                videoData = jsonData.props?.pageProps?.videoData;
              }
            } catch (e) {
              console.log('Error parsing JSON from __NEXT_DATA__:', e);
            }
          }
        }
      }
      
      if (!videoData && html.includes('SIGI_STATE')) {
        console.log('Extracting video data via SIGI_STATE');
        const parts = html.split('<script id="SIGI_STATE" type="application/json">');
        if (parts.length > 1) {
          const jsonContent = parts[1].split('</script>')[0];
          if (jsonContent) {
            try {
              const jsonData = JSON.parse(jsonContent);
              if (jsonData.ItemModule) {
                videoData = Object.values(jsonData.ItemModule)[0];
              }
            } catch (e) {
              console.log('Error parsing JSON from SIGI_STATE:', e);
            }
          }
        }
      }
      
      if (!videoData) {
        console.log('Extracting video data via regex patterns');
        const videoUrlMatch = html.match(/"playAddr":"([^"]+)"/);
        const videoIdMatch = url.match(/\/video\/(\d+)/);
        const authorMatch = html.match(/"uniqueId":"([^"]+)"/);
        const descMatch = html.match(/"desc":"([^"]+)"/);
        
        if (videoUrlMatch && videoUrlMatch[1]) {
          videoData = {
            id: videoIdMatch ? videoIdMatch[1] : 'unknown',
            video: {
              downloadAddr: videoUrlMatch[1].replace(/\\u002F/g, '/'),
              playAddr: videoUrlMatch[1].replace(/\\u002F/g, '/')
            },
            author: {
              uniqueId: authorMatch ? authorMatch[1] : 'unknown',
              nickname: authorMatch ? authorMatch[1] : 'unknown'
            },
            desc: descMatch ? descMatch[1] : ''
          };
        }
      }
      
      if (!videoData) {
        console.error('Failed to extract video data from TikTok page');
        throw new Error('Could not extract video data from TikTok page');
      }
      
      const result: TikTokVideo = {
        id: videoData.id,
        url: videoData.video.downloadAddr || videoData.video.playAddr,
        authorName: videoData.author.uniqueId || videoData.author.nickname,
        description: videoData.desc
      };
      
      if (result.url.includes('\\u002F')) {
        result.url = result.url.replace(/\\u002F/g, '/');
      }
      
      if (videoData.createTime && videoData.createTime < 1595808000) {
        try {
          const noWatermarkUrl = await this.extractNoWatermarkUrl(result.url);
          if (noWatermarkUrl) {
            result.noWatermarkUrl = noWatermarkUrl;
          }
        } catch (error) {
          console.warn('Could not extract no-watermark URL:', error);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error getting TikTok video metadata:', error);
      throw new Error('Failed to get TikTok video metadata');
    }
  }
  
  private async extractNoWatermarkUrl(videoUrl: string): Promise<string> {
    try {
      console.log('Attempting to extract no-watermark URL from:', videoUrl);
      
      const response = await this.client.get(videoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
          'Referer': 'https://www.tiktok.com/'
        }
      });
      
      const data = response.data;
      if (typeof data !== 'string') {
        return '';
      }
      
      const position = Buffer.from(data).indexOf('vid:');
      if (position === -1) {
        return '';
      }
      
      const videoId = Buffer.from(data)
        .slice(position + 4, position + 36)
        .toString();
      
      console.log('Extracted video ID:', videoId);
      
      if (!videoId) {
        return '';
      }
      
      const apiUrl = `https://api2-16-h2.musical.ly/aweme/v1/play/?video_id=${videoId}&vr_type=0&is_play_url=1&source=PackSourceEnum_PUBLISH&media_type=4`;
      
      try {
        const apiResponse = await this.client.get(apiUrl, {
          headers: {
            'User-Agent': 'com.zhiliaoapp.musically/2021600040 (Linux; U; Android 7.1.2; en_US; SM-G977N; Build/LMY48Z; Cronet/TTNetVersion:5f9540e5 2021-05-20 QuicVersion:47946d2a 2020-10-14)',
            'Referer': 'https://www.tiktok.com/'
          },
          maxRedirects: 0,
          validateStatus: (status: number) => status >= 300 && status < 400
        });
        
        if (apiResponse.headers.location) {
          console.log('Successfully obtained no-watermark URL');
          return apiResponse.headers.location;
        }
      } catch (redirectError: any) {
        if (redirectError.response?.headers?.location) {
          console.log('Found no-watermark URL in redirect error');
          return redirectError.response.headers.location;
        }
      }
      
      return '';
    } catch (error) {
      console.warn('Error extracting no-watermark URL:', error);
      return '';
    }
  }
  
  private generateRandomString(length: number): string {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
} 