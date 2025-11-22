export interface ImageState {
  file: File | null;
  preview: string | null;
  base64: string | null;
  mimeType: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GenerationResult {
  imageUrl: string | null;
  error?: string;
}
