import { ResumeData } from "../store/useResumeStore";

/**
 * Checks if a string contains Arabic characters.
 */
export function hasArabicCharacters(text: string): boolean {
  if (!text) return false;
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
}

/**
 * Automatically detects whether a resume's primary content is in Arabic.
 * This is used for automatic RTL layout switching.
 */
export function detectIsArabic(data: ResumeData): boolean {
  if (!data) return false;

  // 1. Check if user explicitly set language to Arabic in settings
  if (data.settings?.language === "ar") {
    return true;
  }
  
  // 2. If settings.language is not explicitly "ar", let's auto-detect from content.
  // We'll check the most prominent text fields: fullName, summary, jobTitle, or experience descriptions.
  const fieldsToTest = [
    data.personalInfo?.fullName || "",
    data.personalInfo?.jobTitle || "",
    data.personalInfo?.summary || "",
  ];

  // Add the first couple of experience descriptions if available
  if (data.experience && data.experience.length > 0) {
    fieldsToTest.push(data.experience[0].position || "");
    fieldsToTest.push(data.experience[0].company || "");
    fieldsToTest.push(data.experience[0].description || "");
  }

  // Count fields with Arabic characters vs total non-empty fields
  let arabicCount = 0;
  let totalCount = 0;

  for (const text of fieldsToTest) {
    if (text.trim().length > 0) {
      totalCount++;
      if (hasArabicCharacters(text)) {
        arabicCount++;
      }
    }
  }

  // If there are Arabic characters in any prominent field, let's trigger RTL.
  // Typically, if fullName or summary has Arabic, it's an Arabic resume.
  if (hasArabicCharacters(data.personalInfo?.fullName || "") || hasArabicCharacters(data.personalInfo?.summary || "")) {
    return true;
  }

  return arabicCount > 0 && (arabicCount / totalCount) >= 0.4;
}
