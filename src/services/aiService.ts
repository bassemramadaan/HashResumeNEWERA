import { AIResponse, IResumeService } from '../types/ai.types';

/**
 * Centralized AI Service for Gemini API calls
 */
export const aiService: IResumeService = {
  /**
   * Generates content using backend API
   */
  generateContent: async (prompt: string, systemInstruction?: string): Promise<AIResponse> => {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      
      const data = await response.json();
      return { text: data.text };
    } catch (err: unknown) {
      console.error('AI Generation failed:', err);
      return { 
        text: '', 
        error: 'Failed to generate content. Please try again later.' 
      };
    }
  }
};
