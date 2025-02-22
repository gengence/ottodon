import ffmpeg from 'fluent-ffmpeg';
import type { FfprobeData } from 'fluent-ffmpeg';
import { MediaAdapter, ProcessingResult } from './types';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

interface FFmpegMetadata {
  format: {
    format_name: string;
    duration: number;
  };
  streams: Array<{
    codec_type?: string;
    width?: number;
    height?: number;
  }>;
}

export class MediaProcessor implements MediaAdapter {
  private isFFmpegAvailable: boolean = false;

  private supportedVideoTypes = new Set([
    'video/mp4', 'video/webm', 'video/quicktime',
    'video/x-msvideo', 'video/x-matroska'
  ]);

  private supportedAudioTypes = new Set([
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    'audio/x-m4a', 'audio/flac'
  ]);

  private tempDir = join(process.cwd(), 'temp');

  constructor() {
    // Check FFmpeg availability
    this.checkFFmpegAvailability();
    mkdir(this.tempDir, { recursive: true }).catch(console.error);
  }

  private async checkFFmpegAvailability(): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        ffmpeg.ffprobe('test', (err) => {
          if (err && !err.message.includes('No such file')) {
            reject(err);
          }
          resolve();
        });
      });
      this.isFFmpegAvailable = true;
    } catch (error) {
      console.error('FFmpeg not available:', error);
      this.isFFmpegAvailable = false;
    }
  }

  supports(mimeType: string): boolean {
    //Only support media types if FFmpeg is available
    return this.isFFmpegAvailable && (
      this.supportedVideoTypes.has(mimeType) || 
      this.supportedAudioTypes.has(mimeType)
    );
  }


  //lint below
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(buffer: Buffer, _options: unknown): Promise<ProcessingResult> {
    if (!this.isFFmpegAvailable) {
      throw new Error('FFmpeg is not available. Please install FFmpeg to process media files.');
    }

    const tempPath = join(this.tempDir, `${randomUUID()}`);
    await writeFile(tempPath, buffer);

    try {
      const metadata = await this.getMetadata(tempPath);
      const isVideo = metadata.streams.some(s => s.codec_type === 'video');

      return {
        url: URL.createObjectURL(new Blob([buffer])),
        mimeType: isVideo ? 'video/mp4' : 'audio/mpeg',
        size: buffer.length,
        metadata: {
          width: isVideo ? metadata.streams[0].width : undefined,
          height: isVideo ? metadata.streams[0].height : undefined,
          format: metadata.format.format_name,
          duration: metadata.format.duration
        }
      };
    } catch (error) {
      console.error('FFmpeg metadata error:', error);
      // Fallback to basic processing if FFmpeg fails
      return {
        url: URL.createObjectURL(new Blob([buffer])),
        mimeType: 'application/octet-stream',
        size: buffer.length
      };
    } finally {
      await unlink(tempPath).catch(console.error);
    }
  }

  private getMetadata(filePath: string): Promise<FFmpegMetadata> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, data: FfprobeData) => {
        if (err) reject(err);
        else resolve({
          format: {
            format_name: data.format.format_name || 'unknown',
            duration: Number(data.format.duration) || 0
          },
          streams: data.streams.map(stream => ({
            codec_type: stream.codec_type,
            width: stream.width,
            height: stream.height
          }))
        });
      });
    });
  }

  async manipulate(buffer: Buffer, operation: string, params: Record<string, unknown>): Promise<Buffer> {
    const tempInput = join(this.tempDir, `in_${randomUUID()}`);
    const tempOutput = join(this.tempDir, `out_${randomUUID()}`);
    await writeFile(tempInput, buffer);

    try {
      switch (operation) {
        case 'trim':
          await this.trim(tempInput, tempOutput, params);
          break;
        case 'convert':
          await this.convert(tempInput, tempOutput, params);
          break;
        case 'extract-audio':
          await this.extractAudio(tempInput, tempOutput);
          break;
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }

      //Return the file buffer instead of metadata
      return await readFile(tempOutput);
    } finally {
      await unlink(tempInput).catch(console.error);
      await unlink(tempOutput).catch(console.error);
    }
  }

  private trim(input: string, output: string, params: Record<string, unknown>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      ffmpeg(input)
        .setStartTime(params.start as number)
        .setDuration((params.end as number) - (params.start as number))
        .output(output)
        .on('end', () => resolve())
        .on('error', (err: Error) => reject(err))
        .run();
    });
  }

  private convert(input: string, output: string, params: Record<string, unknown>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const command = ffmpeg(input);
      
      if (params.format === 'gif') {
        command.toFormat('gif')
          .fps(10)
          .size('320x?');
      } else {
        command.toFormat(params.format as string);
      }

      command.output(output)
        .on('end', () => resolve())
        .on('error', (err: Error) => reject(err))
        .run();
    });
  }

  private extractAudio(input: string, output: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      ffmpeg(input)
        .toFormat('mp3')
        .output(output)
        .on('end', () => resolve())
        .on('error', (err: Error) => reject(err))
        .run();
    });
  }
}

export default MediaProcessor; 