export const mimeTypes = {
  // Images
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'webp': 'image/webp',
  'gif': 'image/gif',
  'avif': 'image/avif',
  
  // Videos
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  
  // Documents
  'pdf': 'application/pdf',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'txt': 'text/plain'
} as const; 