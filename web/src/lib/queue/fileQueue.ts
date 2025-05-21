import { Job, JobStatus } from './types';
import { processFile } from '../services/fileProcessing';
import { FileData } from '../middleware/fileHandler';
import { MediaAdapter } from '../conversion/types';
import { getAdapter } from '../conversion/factory';
import { mimeTypes } from '../types/mimeTypes';

declare global {
  var jobQueue: Map<string, Job>;
  var jobCounter: number;
}

if (!global.jobQueue) {
  global.jobQueue = new Map<string, Job>();
  global.jobCounter = 0;
}

class FileQueue {
  private get jobs() {
    return global.jobQueue;
  }

  private get counter() {
    return global.jobCounter;
  }

  private set counter(value: number) {
    global.jobCounter = value;
  }

  async add(data: { 
    file: Pick<FileData, 'originalName' | 'mimeType' | 'size' | 'fileType'>, 
    buffer: Buffer, 
    options: unknown 
  }): Promise<Job> {
    const id = (++this.counter).toString();
    
    const job: Job = {
      id,
      status: 'pending' as JobStatus,
      progress: 0,
      file: {
        ...data.file,
        buffer: data.buffer
      },
      options: data.options
    };

    this.jobs.set(id, job);
    console.log('Added job to queue:', { id, jobs: this.jobs.size });

    this.process(id, {
      buffer: data.buffer,
      originalName: data.file.originalName,
      mimeType: data.file.mimeType,
      size: data.file.size,
      fileType: data.file.fileType
    });

    return job;
  }

  async getJob(id: string): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    console.log(`Queue state for ${id}:`, {
      found: !!job,
      status: job?.status,
      totalJobs: this.jobs.size
    });
    return job;
  }

  async convert(jobId: string, format: string): Promise<Job> {
    console.log(`Starting conversion for job ${jobId} to format ${format}`);
    
    const job = this.jobs.get(jobId);
    if (!job) throw new Error('Job not found');

    const buffer = job.file.buffer;
    if (!buffer) throw new Error('File buffer not found');

    const adapter = this.getAdapter(job.file.mimeType);
    const isPdfToDocx = job.file.mimeType === 'application/pdf' && format.toLowerCase() === 'docx';

    if (!adapter && !isPdfToDocx) throw new Error('No adapter found for file type');

    try {
      job.status = 'processing';
      this.jobs.set(jobId, job);

      let convertedBuffer: Buffer;

      if (isPdfToDocx) {
        const { pdfToDocxCLI } = await import('../services/pdf2docxCli');
        convertedBuffer = await pdfToDocxCLI(buffer);
      } else {
        convertedBuffer = await adapter!.manipulate(buffer, 'convert', { format });
      }
      console.log('Conversion successful, new size:', convertedBuffer.length);
      
      const updatedJob: Job = {
        ...job,
        status: 'completed' as JobStatus,
        file: {
          ...job.file,
          buffer: convertedBuffer
        },
        result: {
          url: URL.createObjectURL(new Blob([convertedBuffer])),
          mimeType: mimeTypes[format as keyof typeof mimeTypes] || 'application/octet-stream',
          size: convertedBuffer.length
        }
      };
      this.jobs.set(jobId, updatedJob);

      return updatedJob;
    } catch (error) {
      console.error('Conversion failed:', error);
      const failedJob: Job = {
        ...job,
        status: 'failed' as JobStatus,
        error: error instanceof Error ? error.message : 'Conversion failed'
      };
      this.jobs.set(jobId, failedJob);
      throw error;
    }
  }

  private getAdapter(mimeType: string): MediaAdapter | undefined {
    return getAdapter(mimeType);
  }

  private async process(id: string, fileData: FileData) {
    const job = this.jobs.get(id);
    if (!job) {
      console.error(`Job ${id} not found in queue`);
      return;
    }

    console.log(`Starting process for job ${id}`);
    job.status = 'processing';
    this.jobs.set(id, job);

    try {
      const result = await processFile(fileData, job.options);
      const updatedJob: Job = { 
        ...job, 
        ...result,
        status: 'completed' as JobStatus
      };
      this.jobs.set(id, updatedJob);
      console.log(`Completed job ${id}`);
    } catch (error) {
      console.error(`Failed job ${id}:`, error);
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Processing failed';
      this.jobs.set(id, job);
    }
  }
}

export const fileQueue = new FileQueue(); 