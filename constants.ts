export const AppState = {
  IDLE: 'IDLE',
  GENERATING_SCRIPT: 'GENERATING_SCRIPT',
  SCRIPT_READY: 'SCRIPT_READY',
  GENERATING_IMAGES: 'GENERATING_IMAGES',
  IMAGES_READY: 'IMAGES_READY',
  ERROR: 'ERROR',
} as const;

export type AppStateValue = typeof AppState[keyof typeof AppState];

export const SCRIPT_MODEL = 'gemini-2.5-flash';
export const IMAGE_MODEL = 'imagen-3.0-generate-002';
