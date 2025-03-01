import { MediaAdapter, ProcessingResult } from './types';
import { Buffer } from 'buffer';
import { mkdir, writeFile, unlink, readFile } from 'fs/promises';
import { join } from 'path';
import { PDFDocument, PDFFont, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph } from 'docx';
import { detectFileType } from '../middleware/fileTypeDetection';
import mammoth from 'mammoth';
import puppeteer from 'puppeteer';
import { randomUUID } from 'crypto';

type DocumentFormat = 'pdf' | 'docx' | 'txt';

export class DocumentProcessor implements MediaAdapter {
  private supportedTypes = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]);

  private supportedConversions: Record<DocumentFormat, string[]> = {
    'pdf': ['docx', 'txt'],
    'docx': ['pdf', 'txt'],
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
    const fileDetails = await detectFileType(buffer);
    const format = fileDetails.extension as DocumentFormat || 'pdf';
    const availableConversions = this.supportedConversions[format] || [];

    console.log('Buffer content:', buffer.toString('utf-8', 0, 100)); // Log first 100 characters

    return {
      url: URL.createObjectURL(new Blob([buffer])),
      mimeType: fileDetails.mimeType,
      size: buffer.length,
      metadata: {
        format,
        availableConversions
      }
    };
  }

  async manipulate(buffer: Buffer, operation: string, params: Record<string, unknown>): Promise<Buffer> {
    try {
      const format = params.format as string;
      
      if (operation === 'convert' && format) {
        console.log('Converting document to:', format);
        
        switch (format) {
          case 'pdf': return this.convertToPdf(buffer);
          case 'docx': return this.convertToDocx(buffer);
          case 'txt': return this.convertToTxt(buffer);
          default: throw new Error(`Unsupported format: ${format}`);
        }
      }
      
      throw new Error(`Unsupported operation: ${operation}`);
    } catch (error) {
      console.error('Document manipulation error:', error);
      throw error;
    }
  }

  private async convertToPdf(buffer: Buffer): Promise<Buffer> {
    const fileDetails = await detectFileType(buffer);
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let page = pdfDoc.addPage([595, 842]); // A4 size in points (w,h)
    const { width, height } = page.getSize();
    const margin = 50; // Margin from the edges
    const lineHeight = 14; // Sets line height

    // Checks if the file is .txt
    if (fileDetails.mimeType === 'text/plain') {
      const text = buffer.toString('utf-8'); // Convert buffer to string

      // Splits text into lines based on the page width
      const lines = this.splitTextIntoLines(text, helveticaFont, width - 2 * margin);

      // Drawseach line on the PDF page
      let yPosition = height - margin; // Starts from the top of the page

      for (const line of lines) {
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: 12,
          font: helveticaFont,
          lineHeight: lineHeight,
        });
        yPosition -= lineHeight; // Move down for the next line
        if (yPosition < margin) {
          // If reaching the bottom margin, create new page
          page = pdfDoc.addPage([595, 842]); // Change const to let
          yPosition = height - margin; // Resets yPosition for the new page
        }
      }
    } 
    // Check if the file is a docx file
    else if (fileDetails.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const tempInputPath = join(this.tempDir, `${randomUUID()}.docx`);
      const tempHtmlPath = join(this.tempDir, `${randomUUID()}.html`);
      await writeFile(tempInputPath, buffer);

      // Convert docx to html using mammoth
      const result = await mammoth.convertToHtml({ path: tempInputPath });
      const html = `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              p { line-height: 1.5; }
            </style>
          </head>
          <body>${result.value}</body>
        </html>`;

      await writeFile(tempHtmlPath, html);

      // Converts html to pdf using puppeteer
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
        printBackground: true
      });

      await browser.close();

      // Cleans up temp files
      await Promise.all([
        unlink(tempInputPath).catch(() => {}),
        unlink(tempHtmlPath).catch(() => {})
      ]);

      return Buffer.from(pdfBuffer);
    } else {
      throw new Error('Unsupported file type for PDF conversion');
    }

    return Buffer.from(await pdfDoc.save());
  }

  private async convertToDocx(buffer: Buffer): Promise<Buffer> {
    const fileDetails = await detectFileType(buffer); // Detect file type
    let text: string;

    // Checks if the file is .txt
    if (fileDetails.mimeType === 'text/plain') {
        text = buffer.toString('utf-8'); // Convert buffer to string
    } else {
        throw new Error('Unsupported file type for DOCX conversion');
    }

    // Logs raw text content for debugging
    console.log('Raw text content:', text);

    // Normalize newlines characters
    text = text.replace(/\r\n/g, '\n') // Windows -> UNIX newlines
               .replace(/\r/g, '\n'); // Mac -> UNIX newlines

    // Debugging outputs to check the text content
    console.log('Text after normalization:', text);

    // Split the texts into paragraphs based on new lines
    const paragraphs = text.split('\n')
        .map(line => line.trim()) // Trim the line first
        .filter(line => line.length > 0) // Filter out empty lines
        .map(line => new Paragraph({ text: line })); // Create Paragraph objects

    // Debugging outputs to check the paragraphs created
    console.log('Paragraphs created:', paragraphs);

    // Create a docx document using the extracted text
    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs, // Uses the paragraphs arr
        }],
    });

    // Converts
    return Buffer.from(await Packer.toBuffer(doc));
  }

  private async convertToTxt(buffer: Buffer): Promise<Buffer> {
    const fileDetails = await detectFileType(buffer);
    
    // If docx, use mammoth
    if (fileDetails.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const tempInputPath = join(this.tempDir, `${randomUUID()}.docx`);
      const tempOutputPath = join(this.tempDir, `${randomUUID()}.txt`);

      // Write the DOCX buffer to a temporary file
      await writeFile(tempInputPath, buffer);

      try {
        // Convert docx to txt, mammoth used
        const result = await mammoth.extractRawText({ path: tempInputPath });
        const text = result.value; // The plain text

        // Writes plain text to txt
        await writeFile(tempOutputPath, text);

        // Read the TXT file back into a Buffer to return
        const txtBuffer = await readFile(tempOutputPath);
        return txtBuffer;
      } catch (error) {
        console.error('Error converting DOCX to TXT:', error);
        throw new Error('Conversion failed');
      } finally {
        // Clean up temporary files
        await Promise.all([
          unlink(tempInputPath).catch(() => {}),
          unlink(tempOutputPath).catch(() => {})
        ]);
      }
    }

    // If the file is not a DOCX, handle it as plain text
    return Buffer.from(this.sanitizeText(buffer.toString('utf-8')));
  }

  private sanitizeText(text: string): string {
    return text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Removes control characters except newlines
      .replace(/[\uD800-\uDFFF]/g, '') // Removes surrogate pairs
      .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, ' '); // Allows newlines and printable characters
  }

  // Helper function to split text into lines based on the available width
  private splitTextIntoLines(text: string, font: PDFFont, maxWidth: number): string[] {
    const lines: string[] = [];
    const paragraphs = text.split('\n'); // Splits text into paragraphs based on newlines

    for (const paragraph of paragraphs) {
      const words = paragraph.split(' '); // Splits each paragraph into words
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, 12); // Measure width of test line

        if (testWidth > maxWidth) {
          lines.push(currentLine); // Pushes current line to lines
          currentLine = word; // Starts a new line with the current word
        } else {
          currentLine = testLine; // Updates current line
        }
      }

      //Pushes last line of paragraph i exists
      if (currentLine) {
        lines.push(currentLine);
      }
    }

    return lines;
  }
}

export default DocumentProcessor; 