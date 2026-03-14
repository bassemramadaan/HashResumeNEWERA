import { resumeSchema, ResumeData } from '../schemas/resume.schema';

const STORAGE_KEY = 'hash_resume_data';

export const StorageService = {
  /**
   * Saves resume data to local storage.
   * @param data The resume data to save.
   */
  saveResume(data: ResumeData): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serializedData);
    } catch (error) {
      console.error("Error saving resume data to local storage:", error);
    }
  },

  /**
   * Loads resume data from local storage.
   * @returns The parsed resume data, or null if not found or invalid.
   */
  loadResume(): ResumeData | null {
    try {
      const serializedData = localStorage.getItem(STORAGE_KEY);
      if (serializedData) {
        const parsedData = JSON.parse(serializedData);
        const result = resumeSchema.safeParse(parsedData);
        if (result.success) {
          return result.data;
        } else {
          console.error("Invalid resume data in local storage:", result.error);
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error("Error loading resume data from local storage:", error);
      return null;
    }
  },

  /**
   * Clears the saved resume data from local storage.
   */
  clearResume(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing resume data from local storage:", error);
    }
  }
};
