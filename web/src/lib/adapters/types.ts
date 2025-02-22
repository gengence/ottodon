export interface ProcessingResult {
  url: string;
  mimeType: string;
  size: number;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    hasAlpha?: boolean;
    duration?: number;  //Audio + video
  };
}

export interface MediaAdapter {
  process(buffer: Buffer, options: unknown): Promise<ProcessingResult>;
  supports(mimeType: string): boolean;
  manipulate(buffer: Buffer, operation: string, params: Record<string, unknown>): Promise<Buffer>;
} 