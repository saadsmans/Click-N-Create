import { GoogleGenAI } from '@google/genai';

/**
 * Server-Side Gemini API Client Utility
 * Configured according to the official @google/genai SDK guidelines.
 */
export const getGeminiClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};
