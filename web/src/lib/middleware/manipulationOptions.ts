export interface BaseManipulationOptions {
  outputFormat?: string;
  quality?: number;
}

export interface ImageManipulationOptions extends BaseManipulationOptions {
  resize?: {
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
  };
  rotate?: number;
  flip?: 'horizontal' | 'vertical';
}

export interface VideoManipulationOptions extends BaseManipulationOptions {
  trim?: {
    start?: number;
    end?: number;
  };
  resolution?: string;
  fps?: number;
}

export interface AudioManipulationOptions extends BaseManipulationOptions {
  trim?: {
    start?: number;
    end?: number;
  };
  bitrate?: string;
  normalize?: boolean;
}

export interface DocumentManipulationOptions extends BaseManipulationOptions {
  compress?: boolean;
  pageRange?: {
    start: number;
    end: number;
  };
} 