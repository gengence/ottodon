import { MediaAdapter, ProcessingResult } from '../types';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { convert } from 'libreoffice-convert';
import { promisify } from 'util';
import fs from 'fs';

interface LibreOfficeConvertOptions {
  sofficeBinaryPaths?: string[];
}

const convertPromise = promisify<
  Buffer,                      
  string,                      
  string | undefined,           
  LibreOfficeConvertOptions | undefined, 
  Buffer                       
>(convert as any);

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
    /*
    try {
      await mkdir(this.tempDir, { recursive: true });

      switch (operation) {
        case 'convert': {
          const targetFormat = (params.format as string).toLowerCase();
          const fileTypeResult: FileTypeResult | undefined = await fileTypeFromBuffer(buffer);
          const sourceExt = fileTypeResult?.ext;

          console.log(`Attempting conversion from ${sourceExt || 'unknown'} to ${targetFormat} using libreoffice-convert.`);

          let filterToUse: string | undefined = undefined;
          if (targetFormat === 'txt') {
            filterToUse = 'txt:Text (encoded):UTF8';
          } else if (targetFormat === 'docx') {
            filterToUse = 'docx:Office Open XML Text';
          }

          if (filterToUse) {
            console.log(`Using specific filter for libreoffice-convert (${sourceExt || 'unknown'} to ${targetFormat}): ${filterToUse}`);
          } else {
            console.log(`Using default/auto-detected filter for libreoffice-convert (${sourceExt || 'unknown'} to ${targetFormat}).`);
          }

          try {
            const outputExtension = targetFormat.startsWith('.') ? targetFormat : `.${targetFormat}`;
            
            let conversionOptions: LibreOfficeConvertOptions | undefined = undefined;
            if (libreOfficeExecutablePath && fs.existsSync(libreOfficeExecutablePath)) {
              conversionOptions = { sofficeBinaryPaths: [libreOfficeExecutablePath] };
              console.log(`Using soffice binary path for conversion: ${libreOfficeExecutablePath}`);
            } else {
              console.warn(
                `LIBREOFFICE_PATH ('${libreOfficeExecutablePath}') is not valid or not set. ` +
                `Attempting conversion without explicitly setting soffice binary path. ` +
                `This may fail if soffice is not in the system PATH or if the library requires it.`
              );
            }

            const resultBuffer = await convertPromise(buffer, outputExtension, filterToUse, conversionOptions);
            console.log(`Successfully converted from ${sourceExt || 'unknown'} to ${targetFormat} using libreoffice-convert.`);
            return resultBuffer;
          } catch (error) {
            console.error(`libreoffice-convert failed for ${sourceExt || 'unknown'} to ${targetFormat}:`, error);
            throw new Error(`Document conversion from ${sourceExt || 'original format unknown'} to ${targetFormat} failed using libreoffice-convert.`);
          }
        }
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (error) {
      console.error('Document manipulation error:', error);
      throw error;
    }
    */
    console.error('Document manipulation/conversion is temporarily disabled.');
    throw new Error('Document manipulation/conversion is temporarily disabled.');
  }
}

export default DocumentProcessor; 