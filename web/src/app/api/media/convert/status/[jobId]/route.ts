import { NextRequest, NextResponse } from 'next/server';
import Queue from 'bull';

const conversionQueue = new Queue('media-conversion', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

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
    const returnValue = job.returnvalue;
    const failedReason = job.failedReason;

    return NextResponse.json({
      id: job.id,
      state,
      progress,
      result: returnValue,
      error: failedReason
    });

  } catch (error) {
    console.error('Failed to check status:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to check job status', details: message },
      { status: 500 }
    );
  }
} 