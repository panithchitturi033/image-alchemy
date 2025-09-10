
export enum View {
  CREATION = 'CREATION',
  EDITING = 'EDITING',
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT_3_4 = '3:4',
  LANDSCAPE_4_3 = '4:3',
  PORTRAIT_9_16 = '9:16',
  LANDSCAPE_16_9 = '16:9',
}

export interface GenerateImageData {
  prompt: string;
  negativePrompt: string;
  aspectRatio: AspectRatio;
}

export interface EditImageData {
    base64: string;
    mimeType: string;
}
