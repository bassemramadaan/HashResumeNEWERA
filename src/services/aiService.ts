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
      const requestBody: any = {
        contents: [{ parts: [{ text: prompt }] }],
      };
      
      if (systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to generate content");
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Empty response from AI");
      }

      return { text };
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
  importResume: async (
    rawText: string,
  ): Promise<AIResponse> => {
    try {
      const systemInstruction = `You are an expert resume parser.
 Extract the following information from the provided text into a strict JSON matching this structure:
 {
   "personalInfo": {
     "fullName": "...",
     "jobTitle": "...",
     "email": "...",
     "phone": "...",
     "address": "...",
     "linkedin": "...",
     "github": "...",
     "portfolio": "...",
     "summary": "..."
   },
   "experience": [
     {
       "id": "...",
       "company": "...",
       "position": "...",
       "startDate": "...",
       "endDate": "...",
       "description": "..."
     }
   ],
   "education": [
     {
       "id": "...",
       "institution": "...",
       "degree": "...",
       "field": "...",
       "startDate": "...",
       "endDate": "..."
     }
   ],
   "skills": ["...", "..."],
   "certifications": [
     {
       "id": "...",
       "name": "...",
       "issuer": "...",
       "date": "..."
     }
   ]
 }
 Ensure that the response is pure JSON without markdown codeblocks or other text.`;

      const prompt = `Parse this resume text:\n\n${rawText}`;

      const requestBody: any = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { responseMimeType: "application/json" }
      };

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to parse resume");
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Empty response from AI");
      }

      return { text };
    } catch (err: unknown) {
      console.error("Resume parsing failed:", err);
      return {
        text: "",
        error:
          err instanceof Error
            ? err.message
            : "Failed to parse resume. Please try again later.",
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

      const requestBody: any = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { responseMimeType: "application/json" }
      };

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to analyze resume");
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Empty response from AI");
      }

      return { text };
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
