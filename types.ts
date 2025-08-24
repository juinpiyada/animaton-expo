export type GenerationStatus = 'idle' | 'loading' | 'done' | 'error';

export interface Scene {
  id: string;
  description: string;
  imagePrompt: string;
  imageBase64: string | null;
  imageStatus: GenerationStatus;
}
