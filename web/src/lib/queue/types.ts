import { FileDetails } from '../middleware/fileTypeDetection';
import { ManipulationOptions } from '../services/manipulationOptions';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Job {
  id: string;
  status: JobStatus;
  progress: number;
  file: {
    originalName: string;
    mimeType: string;
    size: number;
    fileType?: FileDetails;
    buffer?: Buffer;
  };
  options: unknown;
  error?: string;
  result?: {
    url: string;
    mimeType: string;
    size: number;
  };
  manipulationOptions?: ManipulationOptions;
}

export interface QueueOptions {
  maxConcurrent?: number;
  timeout?: number;
} 