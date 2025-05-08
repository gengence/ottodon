import { MediaAdapter, ProcessingResult } from '../types';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { fileTypeFromBuffer } from 'file-type';
import { convert } from 'libreoffice-convert';
import { promisify } from 'util';
import fs from 'fs';

const convertPromise = promisify<Buffer, string, undefined, Buffer>(convert);

const libreOfficeExecutablePath = process.env.LIBREOFFICE_PATH;

if (!libreOfficeExecutablePath || !fs.existsSync(libreOfficeExecutablePath)) {
    console.error(
        `CRITICAL: LIBREOFFICE_PATH environment variable is not set or points to an invalid executable. ` +
        `Document conversion functionality will be severely impacted or disabled. ` +
        `Please ensure LibreOffice is installed and LIBREOFFICE_PATH is correctly configured to its soffice executable.`
    );
} else {
    console.info(
        `LibreOffice executable for document conversion is configured to: ${libreOfficeExecutablePath}. ` +
        `This path will be used by the document conversion library.`
    );
}

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
    'pdf': ['docx', 'txt'],
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
          const format = params.format as string;
          console.log('Converting document to:', format);

          try {
            const result = await convertPromise(buffer, `.${format}`, undefined);
            console.log('Conversion successful');
            return Buffer.from(result);
          } catch (error) {
            console.error('Conversion error:', error);
            throw new Error('Document conversion failed. Please check if LibreOffice is installed.');
          }
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