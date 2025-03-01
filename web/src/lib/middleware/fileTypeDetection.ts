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
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
  'text/plain',
  'application/rtf'
]);

export async function detectFileType(buffer: Buffer): Promise<FileDetails> {
  let fileType;

  try {
    //Attepts to detect the file type using fileTypeFromBuffer
    fileType = await fileTypeFromBuffer(buffer);
  } catch (error) {
    console.error('Error detecting file type:', error);
    // Handle the error gracefully
  }

  // If fileType isn't detected, check if its .txt
  if (!fileType) {
    // Check if the buffer has text content
    const content = buffer.toString('utf-8', 0, 100); // Reads first 100
    if (content.includes('\n') || content.includes('\r')) { // Checks for line breaks
      return {
        category: 'document',
        mimeType: 'text/plain',
        extension: 'txt'
      };
    }
    
    return {
      category: 'unknown',
      mimeType: 'application/octet-stream',
      extension: 'bin'
    };
  }

  const { mime, ext } = fileType;

  console.log('Detected MIME type:', mime, 'with extension:', ext);

  // Checks if the mime type is in the documentTypes set
  if (documentTypes.has(mime) || ext === 'txt') {
    return {
      category: 'document',
      mimeType: mime,
      extension: ext
    };
  }

  // Categorizes based on mime type
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

  return {
    category: 'unknown',
    mimeType: mime,
    extension: ext
  };
}

// Supports file types by category
export const supportedTypes = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'],
  video: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v', 'flv'],
  audio: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'],
  document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf']
}; 