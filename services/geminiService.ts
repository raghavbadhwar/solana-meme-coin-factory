
import { GoogleGenAI, Type } from "@google/genai";
import type { MemeCoinDetails } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const coinDetailsSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "A creative, funny, and catchy name for the meme coin. Max 30 characters.",
    },
    ticker: {
      type: Type.STRING,
      description: "A short, 3-5 character uppercase ticker symbol for the coin (e.g., DOGE, SHIB).",
    },
    description: {
      type: Type.STRING,
      description: "A brief, humorous, and engaging description for the meme coin, suitable for a website or social media. Max 150 characters.",
    },
    imagePrompt: {
        type: Type.STRING,
        description: "A simple but visually striking DALL-E or Midjourney style prompt to generate a logo/mascot for this coin. Focus on a central character or concept. Example: 'A cute cartoon Shiba Inu dog wearing sunglasses, vibrant colors, minimalist logo'."
    }
  },
  required: ["name", "ticker", "description", "imagePrompt"],
};


export const generateMemeCoinDetails = async (prompt: string): Promise<MemeCoinDetails> => {
  const model = "gemini-2.5-flash";
  
  const fullPrompt = `Based on the user's idea: "${prompt}", generate a unique and viral meme coin concept for the Solana blockchain. Fulfill all properties of the requested JSON schema. The ticker must be uppercase.`;

  const response = await ai.models.generateContent({
    model,
    contents: fullPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: coinDetailsSchema,
    },
  });

  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as MemeCoinDetails;
  } catch (e) {
    console.error("Failed to parse Gemini JSON response:", jsonText);
    throw new Error("Received an invalid format from the AI. Please try again.");
  }
};

export const generateMemeCoinImage = async (prompt: string): Promise<string> => {
    const model = 'imagen-4.0-generate-001';

    const response = await ai.models.generateImages({
        model,
        prompt: `${prompt}, sticker, high quality, white background`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }

    throw new Error("Image generation failed to produce an image.");
};
