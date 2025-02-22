import { FileDetails } from '../middleware/fileTypeDetection';

export interface ConversionOption {
  format: string;
  label: string;
  quality?: number[];
}

export interface ManipulationOperation {
  id: string;
  label: string;
  type: 'resize' | 'rotate' | 'crop' | 'compress' | 'trim' | 'extract' | 'merge';
  options?: Record<string, unknown>;
}

export interface ManipulationOptions {
  conversions: ConversionOption[];
  operations: ManipulationOperation[];
}

const imageOptions: ManipulationOptions = {
  conversions: [
    { format: 'jpeg', label: 'JPEG', quality: [60, 75, 90] },
    { format: 'png', label: 'PNG' },
    { format: 'webp', label: 'WebP', quality: [60, 75, 90] },
    { format: 'avif', label: 'AVIF', quality: [60, 75, 90] },
  ],
  operations: [
    {
      id: 'resize',
      label: 'Resize',
      type: 'resize',
      options: {
        maintainAspectRatio: true,
        maxWidth: 3840,
        maxHeight: 2160
      }
    },
    {
      id: 'rotate',
      label: 'Rotate',
      type: 'rotate',
      options: {
        angles: [90, 180, 270]
      }
    },
    {
      id: 'compress',
      label: 'Compress',
      type: 'compress'
    }
  ]
};

const videoOptions: ManipulationOptions = {
  conversions: [
    { format: 'mp4', label: 'MP4' },
    { format: 'webm', label: 'WebM' },
    { format: 'gif', label: 'GIF' }
  ],
  operations: [
    {
      id: 'trim',
      label: 'Trim',
      type: 'trim'
    },
    {
      id: 'extract-audio',
      label: 'Extract Audio',
      type: 'extract'
    }
  ]
};

const audioOptions: ManipulationOptions = {
  conversions: [
    { format: 'mp3', label: 'MP3' },
    { format: 'wav', label: 'WAV' },
    { format: 'ogg', label: 'OGG' }
  ],
  operations: [
    {
      id: 'trim',
      label: 'Trim',
      type: 'trim'
    },
    {
      id: 'compress',
      label: 'Compress',
      type: 'compress'
    }
  ]
};

const documentOptions: ManipulationOptions = {
  conversions: [
    { format: 'pdf', label: 'PDF' },
    { format: 'docx', label: 'Word Document' },
    { format: 'txt', label: 'Plain Text' }
  ],
  operations: [
    {
      id: 'compress',
      label: 'Compress',
      type: 'compress'
    }
  ]
};

export function getManipulationOptions(fileDetails: FileDetails): ManipulationOptions {
  // Filter out current format from conversion options
  const getFilteredOptions = (options: ManipulationOptions): ManipulationOptions => ({
    ...options,
    conversions: options.conversions.filter(c => c.format !== fileDetails.extension)
  });

  switch (fileDetails.category) {
    case 'image':
      return getFilteredOptions(imageOptions);
    case 'video':
      return getFilteredOptions(videoOptions);
    case 'audio':
      return getFilteredOptions(audioOptions);
    case 'document':
      return getFilteredOptions(documentOptions);
    default:
      return { conversions: [], operations: [] };
  }
} 