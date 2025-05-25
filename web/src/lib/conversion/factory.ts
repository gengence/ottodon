import { MediaAdapter } from './types';
import { ImageProcessor } from './adapters/imageAdapter';
import { MediaProcessor } from './adapters/mediaAdapter';
import { DocumentProcessor } from './adapters/documentAdapter';

const adapters: MediaAdapter[] = [
  new ImageProcessor(),
  new MediaProcessor(),
  new DocumentProcessor()
];

export function getAdapter(mimeType: string): MediaAdapter | undefined {
  return adapters.find(adapter => adapter.supports(mimeType)); 
} 