import { ResumeData } from '../store/useResumeStore';

export interface ATSResult {
  score: number;
  goodPoints: string[];
  improvements: string[];
}

export function calculateATSScore(data: ResumeData): ATSResult {
  const { personalInfo, experience, education, skills } = data;
  
  // Return 0 if completely empty
  const isEmpty = !personalInfo.fullName && !personalInfo.email && experience.length === 0 && education.length === 0 && skills.length === 0;
  if (isEmpty) {
    return { score: 0, goodPoints: [], improvements: [] };
  }

  let score = 0;
  const goodPoints: string[] = [];
  const improvements: string[] = [];

  // 1. Personal Info (20 points)
  if (personalInfo.fullName && personalInfo.fullName.trim().length > 2) {
    score += 5;
  } else {
    improvements.push("Add your full name to the personal info section.");
  }

  if (personalInfo.email && personalInfo.phone && personalInfo.email.includes('@')) {
    score += 10;
    goodPoints.push("Contact information is complete.");
  } else {
    improvements.push("Add both email and phone number for recruiters to reach you.");
  }

  if (personalInfo.linkedin) {
    score += 5;
    goodPoints.push("LinkedIn profile is included.");
  } else {
    improvements.push("Add a LinkedIn profile URL to boost credibility.");
  }

  // 2. Summary (10 points)
  if (personalInfo.summary && personalInfo.summary.length > 50) {
    score += 10;
    goodPoints.push("Professional summary is detailed and impactful.");
  } else if (personalInfo.summary) {
    score += 5;
    improvements.push("Expand your professional summary to highlight your top achievements (aim for 3-4 sentences).");
  } else {
    improvements.push("Add a professional summary to introduce yourself and your career goals.");
  }

  // 3. Experience (40 points)
  if (experience.length > 0) {
    score += 20;
    let hasBulletPoints = false;
    let hasGoodLength = true;

    experience.forEach(exp => {
      if (exp.description.includes('•') || exp.description.includes('-')) hasBulletPoints = true;
      if (exp.description.length < 50) hasGoodLength = false;
    });

    if (hasBulletPoints) {
      score += 10;
      goodPoints.push("Experience descriptions use bullet points (highly ATS friendly).");
    } else {
      improvements.push("Use bullet points (•) in your experience descriptions for better readability and ATS parsing.");
    }

    if (hasGoodLength) {
      score += 10;
      goodPoints.push("Experience descriptions have good detail and length.");
    } else {
      improvements.push("Add more details to your work experience descriptions. Include metrics and achievements.");
    }
  } else {
    improvements.push("Add your work experience. If you're a fresh graduate, add internships, volunteer work, or relevant projects.");
  }

  // 4. Education (15 points)
  if (education.length > 0) {
    score += 15;
    goodPoints.push("Educational background is included.");
  } else {
    improvements.push("Add your educational background (Degrees, University, etc.).");
  }

  // 5. Skills (15 points)
  if (skills.length >= 5) {
    score += 15;
    goodPoints.push("Strong list of core skills (5+).");
  } else if (skills.length > 0) {
    score += 5;
    improvements.push("Add more skills. Aim for at least 5-8 relevant hard and soft skills.");
  } else {
    improvements.push("Add a list of core skills relevant to your target job.");
  }

  return { score, goodPoints, improvements };
}
