import Queue from 'bull';
import { fileQueue } from './fileQueue';

interface ConversionJob {
  jobId: string;
  format: string;
  operation?: string;
  params?: Record<string, unknown>;
}

const conversionQueue = new Queue<ConversionJob>('media-conversion', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

conversionQueue.process(async (job) => {
  const { jobId, format, operation, params } = job.data;
  
  try {
    job.progress(10);
    
    const originalJob = await fileQueue.getJob(jobId);
    if (!originalJob) throw new Error('Original job not found');

    job.progress(30);
    const result = await fileQueue.convert(jobId, format);
    job.progress(90);

    return result;
  } catch (error) {
    console.error('Conversion failed:', error);
    throw error;
  }
});

conversionQueue.on('completed', (job, result) => {
  console.log(`Conversion completed for job ${job.data.jobId}`);
});

conversionQueue.on('failed', (job, error) => {
  console.error(`Conversion failed for job ${job.data.jobId}:`, error);
});

export async function queueConversion(data: ConversionJob): Promise<string> {
  const job = await conversionQueue.add(data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
  
  return job.id.toString();
} 