import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Cleans a base64 data string to remove the header (e.g., "data:image/png;base64,")
 */
const cleanBase64 = (dataUrl: string): string => {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return matches[2]; // Return the raw base64 data
  }
  return dataUrl; // Fallback if already raw or format unknown
};

export const generateTryOnImage = async (
  personBase64: string,
  clothingBase64: string,
  personMime: string,
  clothingMime: string
): Promise<string> => {
  const ai = getClient();
  
  // Using gemini-2.5-flash-image for efficient image generation/editing
  const modelId = 'gemini-2.5-flash-image';

  const personData = cleanBase64(personBase64);
  const clothingData = cleanBase64(clothingBase64);

  const prompt = `
    Perform a high-quality virtual try-on.
    Image 1: The target person.
    Image 2: The clothing item to be worn.

    Task: Generate a photorealistic image of the person from Image 1 wearing the clothing from Image 2.
    
    Requirements:
    1. Identity Preservation: The person's face, hair, body shape, skin tone, and pose MUST remain exactly the same as in Image 1.
    2. Clothing Fit: The clothing from Image 2 must be naturally fitted to the person's body, respecting fabric physics, folds, and draping.
    3. Lighting & Integration: Match the lighting, shadows, and color tone of the clothing to the person's environment.
    4. Background: Keep the original background from Image 1.
    5. Output: Return ONLY the generated image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: personMime,
              data: personData,
            },
          },
          {
            inlineData: {
              mimeType: clothingMime,
              data: clothingData,
            },
          },
        ],
      },
      // Note: Flash Image model configuration is minimal; strict prompting is key.
    });

    // Parse response for the image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image");
  }
};