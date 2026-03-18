import { GoogleGenAI } from "@google/genai";
import { AIResponse, IResumeService } from '../types/ai.types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Centralized AI Service for Gemini API calls
 */
export const aiService: IResumeService = {
  /**
   * Generates content using Google Gemini API directly
   */
  generateContent: async (prompt: string, systemInstruction?: string): Promise<AIResponse> => {
    try {
      if (!apiKey) {
        throw new Error('Gemini API key is not configured');
      }

      const genAI = new GoogleGenAI({ apiKey });
      const model = genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        },
      });
      
      const response = await model;
      const text = response.text;
      
      if (!text) {
        throw new Error('Empty response from Gemini');
      }
      
      return { text };
    } catch (err: unknown) {
      console.error('AI Generation failed:', err);
      return { 
        text: '', 
        error: err instanceof Error ? err.message : 'Failed to generate content. Please try again later.' 
      };
    }
  }
};
