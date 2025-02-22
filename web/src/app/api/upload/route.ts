import { NextRequest, NextResponse } from 'next/server';
import { parseFormData, validateFileSize } from '../../../lib/middleware/fileHandler';
import { fileQueue } from '../../../lib/queue/fileQueue';
import { detectFileType } from '../../../lib/middleware/fileTypeDetection';

async function downloadFromUrl(url: string) {
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
    console.log('Starting file processing...');
    const contentType = request.headers.get('content-type') || '';
    let fileData;

    if (contentType.includes('application/json')) {
      console.log('Processing URL submission...');
      const { url } = await request.json();
      fileData = await downloadFromUrl(url);
      console.log('URL download complete:', fileData.originalName, 'Type:', fileData.fileType.category);
    } else {
      console.log('Processing direct file upload...');
      fileData = await parseFormData(request);
      console.log('File upload complete:', fileData.originalName, 'Type:', fileData.fileType.category);
    }

    validateFileSize(fileData.size);

    if (fileData.fileType.category === 'unknown') {
      console.log('Unsupported file type');
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    console.log('Adding to processing queue...');
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
    console.log('Job created with details:', {
      id: job.id,
      type: fileData.fileType.category,
      mime: fileData.mimeType,
      size: fileData.size
    });

    return NextResponse.json({
      jobId: job.id,
      status: 'pending',
      fileType: fileData.fileType.category
    });

  } catch (error) {
    console.error('Upload error:', error);
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