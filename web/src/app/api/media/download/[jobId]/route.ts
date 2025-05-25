import { NextRequest, NextResponse } from 'next/server';
import { fileQueue } from '../../../../../lib/queue/fileQueue';

export async function GET(
  request: NextRequest,
  context: { params: { jobId: string } }
) {
  try {
    const { jobId } = context.params;
    const job = await fileQueue.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.status !== 'completed' || !job.file.buffer) {
      return NextResponse.json({ error: 'File not available' }, { status: 400 });
    }

    const buffer = job.file.buffer;
    
    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': job.file.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${job.file.originalName}"`,
        'Content-Length': job.file.size.toString()
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
} 