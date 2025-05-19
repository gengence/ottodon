import { MediaAdapter } from './types';
import { ImageProcessor } from './adapters/imageAdapter';
import { MediaProcessor } from './adapters/mediaAdapter';
// import { DocumentProcessor } from './adapters/documentAdapter'; // Remove DocumentProcessor

const adapters: MediaAdapter[] = [
  new ImageProcessor(),
  new MediaProcessor(),
  // new DocumentProcessor() // Remove DocumentProcessor instance
];

export function getAdapter(mimeType: string): MediaAdapter | undefined {
  return adapters.find(adapter => adapter.supports(mimeType)); 
  // console.warn('Media conversion is disabled. getAdapter will always return undefined.');
  // return undefined;
} 