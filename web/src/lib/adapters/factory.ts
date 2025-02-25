import { MediaAdapter } from './types';
import { ImageAdapter } from './imageAdapter';
import { MediaProcessor } from './mediaAdapter';
import { DocumentProcessor } from './documentAdapter';

const adapters: MediaAdapter[] = [
  new ImageAdapter(),
  new MediaProcessor(),
  new DocumentProcessor()
];

export function getAdapter(mimeType: string): MediaAdapter | undefined {
  return adapters.find(adapter => adapter.supports(mimeType));
} 