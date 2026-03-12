import { ResumeData } from '../store/useResumeStore';

// Basic stop words to ignore in keyword matching
const STOP_WORDS = new Set([
  'the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 'so', 'if', 'out', 'not', 'we', 'my', 'by', 'from', 'an', 'will', 'can', 'about', 'which', 'your', 'all', 'has', 'one', 'more', 'do', 'their', 'there', 'what', 'who', 'when', 'where', 'why', 'how', 'any', 'some', 'such', 'into', 'up', 'down', 'over', 'under', 'between', 'through', 'during', 'before', 'after', 'above', 'below', 'off', 'again', 'further', 'then', 'once', 'here', 'both', 'each', 'few', 'most', 'other', 'no', 'nor', 'only', 'own', 'same', 'than', 'too', 'very', 's', 't', 'just', 'don', 'should', 'now'
]);

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
  const { personalInfo, experience, education, skills, projects, certifications, settings } = data;
  
  const sections: ATSResult['sections'] = [];
  
  // 1. Contact Info (10 points)
  const contact = { title: "Contact Info", score: 0, maxScore: 10, goodPoints: [], improvements: [] as string[] };
  if (personalInfo.fullName && personalInfo.fullName.trim().length > 2) contact.score += 3;
  else contact.improvements.push("Add your full name.");
  
  if (personalInfo.email && personalInfo.email.includes('@')) {
    contact.score += 3;
    contact.goodPoints.push("Email address is present.");
  } else contact.improvements.push("Add a professional email address.");

  if (personalInfo.phone) {
    contact.score += 2;
    contact.goodPoints.push("Phone number is present.");
  } else contact.improvements.push("Add your phone number.");
  
  if (personalInfo.linkedin) {
    contact.score += 2;
    contact.goodPoints.push("LinkedIn profile included.");
  } else contact.improvements.push("Add a LinkedIn URL for professional credibility.");
  sections.push(contact);

  // 2. Summary (10 points)
  const summary = { title: "Summary", score: 0, maxScore: 10, goodPoints: [], improvements: [] as string[] };
  if (personalInfo.summary && personalInfo.summary.length > 150) {
    summary.score += 10;
    summary.goodPoints.push("Detailed professional summary.");
  } else if (personalInfo.summary && personalInfo.summary.length > 50) {
    summary.score += 5;
    summary.improvements.push("Make your summary more impactful by adding specific achievements and years of experience.");
  } else {
    summary.improvements.push("Add a professional summary (3-4 sentences) to highlight your core value proposition.");
  }
  sections.push(summary);

  // 3. Experience Structure (10 points)
  const expStructure = { title: "Experience Structure", score: 0, maxScore: 10, goodPoints: [], improvements: [] as string[] };
  if (experience.length > 0) {
    expStructure.score += 5;
    expStructure.goodPoints.push("Work experience section is present.");
    
    let bulletCount = 0;
    let totalBullets = 0;
    
    experience.forEach(exp => {
      const bullets = exp.description.split('\n').filter(b => b.trim().length > 0);
      totalBullets += bullets.length;
      bullets.forEach(bullet => {
        const trimmed = bullet.trim();
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
          bulletCount++;
        }
      });
    });

    if (totalBullets > 0) {
      if (bulletCount / totalBullets > 0.8) {
        expStructure.score += 5;
        expStructure.goodPoints.push("Consistent use of standard bullet points.");
      } else {
        expStructure.improvements.push("Use standard bullet points (•, -, *) for all experience descriptions to ensure ATS readability.");
      }
    } else {
      expStructure.improvements.push("Add bullet points to describe your responsibilities and achievements.");
    }
  } else {
    expStructure.improvements.push("Add work experience or relevant internships.");
  }
  sections.push(expStructure);

  // 4. Bullet Point Quality (20 points)
  const bulletQuality = { title: "Bullet Point Quality", score: 0, maxScore: 20, goodPoints: [], improvements: [] as string[] };
  if (experience.length > 0) {
    let actionVerbCount = 0;
    let quantifiedCount = 0;
    let totalBullets = 0;
    
    experience.forEach(exp => {
      const bullets = exp.description.split('\n').filter(b => b.trim().length > 0);
      totalBullets += bullets.length;
      
      bullets.forEach(bullet => {
        const cleanBullet = bullet.trim().replace(/^[•*\s-]+/, '').trim().toLowerCase();
        const firstWord = cleanBullet.split(/\s+/)[0];
        if (ACTION_VERBS.has(firstWord)) actionVerbCount++;
        if (/[0-9]+%|\$[0-9]+|[0-9]+\+/.test(cleanBullet)) quantifiedCount++;
      });
    });

    if (totalBullets > 0) {
      const actionVerbRatio = actionVerbCount / totalBullets;
      if (actionVerbRatio > 0.7) {
        bulletQuality.score += 10;
        bulletQuality.goodPoints.push("Excellent use of action verbs.");
      } else if (actionVerbRatio > 0.4) {
        bulletQuality.score += 5;
        bulletQuality.improvements.push("Start more bullet points with strong action verbs.");
      } else {
        bulletQuality.improvements.push("Most bullet points should start with an action verb (e.g., 'Led', 'Developed').");
      }

      if (quantifiedCount >= 3) {
        bulletQuality.score += 10;
        bulletQuality.goodPoints.push("Strong use of metrics and data to quantify impact.");
      } else if (quantifiedCount > 0) {
        bulletQuality.score += 5;
        bulletQuality.improvements.push("Try to quantify more achievements with numbers, percentages, or dollar amounts.");
      } else {
        bulletQuality.improvements.push("Add numbers to your achievements (e.g., 'Increased efficiency by 15%', 'Managed $10k budget').");
      }
    }
  }
  sections.push(bulletQuality);

  // 5. Education (10 points)
  const edu = { title: "Education", score: 0, maxScore: 10, goodPoints: [], improvements: [] as string[] };
  if (education.length > 0) {
    edu.score += 10;
    edu.goodPoints.push("Education section is complete.");
  } else {
    edu.improvements.push("Add your educational background.");
  }
  sections.push(edu);

  // 6. Skills Section (15 points)
  const skillsSection = { title: "Skills Section", score: 0, maxScore: 15, goodPoints: [], improvements: [] as string[] };
  if (skills.length > 0) {
    if (skills.length >= 8) {
      skillsSection.score += 5;
      skillsSection.goodPoints.push("Good number of skills listed.");
    } else {
      skillsSection.improvements.push("Add more relevant skills (aim for 8-12).");
    }
    
    let softSkillCount = 0;
    skills.forEach(skill => {
      if (SOFT_SKILLS.has(skill.toLowerCase())) softSkillCount++;
    });

    const hardSkillCount = skills.length - softSkillCount;

    if (softSkillCount > 0 && hardSkillCount > 0) {
      skillsSection.score += 10;
      skillsSection.goodPoints.push("Balanced mix of technical and soft skills.");
    } else if (hardSkillCount === 0) {
      skillsSection.improvements.push("Add technical (hard) skills specific to your role.");
    } else {
      skillsSection.improvements.push("Add some soft skills (e.g., 'Leadership', 'Communication').");
    }
  } else {
    skillsSection.improvements.push("Add a skills section to highlight your expertise.");
  }
  sections.push(skillsSection);

  // 7. Projects (10 points)
  const projSection = { title: "Projects", score: 0, maxScore: 10, goodPoints: [], improvements: [] as string[] };
  if (projects.length > 0) {
    projSection.score += 10;
    projSection.goodPoints.push("Projects section included.");
  } else {
    projSection.improvements.push("Add projects to demonstrate practical application of your skills.");
  }
  sections.push(projSection);

  // 8. Certifications (5 points)
  const certSection = { title: "Certifications", score: 0, maxScore: 5, goodPoints: [], improvements: [] as string[] };
  if (certifications.length > 0) {
    certSection.score += 5;
    certSection.goodPoints.push("Certifications included.");
  } else {
    certSection.improvements.push("Add relevant certifications to boost credibility.");
  }
  sections.push(certSection);

  // 9. Formatting (10 points)
  const formatting = { title: "Formatting", score: 0, maxScore: 10, goodPoints: [], improvements: [] as string[] };
  if (settings.template === 'creative') {
    formatting.score += 5;
    formatting.improvements.push("Consider a more standard template like 'Modern' for better ATS parsing.");
  } else {
    formatting.score += 10;
    formatting.goodPoints.push("Clean, ATS-friendly template structure.");
  }
  sections.push(formatting);

  // 10. Job Match (Bonus/Context)
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
