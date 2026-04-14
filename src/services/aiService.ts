import { AIResponse, IResumeService } from "../types/ai.types";

/**
 * Centralized AI Service for Gemini API calls via Express Backend
 */
export const aiService: IResumeService = {
  /**
   * Generates content using the backend API
   */
  generateContent: async (
    prompt: string,
    systemInstruction?: string,
  ): Promise<AIResponse> => {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          systemInstruction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content");
      }

      if (!data.text) {
        throw new Error("Empty response from AI");
      }

      return { text: data.text };
    } catch (err: unknown) {
      console.error("AI Generation failed:", err);
      return {
        text: "",
        error:
          err instanceof Error
            ? err.message
            : "Failed to generate content. Please try again later.",
      };
    }
  },
  matchResumeToJob: async (
    resume: string,
    jobDescription: string,
  ): Promise<AIResponse> => {
    try {
      const systemInstruction = `You are an expert ATS (Applicant Tracking System) analyzer. 
 Analyze the provided resume against the job description.
 Return a JSON object with:
 - score: number (0-100)
 - missingKeywords: string[]
 - suggestions: string[]
 - seniorityFit: string
`;

      const prompt = `Resume: ${resume}\n\nJob Description: ${jobDescription}`;

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          systemInstruction,
          responseMimeType: "application/json",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      if (!data.text) {
        throw new Error("Empty response from AI");
      }

      return { text: data.text };
    } catch (err: unknown) {
      console.error("ATS Matching failed:", err);
      return {
        text: "",
        error:
          err instanceof Error
            ? err.message
            : "Failed to analyze resume. Please try again later.",
      };
    }
  },
};
