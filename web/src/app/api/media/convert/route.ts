import { NextRequest, NextResponse } from 'next/server';
import { queueConversion } from '@/lib/queue/conversionQueue';

const DISABLED_DOCUMENT_FORMATS = new Set(['pdf', 'docx', 'xlsx', 'txt']);

export async function POST(request: NextRequest) {
  try {
    const { jobId, format, operation, params } = await request.json();

    if (typeof format === 'string' && DISABLED_DOCUMENT_FORMATS.has(format.toLowerCase())) {
      console.warn(`Attempt to convert to disabled document format '${format}' for job ${jobId}.`);
      return NextResponse.json(
        { error: `Conversion to document format '${format}' is temporarily disabled.` },
        { status: 503 }
      );
    }

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
    const errorMessage = error instanceof Error ? error.message : 'Failed to queue conversion';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 