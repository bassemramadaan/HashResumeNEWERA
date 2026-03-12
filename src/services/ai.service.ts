import { GoogleGenAI } from '@google/genai';

// Initialize the AI client.
// NOTE: In a production environment, this should ideally be called from a secure backend endpoint
// to prevent exposing the GEMINI_API_KEY to the client. For this prototype/applet, we use the injected env var.
const getAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const AIService = {
  /**
   * Generates a professional summary based on the user's role and experience.
   */
  async generateSummary(role: string, experienceLevel: string): Promise<string> {
    const ai = getAIClient();
    if (!ai) return "AI service is currently unavailable.";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Write a professional resume summary for a ${experienceLevel} ${role}. Keep it concise, impactful, and around 3-4 sentences. Focus on achievements and skills.`,
      });
      return response.text || "";
    } catch (error) {
      console.error("Error generating summary:", error);
      throw new Error("Failed to generate summary.", { cause: error });
    }
  },

  /**
   * Analyzes the resume against a job description and provides an ATS score.
   */
  async scoreATS(resumeText: string, jobDescription: string): Promise<{ score: number; feedback: string[] }> {
    const ai = getAIClient();
    if (!ai) return { score: 0, feedback: ["AI service unavailable."] };

    try {
      const prompt = `
        Act as an expert ATS (Applicant Tracking System).
        Analyze the following resume against the provided job description.
        Return a JSON object with exactly two properties:
        1. "score": A number from 0 to 100 representing the match percentage.
        2. "feedback": An array of strings containing specific, actionable advice to improve the resume for this job.

        Resume:
        ${resumeText}

        Job Description:
        ${jobDescription}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const result = JSON.parse(response.text || "{}");
      return {
        score: result.score || 0,
        feedback: result.feedback || [],
      };
    } catch (error) {
      console.error("Error scoring ATS:", error);
      throw new Error("Failed to score ATS.", { cause: error });
    }
  }
};
