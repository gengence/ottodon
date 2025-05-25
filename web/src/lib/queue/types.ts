import { FileDetails } from '../middleware/fileTypeDetection';
import { AvailableManipulations } from '../services/availableManipulations';

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
  manipulationOptions?: AvailableManipulations;
}

export interface QueueOptions {
  maxConcurrent?: number;
  timeout?: number;
} 