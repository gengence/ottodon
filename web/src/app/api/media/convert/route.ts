import { NextRequest, NextResponse } from 'next/server';
import { queueConversion } from '@/lib/queue/conversionQueue';

export async function POST(request: NextRequest) {
  try {
    const { jobId, format, operation, params } = await request.json();

    // Queue the conversion job
    const conversionJobId = await queueConversion({
      jobId,
      format,
      operation,
      params
    });

    return NextResponse.json({
      conversionJobId,
      status: 'queued',
      message: 'Conversion job queued successfully'
    });

  } catch (error) {
    console.error('Conversion queue error:', error);
    return NextResponse.json(
      { error: 'Failed to queue conversion' },
      { status: 500 }
    );
  }
} 