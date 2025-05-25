import { MediaAdapter, ProcessingResult } from '../types';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import libre from 'libreoffice-convert';

type DocumentFormat = 'pdf' | 'docx' | 'xlsx' | 'txt';

export class DocumentProcessor implements MediaAdapter {
  private supportedTypes = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ]);

  private supportedConversions: Record<DocumentFormat, string[]> = {
    'pdf': ['txt'],
    'docx': ['pdf', 'txt'],
    'xlsx': ['pdf'],
    'txt': ['pdf', 'docx']
  };

  private tempDir = join(process.cwd(), 'temp');

  constructor() {
    mkdir(this.tempDir, { recursive: true }).catch(console.error);
  }

  supports(mimeType: string): boolean {
    return this.supportedTypes.has(mimeType);
  }

  async process(buffer: Buffer): Promise<ProcessingResult> {
    const fileType = await fileTypeFromBuffer(buffer);
    const format = fileType?.ext as DocumentFormat || 'pdf';
    const availableConversions = this.supportedConversions[format] || [];

    return {
      url: URL.createObjectURL(new Blob([buffer])),
      mimeType: fileType?.mime || 'application/pdf',
      size: buffer.length,
      metadata: {
        format,
        availableConversions
      }
    };
  }

  async manipulate(buffer: Buffer, operation: string, params: Record<string, unknown>): Promise<Buffer> {
    try {
      await mkdir(this.tempDir, { recursive: true });

      switch (operation) {
        case 'convert': {
          const targetFormat = (params.format as string).toLowerCase();
          const fileTypeResult: FileTypeResult | undefined = await fileTypeFromBuffer(buffer);
          const sourceExt = fileTypeResult?.ext as DocumentFormat | undefined;

          const srcFormat: DocumentFormat = sourceExt ?? 'pdf';
          if (!this.supportedConversions[srcFormat]?.includes(targetFormat)) {
            throw new Error(`Conversion from ${srcFormat} to ${targetFormat} is not supported.`);
          }

          let filterToUse: string | undefined = undefined;
          if (targetFormat === 'txt') {
            filterToUse = 'txt:Text (encoded):UTF8';
          }

          const outputExtension = targetFormat.startsWith('.') ? targetFormat : `.${targetFormat}`;

          const resultBuffer: Buffer = await new Promise((resolve, reject) => {
            const cb = (err: Error | null, done: Buffer) => {
              if (err) reject(err);
              else resolve(done);
            };

            libre.convert(buffer, outputExtension, filterToUse, cb);
          });

          return resultBuffer;
        }
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (error) {
      console.error('Document manipulation error:', error);
      throw error;
    }
  }
}

export default DocumentProcessor; 