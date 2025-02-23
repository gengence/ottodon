import { MediaAdapter, ProcessingResult } from './types';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { fileTypeFromBuffer } from 'file-type';
import { convert } from 'libreoffice-convert';
import { promisify } from 'util';
import fs from 'fs';

// Promisify the convert function
const convertPromise = promisify<Buffer, string, undefined, Buffer>(convert);

// Common LibreOffice paths to check
const possiblePaths = [
  '/Applications/LibreOffice.app/Contents/MacOS/soffice',  // macOS
  'C:\\Program Files\\LibreOffice\\program\\soffice.exe',  // Windows
  'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',  // Windows 32-bit
  '/usr/bin/libreoffice',  // Linux
  '/usr/bin/soffice'  // Linux alternative
];

// Find first existing LibreOffice installation
const LIBRE_OFFICE_PATH = possiblePaths.find(path => fs.existsSync(path));

if (!LIBRE_OFFICE_PATH) {
  console.error('LibreOffice not found in common locations. Please install LibreOffice.');
} else {
  console.log('LibreOffice found at:', LIBRE_OFFICE_PATH);
  process.env.LIBRE_OFFICE_PATH = LIBRE_OFFICE_PATH;
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