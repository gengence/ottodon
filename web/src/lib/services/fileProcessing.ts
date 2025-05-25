import { FileData } from '../middleware/fileHandler';
import { getAdapter } from '../conversion/factory';
import { Job } from '../queue/types';
import { getManipulationOptions, AvailableManipulations } from './availableManipulations';

export async function processFile(
  fileData: FileData,
  options: Record<string, any>
): Promise<Partial<Job>> {
  try {
    const isSocialMediaFile = fileData.originalName?.toLowerCase().includes('tiktok') || 
                              fileData.originalName?.toLowerCase().includes('instagram') ||
                              fileData.originalName?.toLowerCase().includes('youtube') ||
                              fileData.originalName?.toLowerCase().includes('twitter');

    let result;
    let manipulationOptions: AvailableManipulations | undefined;
    
    if (isSocialMediaFile) {
      result = {
        url: `/api/media/download/${options?.jobId || ''}`,
        mimeType: fileData.mimeType,
        size: fileData.size
      };
      
      if (fileData.originalName?.toLowerCase().includes('youtube')) {
        manipulationOptions = {
          conversions: [],
          operations: [
            {
              id: 'youtube-quality',
              label: 'Download in 1080p',
              type: 'quality' as any,
              options: { quality: '1080p' }
            },
            {
              id: 'youtube-quality-720',
              label: 'Download in 720p',
              type: 'quality' as any,
              options: { quality: '720p' }
            },
            {
              id: 'youtube-quality-480',
              label: 'Download in 480p',
              type: 'quality' as any,
              options: { quality: '480p' }
            },
            {
              id: 'youtube-audio',
              label: 'Download Audio Only (MP3)',
              type: 'quality' as any,
              options: { quality: 'audioonly' }
            }
          ]
        };
      } else {
        manipulationOptions = getManipulationOptions(fileData.fileType);
      }
    } else {
      const adapter = getAdapter(fileData.mimeType);
      if (!adapter) throw new Error('No adapter found for file type');
      
      result = await adapter.process(fileData.buffer, options);
      manipulationOptions = getManipulationOptions(fileData.fileType);
    }
    
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