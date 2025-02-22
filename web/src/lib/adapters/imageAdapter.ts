import sharp from 'sharp';
import { MediaAdapter, ProcessingResult } from './types';

export class ImageAdapter implements MediaAdapter {
  private supportedTypes = new Set([
    'image/jpeg', 'image/png', 'image/webp', 
    'image/gif', 'image/avif', 'image/tiff'
  ]);

  supports(mimeType: string): boolean {
    return this.supportedTypes.has(mimeType);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(buffer: Buffer, _options: unknown): Promise<ProcessingResult> {
    //Initializes sharp with buffer
    const image = sharp(buffer);

    // Image metadata
    const metadata = await image.metadata();

    // Return basic info for initial processing
    return {
      url: URL.createObjectURL(new Blob([await image.toBuffer()])),
      mimeType: metadata.format ? `image/${metadata.format}` : 'image/unknown',
      size: buffer.length,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        hasAlpha: metadata.hasAlpha
      }
    };
  }

  async manipulate(buffer: Buffer, operation: string, params: Record<string, unknown>): Promise<Buffer> {
    try {
      const image = sharp(buffer);

      switch (operation) {
        case 'resize':
          return image
            .resize(params.width as number, params.height as number, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .toBuffer();

        case 'rotate':
          return image
            .rotate(params.angle as number)
            .toBuffer();

        case 'compress':
          return image
            .jpeg({ quality: params.quality as number || 80 })
            .toBuffer();

        case 'convert':
          const format = params.format as string;
          console.log('Converting image to:', format);
          
          switch (format) {
            case 'jpeg':
            case 'jpg':
              return await image.jpeg({ quality: params.quality as number || 80 }).toBuffer();
            case 'png':
              return await image.png().toBuffer();
            case 'webp':
              return await image.webp({ quality: params.quality as number || 80 }).toBuffer();
            case 'avif':
              return await image.avif({ quality: params.quality as number || 80 }).toBuffer();
            default:
              throw new Error(`Unsupported image format: ${format}`);
          }

        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (error) {
      console.error('Image manipulation error:', error);
      throw error;
    }
  }
}

// Remove the registerAdapter import and call
export default ImageAdapter; 