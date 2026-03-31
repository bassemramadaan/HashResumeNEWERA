import { describe, it, expect, beforeEach } from "vitest";
import { StorageService } from "../services/storage.service";

describe("StorageService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should save and load resume data", () => {
    const resumeData = {
      personalInfo: {
        fullName: "Jane Doe",
        email: "jane@example.com",
      },
      summary: "A summary",
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
    };

    StorageService.saveResume(resumeData);
    const loadedData = StorageService.loadResume();

    expect(loadedData).toEqual(resumeData);
  });

  it("should clear resume data", () => {
    const resumeData = {
      personalInfo: {
        fullName: "Jane Doe",
        email: "jane@example.com",
      },
      summary: "A summary",
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
    };

    StorageService.saveResume(resumeData);
    StorageService.clearResume();
    const loadedData = StorageService.loadResume();

    expect(loadedData).toBeNull();
  });
});
