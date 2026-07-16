import { useMemo } from 'react';
import { getResumeSignature } from "../../store/useResumeStore";
import { calculateATSScore } from "../../utils/ats";
import { DEFAULT_BREAKDOWN } from "../../constants";
import { ResumeData } from "../../types/resume";
import { useLanguageStore } from "../../store/useLanguageStore";

export function useResumeValidation(data: ResumeData) {
  const { language } = useLanguageStore();

  const isPremium = useMemo(() => {
    if (!data.isPremium) return false;
    
    // Check if we have an unlocked signature stored. If we do, do a total data matching.
    if (data.unlockedSignature) {
      return getResumeSignature(data) === data.unlockedSignature;
    }
    
    // Fallback comparison for name & email
    const nameMatch = !data.unlockedName || 
      data.unlockedName.trim().toLowerCase() === (data.personalInfo.fullName || "").trim().toLowerCase();
    const emailMatch = !data.unlockedEmail || 
      data.unlockedEmail.trim().toLowerCase() === (data.personalInfo.email || "").trim().toLowerCase();
      
    return nameMatch && emailMatch;
  }, [data]);

  const isEmpty = 
    !data.personalInfo?.fullName && 
    !data.personalInfo?.email &&
    !data.personalInfo?.phone &&
    !data.personalInfo?.summary &&
    (!data.experience || data.experience.length === 0) && 
    (!data.education || data.education.length === 0) && 
    (!data.skills || data.skills.length === 0);

  const { score: atsScore } = useMemo(() => {
    if (isEmpty) return { score: 0, criticalFailures: [], tips: [] };
    try {
      return calculateATSScore(data, language);
    } catch (e) {
      console.error("ATS Audit failed", e);
      return { score: 0, criticalFailures: [], tips: [] };
    }
  }, [data, isEmpty, language]);

  const breakdown = useMemo(() => {
    return DEFAULT_BREAKDOWN.map((b, i) => {
      let done = false;
      if (i === 0) done = !!(data.personalInfo?.email && data.personalInfo?.phone);
      else if (i === 1) done = !!(data.personalInfo?.summary && data.personalInfo.summary.length > 20);
      else if (i === 2) done = !!(data.experience && data.experience.length > 0);
      else if (i === 3) done = !!(data.skills && data.skills.length >= 5);
      else if (i === 4) done = !!(data.education && data.education.length > 0);
      else if (i === 5) done = !!(data.skills && data.skills.length >= 5 && data.experience && data.experience.length > 0);
      return { ...b, done };
    });
  }, [data]);

  return { isPremium, isEmpty, atsScore, breakdown };
}
