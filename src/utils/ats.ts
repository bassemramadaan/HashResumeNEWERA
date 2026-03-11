import { ResumeData } from '../store/useResumeStore';

// Basic stop words to ignore in keyword matching
const STOP_WORDS = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 'so', 'if', 'out', 'not', 'we', 'my', 'by', 'from', 'an', 'will', 'can', 'about', 'which', 'your', 'all', 'has', 'one', 'more', 'do', 'their', 'there', 'what', 'who', 'when', 'where', 'why', 'how', 'any', 'some', 'such', 'into', 'up', 'down', 'over', 'under', 'between', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']);

export interface ATSResult {
  score: number;
  goodPoints: string[];
  improvements: string[];
}

export function getJobMatchResults(data: ResumeData) {
  const { jobDescription, personalInfo, experience, education, skills } = data;
  if (!jobDescription || !jobDescription.trim()) return null;

  // Extract words from JD
  const jdWords = jobDescription.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  
  // Extract words from Resume
  const resumeText = [
    personalInfo.summary,
    ...experience.map(e => `${e.position} ${e.company} ${e.description}`),
    ...education.map(e => `${e.degree} ${e.institution} ${e.description}`),
    ...skills
  ].join(' ').toLowerCase().replace(/[^\w\s]/g, '');
  
  const resumeWords = new Set(resumeText.split(/\s+/));

  // Calculate frequencies in JD to find important keywords
  const wordFreq: Record<string, number> = {};
  jdWords.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });

  // Sort by frequency to get top keywords
  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(entry => entry[0]);

  const matched = topKeywords.filter(kw => resumeWords.has(kw));
  const missing = topKeywords.filter(kw => !resumeWords.has(kw));
  
  const matchPercentage = topKeywords.length > 0 ? Math.round((matched.length / topKeywords.length) * 100) : 0;

  return { matchPercentage, matched, missing };
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

  // 6. Formatting & Structure (New Checks)
  if (data.settings.template === 'creative' || data.settings.template === 'medical') {
    improvements.push("Your current template has many graphics. Consider using 'Modern' or 'Classic' for maximum ATS compatibility.");
  } else {
    goodPoints.push("Template structure is clean and ATS-friendly.");
  }

  if (experience.length > 0 && !experience.some(e => e.position.toLowerCase().includes('engineer') || e.position.toLowerCase().includes('manager') || e.position.toLowerCase().includes('designer') || e.position.toLowerCase().includes('developer'))) {
    improvements.push("Ensure your job titles are clear and standard (e.g., 'Software Engineer' instead of 'Code Ninja').");
  }

  if (score < 100 && !data.jobDescription) {
    improvements.push("Paste a Job Description in the Audit tab to check for missing keywords.");
  } else if (data.jobDescription) {
    const matchResults = getJobMatchResults(data);
    if (matchResults && matchResults.missing.length > 0) {
      improvements.push(`Consider adding these missing keywords from the job description: ${matchResults.missing.slice(0, 5).join(', ')}`);
    } else if (matchResults && matchResults.missing.length === 0) {
      goodPoints.push("Your resume contains all the top keywords from the job description.");
    }
  }

  return { score: Math.min(100, score), goodPoints, improvements };
}
