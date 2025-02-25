import { NextRequest, NextResponse } from 'next/server';
import { fileQueue } from '../../../../../lib/queue/fileQueue';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;
    const job = await fileQueue.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Include file type information in response
    return NextResponse.json({
      ...job,
      fileType: job.file.fileType?.category || 'unknown'
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
} 