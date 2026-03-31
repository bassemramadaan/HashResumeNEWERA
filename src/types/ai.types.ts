export interface AIResponse {
  text: string;
  error?: string;
}

export interface IResumeService {
  generateContent(
    prompt: string,
    systemInstruction?: string,
  ): Promise<AIResponse>;
  matchResumeToJob(resume: string, jobDescription: string): Promise<AIResponse>;
}
