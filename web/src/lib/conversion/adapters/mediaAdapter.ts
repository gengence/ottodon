import { MediaAdapter, ProcessingResult } from '../types';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { fileTypeFromBuffer } from 'file-type';
import { writeFile, readFile, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';

type VideoFormat = 'mp4' | 'webm' | 'gif';

export class MediaProcessor implements MediaAdapter {
  private supportedVideoTypes = new Set([
    'video/mp4', 'video/webm', 'video/quicktime',
    'video/x-msvideo', 'video/x-matroska'
  ]);

  private supportedConversions: Record<VideoFormat, string[]> = {
    'mp4': ['webm', 'gif'],
    'webm': ['mp4', 'gif'],
    'gif': ['mp4', 'webm']
  };

  private tempDir = join(process.cwd(), 'temp');

  constructor() {
    mkdir(this.tempDir, { recursive: true }).catch(console.error);
  }

  supports(mimeType: string): boolean {
    return this.supportedVideoTypes.has(mimeType);
  }

  async process(buffer: Buffer): Promise<ProcessingResult> {
    const fileType = await fileTypeFromBuffer(buffer);
    const format = fileType?.ext as VideoFormat || 'mp4';
    const availableConversions = this.supportedConversions[format] || [];

    return {
      url: URL.createObjectURL(new Blob([buffer])),
      mimeType: fileType?.mime || 'video/mp4',
      size: buffer.length,
      metadata: {
        format,
        availableConversions
      }
    };
  }

  async manipulate(buffer: Buffer, operation: string, params: Record<string, unknown>): Promise<Buffer> {
    try {
      switch (operation) {
        case 'convert': {
          const format = params.format as string;
          console.log('Converting video to:', format);

          const inputPath = join(this.tempDir, `input-${randomUUID()}`);
          const outputPath = join(this.tempDir, `output-${randomUUID()}.${format}`);

          await writeFile(inputPath, buffer);

          await new Promise<void>((resolve, reject) => {
            const command = ffmpeg(inputPath);

            if (format === 'gif') {
              command
                .fps(10)
                .size('320x?')
                .format('gif');
            } else if (format === 'webm') {
              command
                .videoCodec('libvpx')
                .videoBitrate('1000k')
                .audioCodec('libvorbis')
                .format('webm');
            } else if (format === 'mp4') {
              command
                .videoCodec('libx264')
                .videoBitrate('1000k')
                .audioCodec('aac')
                .format('mp4');
            }

            command
              .output(outputPath)
              .on('end', () => resolve())
              .on('error', (err) => reject(err))
              .run();
          });

          const convertedBuffer = await readFile(outputPath);

          await Promise.all([
            unlink(inputPath).catch(() => {}),
            unlink(outputPath).catch(() => {})
          ]);

          return convertedBuffer;
        }
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (error) {
      console.error('Video manipulation error:', error);
      throw error;
    }
  }
}

export default MediaProcessor; 