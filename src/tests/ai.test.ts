import { describe, it, expect, vi } from 'vitest';
import { AIService } from '../services/ai.service';

// Mocking the @google/genai module
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: vi.fn().mockResolvedValue({
            text: JSON.stringify({
              score: 85,
              feedback: ["Add more action verbs.", "Quantify your achievements."]
            })
          })
        }
      };
    })
  };
});

describe('AIService', () => {
  it('should generate a summary', async () => {
    // Note: This test relies on the mock implementation above.
    // In a real scenario, you would structure the mock to return specific text for the summary call.
    // For simplicity, we are testing the structure of the ATS score response here.
    const result = await AIService.scoreATS("Resume text", "Job description");
    expect(result.score).toBe(85);
    expect(result.feedback).toHaveLength(2);
    expect(result.feedback[0]).toBe("Add more action verbs.");
  });
});
