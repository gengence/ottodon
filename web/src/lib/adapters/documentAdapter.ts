import { MediaAdapter, ProcessingResult } from './types';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const execAsync = promisify(exec);

export class DocumentProcessor implements MediaAdapter {
  private supportedTypes = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ]);

  private tempDir = join(process.cwd(), 'temp');
  private isLibreOfficeAvailable: boolean = false;
  private readonly SOFFICE_PATHS = [
    '/Applications/LibreOffice.app/Contents/MacOS/soffice', //macOS
    '/usr/bin/soffice',                                     //Linux
    'C:\\Program Files\\LibreOffice\\program\\soffice.exe', //Windows
    'soffice'                                               //System PATH
  ];
  private sofficePath: string | null = null;

  constructor() {
    this.init();
    mkdir(this.tempDir, { recursive: true }).catch(console.error);
  }

  private async init() {
    try {
      this.sofficePath = await this.findLibreOfficePath();
      this.isLibreOfficeAvailable = true;
      console.log('LibreOffice found at:', this.sofficePath);
    } catch (error) {
      console.error('LibreOffice not found:', error);
      this.isLibreOfficeAvailable = false;
    }
  }

  private async findLibreOfficePath(): Promise<string> {
    for (const path of this.SOFFICE_PATHS) {
      try {
        await execAsync(`"${path}" --version`);
        return path;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        continue;
      }
    }
    throw new Error('LibreOffice not found. Please install LibreOffice.');
  }

  supports(mimeType: string): boolean {
    return this.supportedTypes.has(mimeType);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(buffer: Buffer, _options: unknown): Promise<ProcessingResult> {
    const tempPath = join(this.tempDir, `${randomUUID()}`);
    await writeFile(tempPath, buffer);

    try {
      return {
        url: URL.createObjectURL(new Blob([buffer])),
        mimeType: await this.detectMimeType(tempPath),
        size: buffer.length,
        metadata: {
          format: await this.detectFormat(tempPath)
        }
      };
    } finally {
      await unlink(tempPath).catch(console.error);
    }
  }

  private async detectMimeType(filePath: string): Promise<string> {
    const { stdout } = await execAsync(`file --mime-type ${filePath}`);
    return stdout.split(': ')[1].trim();
  }

  private async detectFormat(filePath: string): Promise<string> {
    const { stdout } = await execAsync(`file ${filePath}`);
    return stdout.split(': ')[1].trim();
  }

  async manipulate(buffer: Buffer, operation: string, params: Record<string, unknown>): Promise<Buffer> {
    const tempInput = join(this.tempDir, `in_${randomUUID()}`);
    const tempOutput = join(this.tempDir, `out_${randomUUID()}`);
    await writeFile(tempInput, buffer);

    try {
      switch (operation) {
        case 'convert':
          await this.convert(tempInput, tempOutput, params.format as string);
          break;
        case 'compress':
          await this.compress(tempInput, tempOutput);
          break;
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }

      return await readFile(tempOutput);
    } finally {
      await Promise.all([
        unlink(tempInput).catch(console.error),
        unlink(tempOutput).catch(console.error)
      ]);
    }
  }

  private async convert(input: string, output: string, format: string): Promise<void> {
    if (!this.isLibreOfficeAvailable || !this.sofficePath) {
      throw new Error('LibreOffice is not available. Please install LibreOffice.');
    }

    const outputDir = join(this.tempDir, 'output');
    await mkdir(outputDir, { recursive: true });

    try {
      const cmd = `"${this.sofficePath}" --headless --convert-to ${format} --outdir "${outputDir}" "${input}"`;
      console.log('Running conversion command:', cmd);
      
      const { stdout, stderr } = await execAsync(cmd);
      console.log('Conversion output:', stdout);
      if (stderr) console.error('Conversion errors:', stderr);

      //LibreOffice creates the output file with the same name but different extension
      const inputName = input.split('/').pop()?.split('.')[0];
      const convertedFile = join(outputDir, `${inputName}.${format}`);
      
      //Move to the requested output location
      const convertedContent = await readFile(convertedFile);
      await writeFile(output, convertedContent);
      
      //Cleanup
      await unlink(convertedFile).catch(console.error);
      
    } catch (error) {
      console.error('Conversion error:', error);
      throw new Error(`Document conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async compress(input: string, output: string): Promise<void> {
    // Uses GhostScript for PDF compression or other methods based on file type
    const cmd = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${output} ${input}`;
    await execAsync(cmd);
  }
}

export default DocumentProcessor; 