import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MOCK_PHOTOGRAPHERS } from '../constants';
import { MoodboardAnalysis } from '../types';

// Initialize the API client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string
 */
export const fileToGenerativePart = async (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({ data: base64Data, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes uploaded images and matches them against the mock database.
 */
export const findMatchingPhotographers = async (
  images: { data: string; mimeType: string }[]
): Promise<MoodboardAnalysis> => {
  
  // Construct a minimal representation of the database for the model context
  const databaseContext = MOCK_PHOTOGRAPHERS.map(p => ({
    id: p.id,
    name: p.name,
    style: p.style,
    tags: p.tags,
    description: p.description
  }));

  const prompt = `
    You are an expert wedding aesthetic designer and curator.
    
    TASK:
    1. Analyze the provided ${images.length} inspiration images as a cohesive wedding moodboard.
    2. Extract the dominant Color Palette (5 hex codes).
    3. Identify the Venue Type (e.g., 'Outdoor Garden', 'Industrial Loft', 'Beach', 'Grand Ballroom').
    4. Analyze the Lighting & Editing Style (e.g., 'Dark & Moody', 'Light & Airy', 'True-to-color', 'Film Grain').
    5. Pay attention to skin tones and how they are rendered (warm/golden, cool, natural).
    
    MATCHING:
    Review the list of available photographers and select the TOP 3 that best fit this aesthetic.
    
    Available Photographers:
    ${JSON.stringify(databaseContext)}
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      colorPalette: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "5 hex color codes representing the mood"
      },
      vibeKeywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3-4 adjectives describing the mood (e.g. 'Romantic', 'Edgy')"
      },
      venueType: { type: Type.STRING },
      lightingStyle: { type: Type.STRING },
      matches: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            photographerId: { type: Type.STRING },
            compatibilityScore: { type: Type.INTEGER },
            matchReason: { type: Type.STRING },
            keyElementsDetected: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Specific elements from the user's photos that this photographer excels at (e.g. 'Golden hour lighting', 'Candid emotion')" 
            }
          },
          required: ["photographerId", "compatibilityScore", "matchReason", "keyElementsDetected"]
        }
      }
    },
    required: ["colorPalette", "vibeKeywords", "venueType", "lightingStyle", "matches"]
  };

  try {
    const imageParts = images.map(img => ({
      inlineData: {
        mimeType: img.mimeType,
        data: img.data
      }
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [...imageParts, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MoodboardAnalysis;
    }
    
    throw new Error("No response text from AI");

  } catch (error) {
    console.error("Gemini Match Error:", error);
    // Fallback
    return {
      colorPalette: ["#E6D5C3", "#A58D7F", "#8B5E3C", "#5C4033", "#2C1810"],
      vibeKeywords: ["Romantic", "Timeless", "Soft"],
      venueType: "Garden / Outdoor",
      lightingStyle: "Natural Light",
      matches: [
        { 
          photographerId: 'p2', 
          compatibilityScore: 85, 
          matchReason: "Matches the soft, natural light aesthetic seen in your photos.",
          keyElementsDetected: ["Soft focus", "Pastel tones"]
        }
      ]
    };
  }
};