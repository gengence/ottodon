import { NextRequest, NextResponse } from 'next/server';
import { parseFormData, validateFileSize } from '../../../lib/middleware/fileHandler';
import { fileQueue } from '../../../lib/queue/fileQueue';
import { detectFileType } from '../../../lib/middleware/fileTypeDetection';
import { downloaderFactory } from '../../../lib/downloaders';

async function downloadFromUrl(url: string) {
  const downloader = downloaderFactory.getDownloaderForUrl(url);
  
  if (downloader) {
    const result = await downloader.download(url);
    const fileType = await detectFileType(result.buffer);
    
    return {
      buffer: result.buffer,
      originalName: result.originalName,
      mimeType: result.mimeType || fileType.mimeType,
      size: result.size,
      fileType
    };
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to download from URL');
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const fileType = await detectFileType(buffer);
  const filename = url.split('/').pop() || 'download';

  return {
    buffer,
    originalName: filename,
    mimeType: fileType.mimeType,
    size: buffer.length,
    fileType
  };
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let fileData;

    if (contentType.includes('application/json')) {
      const { url } = await request.json();
      fileData = await downloadFromUrl(url);
    } else {
      fileData = await parseFormData(request);
    }

    validateFileSize(fileData.size);

    if (fileData.fileType.category === 'unknown') {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    const job = await fileQueue.add({
      file: {
        originalName: fileData.originalName,
        mimeType: fileData.mimeType,
        size: fileData.size,
        fileType: fileData.fileType
      },
      buffer: fileData.buffer,
      options: {}
    });

    return NextResponse.json({
      jobId: job.id,
      status: 'pending',
      fileType: fileData.fileType.category
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}; 