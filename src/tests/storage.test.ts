import { describe, it, expect, beforeEach } from "vitest";
import { StorageService } from "../services/storage.service";
import { ResumeData } from "../schemas/resume.schema";

describe("StorageService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const validResumeData: ResumeData = {
    personalInfo: {
      fullName: "Jane Doe",
      jobTitle: "Software Engineer",
      email: "jane@example.com",
      phone: "+1234567890",
      summary: "A summary",
    },
    coverLetter: {},
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    customSections: [],
    settings: {
      template: "modern",
      language: "en",
      fontSize: "medium",
      colorScheme: "#475569",
    },
  };

  it("should save and load resume data", () => {
    StorageService.saveResume(validResumeData);
    const loadedData = StorageService.loadResume();

    expect(loadedData).toEqual(validResumeData);
  });

  it("should clear resume data", () => {
    StorageService.saveResume(validResumeData);
    StorageService.clearResume();
    const loadedData = StorageService.loadResume();

    expect(loadedData).toBeNull();
  });
});
