import { ResumeData } from '../store/useResumeStore';

// Basic stop words to ignore in keyword matching
const STOP_WORDS = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 'so', 'if', 'out', 'not', 'we', 'my', 'by', 'from', 'an', 'will', 'can', 'about', 'which', 'your', 'all', 'has', 'one', 'more', 'do', 'their', 'there', 'what', 'who', 'when', 'where', 'why', 'how', 'any', 'some', 'such', 'into', 'up', 'down', 'over', 'under', 'between', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']);

export interface ATSResult {
  score: number;
  sections: {
    title: string;
    score: number;
    maxScore: number;
    goodPoints: string[];
    improvements: string[];
  }[];
}

const ACTION_VERBS = new Set([
  'led', 'managed', 'developed', 'increased', 'decreased', 'created', 'designed', 
  'implemented', 'coordinated', 'negotiated', 'presented', 'researched', 'analyzed',
  'built', 'coded', 'launched', 'mentored', 'trained', 'optimized', 'streamlined',
  'achieved', 'accelerated', 'delivered', 'generated', 'improved', 'pioneered',
  'transformed', 'won', 'executed', 'formulated', 'initiated'
]);

const SOFT_SKILLS = new Set([
  'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
  'adaptability', 'time management', 'collaboration', 'interpersonal', 'creativity',
  'emotional intelligence', 'work ethic', 'attention to detail', 'organization'
]);

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
  const { personalInfo, experience, education, skills, settings } = data;
  
  const sections: ATSResult['sections'] = [];
  
  // 1. Contact Info (15 points)
  const contact = { title: "Contact Info", score: 0, maxScore: 15, goodPoints: [], improvements: [] as string[] };
  if (personalInfo.fullName && personalInfo.fullName.trim().length > 2) contact.score += 5;
  else contact.improvements.push("Add your full name.");
  
  if (personalInfo.email && personalInfo.email.includes('@') && personalInfo.phone) {
    contact.score += 5;
    contact.goodPoints.push("Email and phone number are present.");
  } else contact.improvements.push("Add both email and phone number.");
  
  if (personalInfo.linkedin) {
    contact.score += 5;
    contact.goodPoints.push("LinkedIn profile included.");
  } else contact.improvements.push("Add a LinkedIn URL for credibility.");
  sections.push(contact);

  // 2. Summary (10 points)
  const summary = { title: "Summary", score: 0, maxScore: 10, goodPoints: [], improvements: [] as string[] };
  if (personalInfo.summary && personalInfo.summary.length > 150) {
    summary.score += 10;
    summary.goodPoints.push("Detailed professional summary.");
  } else if (personalInfo.summary && personalInfo.summary.length > 50) {
    summary.score += 5;
    summary.improvements.push("Make your summary more impactful by adding specific achievements.");
  } else {
    summary.improvements.push("Add a professional summary (3-4 sentences) to highlight your value.");
  }
  sections.push(summary);

  // 3. Experience (40 points) - Granular Analysis
  const expSection = { title: "Experience", score: 0, maxScore: 40, goodPoints: [], improvements: [] as string[] };
  if (experience.length > 0) {
    expSection.score += 10; // Base score for having experience
    
    let actionVerbCount = 0;
    let quantifiedCount = 0;
    let bulletCount = 0;
    let totalBullets = 0;
    
    experience.forEach(exp => {
      const bullets = exp.description.split('\n').filter(b => b.trim().length > 0);
      totalBullets += bullets.length;
      
      bullets.forEach(bullet => {
        const cleanBullet = bullet.replace(/^[•*\s-]+/, '').trim().toLowerCase();
        const firstWord = cleanBullet.split(/\s+/)[0];
        
        if (ACTION_VERBS.has(firstWord)) actionVerbCount++;
        if (/[0-9]+%|\$[0-9]+|[0-9]+\+/.test(cleanBullet)) quantifiedCount++;
        if (bullet.includes('•') || bullet.includes('-')) bulletCount++;
      });
    });

    if (totalBullets > 0) {
      // Action Verbs Check
      if (actionVerbCount / totalBullets > 0.7) {
        expSection.score += 10;
        expSection.goodPoints.push("Strong use of action verbs to start bullet points.");
      } else {
        expSection.improvements.push("Start more bullet points with strong action verbs (e.g., 'Developed', 'Managed', 'Increased').");
      }

      // Quantification Check
      if (quantifiedCount > 0) {
        expSection.score += 10;
        expSection.goodPoints.push("Good use of numbers and metrics to quantify achievements.");
      } else {
        expSection.improvements.push("Add quantifiable results to your experience (e.g., 'Increased sales by 20%', 'Managed a team of 5').");
      }

      // Formatting Check
      if (bulletCount / totalBullets > 0.8) {
        expSection.score += 10;
        expSection.goodPoints.push("Consistent use of bullet points for readability.");
      } else {
        expSection.improvements.push("Use standard bullet points (•) for all experience descriptions.");
      }
    }
  } else {
    expSection.improvements.push("Add work experience, internships, or projects.");
  }
  sections.push(expSection);

  // 4. Education (10 points)
  const edu = { title: "Education", score: 0, maxScore: 10, goodPoints: [], improvements: [] as string[] };
  if (education.length > 0) {
    edu.score += 10;
    edu.goodPoints.push("Education section is complete.");
  } else {
    edu.improvements.push("Add your educational background.");
  }
  sections.push(edu);

  // 5. Skills (15 points) - Granular Analysis
  const skillsSection = { title: "Skills", score: 0, maxScore: 15, goodPoints: [], improvements: [] as string[] };
  if (skills.length >= 5) {
    skillsSection.score += 5;
    
    let softSkillCount = 0;
    skills.forEach(skill => {
      if (SOFT_SKILLS.has(skill.toLowerCase())) softSkillCount++;
    });

    if (softSkillCount > 0 && softSkillCount < skills.length) {
      skillsSection.score += 10;
      skillsSection.goodPoints.push("Balanced mix of hard and soft skills.");
    } else if (softSkillCount === 0) {
      skillsSection.score += 5;
      skillsSection.improvements.push("Add some interpersonal (soft) skills like 'Leadership' or 'Communication'.");
    } else {
      skillsSection.score += 5;
      skillsSection.improvements.push("Add more technical (hard) skills specific to your industry.");
    }
  } else {
    skillsSection.improvements.push("Add at least 8-10 relevant skills.");
  }
  sections.push(skillsSection);

  // 6. Formatting (10 points)
  const formatting = { title: "Formatting", score: 0, maxScore: 10, goodPoints: [], improvements: [] as string[] };
  if (settings.template === 'creative') {
    formatting.improvements.push("Consider a more standard template like 'Modern' for better ATS parsing.");
  } else {
    formatting.score += 10;
    formatting.goodPoints.push("Clean, ATS-friendly template structure.");
  }
  sections.push(formatting);

  // 7. Job Match (Bonus/Context)
  if (data.jobDescription) {
    const jobMatch = { title: "Job Match", score: 0, maxScore: 0, goodPoints: [], improvements: [] as string[] };
    const matchResults = getJobMatchResults(data);
    if (matchResults) {
      if (matchResults.missing.length > 0) {
        jobMatch.improvements.push(`Missing keywords: ${matchResults.missing.slice(0, 5).join(', ')}`);
      } else {
        jobMatch.goodPoints.push("All top keywords from JD are present.");
      }
      sections.push(jobMatch);
    }
  }

  // Calculate overall score
  const totalScore = sections.reduce((acc, s) => acc + s.score, 0);

  return { 
    score: Math.min(100, totalScore), 
    sections
  };
}
