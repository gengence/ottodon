import { NextRequest, NextResponse } from 'next/server';
import Queue from 'bull';

const conversionQueue = new Queue('media-conversion');

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;
    const job = await conversionQueue.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const state = await job.getState();
    const progress = job.progress;

    return NextResponse.json({
      id: job.id,
      state,
      progress,
      result: job.returnvalue,
      error: job.failedReason
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
} 