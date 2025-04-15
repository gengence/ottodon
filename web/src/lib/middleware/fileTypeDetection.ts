import { fileTypeFromBuffer } from 'file-type';

export type FileCategory = 'image' | 'video' | 'audio' | 'document' | 'unknown';
export type FileDetails = {
  category: FileCategory;
  mimeType: string;
  extension: string;
};

const documentTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
  'text/plain',
  'application/rtf'
]);

export async function detectFileType(buffer: Buffer): Promise<FileDetails> {
  const fileType = await fileTypeFromBuffer(buffer);
  
  if (!fileType) {
    return {
      category: 'unknown',
      mimeType: 'application/octet-stream',
      extension: 'bin'
    };
  }

  const { mime, ext } = fileType;

  if (mime.startsWith('image/')) {
    return {
      category: 'image',
      mimeType: mime,
      extension: ext
    };
  }

  if (mime.startsWith('video/')) {
    return {
      category: 'video',
      mimeType: mime,
      extension: ext
    };
  }

  if (mime.startsWith('audio/')) {
    return {
      category: 'audio',
      mimeType: mime,
      extension: ext
    };
  }

  if (documentTypes.has(mime)) {
    return {
      category: 'document',
      mimeType: mime,
      extension: ext
    };
  }

  return {
    category: 'unknown',
    mimeType: mime,
    extension: ext
  };
}

export const supportedTypes = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'],
  video: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v', 'flv'],
  audio: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'],
  document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf']
}; 