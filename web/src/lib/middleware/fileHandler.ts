import { NextRequest } from 'next/server';
import { File } from 'buffer';
import { detectFileType, FileCategory, FileDetails } from './fileTypeDetection';

export type FileData = {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
  fileType: FileDetails;
};

export async function parseFormData(request: NextRequest): Promise<FileData> {
  const formData = await request.formData();
  const file = formData.get('file') as unknown as File;
  
  if (!file) {
    throw new Error('No file provided');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = await detectFileType(buffer);
  
  return {
    buffer,
    originalName: file.name,
    mimeType: fileType.mimeType,
    size: file.size,
    fileType
  };
}

export function validateFileSize(size: number, maxSize: number = 100 * 1024 * 1024) {
  if (size > maxSize) {
    throw new Error('File size exceeds limit');
  }
}

export function getMimeCategory(mimeType: string): FileCategory {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('application/')) return 'document';
  return 'unknown';
} 