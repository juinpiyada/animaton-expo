import { GoogleGenAI, Type } from "@google/genai";
import { SCRIPT_MODEL, IMAGE_MODEL } from '../constants';

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  return apiKey;
};

// This function is defined outside the service calls to be reusable
const initializeGenAI = () => new GoogleGenAI({ apiKey: getApiKey() });

interface RawScene {
  description: string;
  imagePrompt: string;
}

export const generateScript = async (prompt: string): Promise<RawScene[]> => {
  const ai = initializeGenAI();
  const response = await ai.models.generateContent({
    model: SCRIPT_MODEL,
    contents: `Create a script for a short video based on this prompt: "${prompt}". The script should be divided into 5 scenes. For each scene, provide a detailed description of the visuals and action, and a concise image generation prompt that captures the essence of the scene.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "A detailed description of the scene's visuals and action."
            },
            imagePrompt: {
              type: Type.STRING,
              description: "A concise prompt for an AI image generator to create the scene's visual."
            }
          },
          required: ["description", "imagePrompt"]
        }
      }
    }
  });

  const jsonText = response.text.trim();
  try {
    const parsed = JSON.parse(jsonText);
    return parsed as RawScene[];
  } catch (e) {
    console.error("Failed to parse script JSON:", jsonText);
    throw new Error("The AI returned a script in an invalid format.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = initializeGenAI();
  const response = await ai.models.generateImages({
    model: IMAGE_MODEL,
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '16:9',
    },
  });

  if (!response.generatedImages || response.generatedImages.length === 0) {
    throw new Error("Image generation failed to produce an image.");
  }

  return response.generatedImages[0].image.imageBytes;
};
