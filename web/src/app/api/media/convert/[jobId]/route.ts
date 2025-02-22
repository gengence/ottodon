import { NextRequest, NextResponse } from 'next/server';
import { fileQueue } from '@/lib/queue/fileQueue';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;
    const { format } = await request.json();
    
    console.log(`Conversion request received for job ${jobId} to ${format}`);

    const job = await fileQueue.getJob(jobId);
    if (!job) {
      console.log('Job not found:', jobId);
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    console.log('Found job:', {
      id: job.id,
      status: job.status,
      mimeType: job.file.mimeType
    });

    const result = await fileQueue.convert(jobId, format);
    
    // Creates response with the file data
    const buffer = result.file.buffer;
    if (!buffer) {
      throw new Error('Converted file buffer not found');
    }

    // Returns as downloadable file
    const originalName = result.file.originalName;
    // Removes the original extension and add the new format
    const newFilename = originalName.replace(/\.[^/.]+$/, '') + '.' + format;

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': result.result?.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${newFilename}"`,
        'Content-Length': buffer.length.toString()
      }
    });

  } catch (error) {
    console.error('Conversion error:', error);
    
    let errorMessage = 'Conversion failed';
    if (error instanceof Error) {
        if (error.message.includes('LibreOffice not found')) {
            errorMessage = 'Document conversion requires LibreOffice to be installed';
        } else if (error.message.includes('soffice: command not found')) {
            errorMessage = 'LibreOffice installation not found in system path';
        }
    }
    
    return NextResponse.json(
      { 
        error: 'Conversion failed',
        details: errorMessage
      },
      { status: 500 }
    );
  }
} 