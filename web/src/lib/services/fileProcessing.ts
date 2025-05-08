import { FileData } from '../middleware/fileHandler';
import { getAdapter } from '../conversion/factory';
import { Job } from '../queue/types';
import { getManipulationOptions } from './availableManipulations';

export async function processFile(
  fileData: FileData,
  options: unknown
): Promise<Partial<Job>> {
  try {
    const adapter = getAdapter(fileData.mimeType);
    if (!adapter) throw new Error('No adapter found for file type');

    const result = await adapter.process(fileData.buffer, options);
    const manipulationOptions = getManipulationOptions(fileData.fileType);
    
    return {
      status: 'completed',
      progress: 100,
      result,
      manipulationOptions
    };
  } catch (error) {
    return {
      status: 'failed',
      progress: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 