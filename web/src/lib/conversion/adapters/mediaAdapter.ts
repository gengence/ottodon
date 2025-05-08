import { MediaAdapter, ProcessingResult } from '../types';
import { writeFile, readFile } from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg';
import { fileTypeFromBuffer } from 'file-type';
import * as tmp from 'tmp';

function createTempFile(options: tmp.FileOptions): Promise<{ path: string; cleanupCallback?: () => void }> {
  return new Promise((resolve, reject) => {
    tmp.file({ ...options, discardDescriptor: true }, (err, path, cleanupCallback) => {
      if (err) {
        return reject(err);
      }
      resolve({ path, cleanupCallback: cleanupCallback || undefined });
    });
  });
}

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

  constructor() {
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
    let inputTemp: { path: string; cleanupCallback?: () => void } | undefined;
    let outputTemp: { path: string; cleanupCallback?: () => void } | undefined;

    try {
      switch (operation) {
        case 'convert': {
          const format = params.format as string;
          console.log('Converting video to:', format);

          inputTemp = await createTempFile({ prefix: 'media-input-', postfix: '.tmp' });
          outputTemp = await createTempFile({ prefix: 'media-output-', postfix: `.${format}` });
          
          const inputPath = inputTemp.path;
          const outputPath = outputTemp.path;

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
            } else {
              return reject(new Error(`Unsupported target video format: ${format}`));
            }

            command
              .output(outputPath)
              .on('end', () => resolve())
              .on('error', (err) => {
                console.error('ffmpeg execution error:', err);
                reject(err);
              })
              .run();
          });

          const convertedBuffer = await readFile(outputPath);
          return convertedBuffer;
        }
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (error) {
      console.error('Video manipulation error:', error);
      throw error;
    } finally {
      if (inputTemp?.cleanupCallback) {
        inputTemp.cleanupCallback();
      }
      if (outputTemp?.cleanupCallback) {
        outputTemp.cleanupCallback();
      }
    }
  }
}

export default MediaProcessor; 