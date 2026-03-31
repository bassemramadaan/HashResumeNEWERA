import { describe, it, expect } from "vitest";
import { calculateATSScore } from "./ats";
import { ResumeData } from "../store/useResumeStore";

describe("calculateATSScore", () => {
  const mockData: ResumeData = {
    personalInfo: {
      fullName: "John Doe",
      jobTitle: "Software Engineer",
      email: "john@example.com",
      phone: "123456789",
      address: "NY",
      linkedin: "linkedin.com/in/johndoe",
      github: "",
      portfolio: "",
      summary: "Experienced software engineer with a focus on React.",
    },
    coverLetter: {
      fullName: "",
      jobTitle: "",
      companyName: "",
      hiringManager: "",
      jobDescription: "",
      skills: "",
      generatedContent: "",
    },
    experience: [
      {
        id: "1",
        company: "Tech Corp",
        position: "Senior Engineer",
        startDate: "2020-01",
        endDate: "Present",
        description: "Led a team of developers to build a scalable platform.",
      },
    ],
    education: [
      {
        id: "1",
        institution: "University",
        degree: "CS Degree",
        startDate: "2016",
        endDate: "2020",
        description: "",
      },
    ],
    skills: ["React", "TypeScript", "Node.js"],
    projects: [],
    certifications: [],
    settings: {
      template: "modern",
      themeColor: "#000",
      language: "en",
      isFreshGrad: false,
    },
    jobDescription: "",
    isPremium: false,
  };

  it("should calculate a score above 0 for valid data", () => {
    const result = calculateATSScore(mockData);
    expect(result.score).toBeGreaterThan(0);
    expect(result.sections.some((s) => s.goodPoints.length > 0)).toBe(true);
  });

  it("should penalize for missing summary", () => {
    const dataWithoutSummary = {
      ...mockData,
      personalInfo: { ...mockData.personalInfo, summary: "" },
    };
    const result = calculateATSScore(dataWithoutSummary);
    const hasImprovement = result.sections.some((s) =>
      s.improvements.some((imp) => imp.includes("Add a professional summary")),
    );
    expect(hasImprovement).toBe(true);
  });
});
