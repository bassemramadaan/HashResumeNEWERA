import { useState, useMemo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { CheckCircle2, AlertCircle, Activity, Target, Briefcase, Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// Basic stop words to ignore in keyword matching
const STOP_WORDS = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 'so', 'if', 'out', 'not', 'we', 'my', 'by', 'from', 'an', 'will', 'can', 'about', 'which', 'your', 'all', 'has', 'one', 'more', 'do', 'their', 'there', 'what', 'who', 'when', 'where', 'why', 'how', 'any', 'some', 'such', 'into', 'up', 'down', 'over', 'under', 'between', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']);

export default function ATSAudit() {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills } = data;
  const [jobDescription, setJobDescription] = useState('');
  const [showMatcher, setShowMatcher] = useState(false);

  const isEmpty = !personalInfo.fullName && !personalInfo.email && experience.length === 0 && education.length === 0 && skills.length === 0;

  if (isEmpty) {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="text-indigo-500" size={24} />
            ATS Resume Audit
          </h2>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="text-slate-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Data to Analyze</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Please fill in your personal information, experience, education, and skills to get an ATS score and personalized suggestions.
          </p>
        </div>
      </div>
    );
  }

  let score = 0;
  const goodPoints: string[] = [];
  const improvements: string[] = [];

  // 1. Personal Info (20 points)
  if (personalInfo.fullName) {
    score += 5;
  } else {
    improvements.push("Add your full name to the personal info section.");
  }

  if (personalInfo.email && personalInfo.phone) {
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

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-indigo-500";
    if (s >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return "bg-indigo-500";
    if (s >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Job Description Matching Logic
  const matchResults = useMemo(() => {
    if (!jobDescription.trim()) return null;

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
  }, [jobDescription, personalInfo, experience, education, skills]);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Target className="text-indigo-500" size={24} />
          ATS Resume Audit
        </h2>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        
        {/* Score Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100">
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * score) / 100}
                className={cn("transition-all duration-1000 ease-out", getScoreColor(score))}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={cn("text-4xl font-black tracking-tighter", getScoreColor(score))}>
                {score}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {score >= 80 ? "Great Job! You're ATS Ready." : score >= 50 ? "Good start, but needs work." : "Needs significant improvements."}
            </h3>
            <p className="text-slate-600 leading-relaxed max-w-lg">
              Applicant Tracking Systems (ATS) scan resumes for keywords, formatting, and completeness. 
              Follow the suggestions below to improve your score and increase your chances of landing an interview.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Improvements */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              To Improve ({improvements.length})
            </h4>
            {improvements.length === 0 ? (
              <div className="p-4 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium border border-indigo-100">
                Perfect! No major improvements needed.
              </div>
            ) : (
              <ul className="space-y-3">
                {improvements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-red-50/50 rounded-xl border border-red-100">
                    <div className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Good Points */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="text-indigo-500" size={20} />
              Looking Good ({goodPoints.length})
            </h4>
            {goodPoints.length === 0 ? (
              <div className="p-4 bg-slate-50 text-slate-500 rounded-xl text-sm font-medium border border-slate-100">
                Fill out your resume to see what you're doing well.
              </div>
            ) : (
              <ul className="space-y-3">
                {goodPoints.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <CheckCircle2 className="shrink-0 text-indigo-500 mt-0.5" size={16} />
                    <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Job Description Matcher (FREE) */}
        <div className="mt-12 pt-10 border-t border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="text-indigo-500" size={24} />
              Job Description Matcher <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-2">Free</span>
            </h3>
            <button 
              onClick={() => setShowMatcher(!showMatcher)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors"
            >
              {showMatcher ? 'Hide Matcher' : 'Compare with JD'}
            </button>
          </div>

          {showMatcher && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Paste Job Description Here
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the requirements and responsibilities from the job posting..."
                  className="w-full h-40 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-sm"
                />
              </div>

              {matchResults && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Match Score</div>
                    <div className={cn(
                      "text-5xl font-black tracking-tighter mb-2",
                      matchResults.matchPercentage >= 70 ? "text-emerald-500" : matchResults.matchPercentage >= 40 ? "text-yellow-500" : "text-red-500"
                    )}>
                      {matchResults.matchPercentage}%
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Based on top 20 keywords
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="text-red-500" size={16} />
                        Missing Keywords ({matchResults.missing.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchResults.missing.length > 0 ? matchResults.missing.map(kw => (
                          <span key={kw} className="bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-full text-xs font-medium">
                            {kw}
                          </span>
                        )) : (
                          <span className="text-sm text-slate-500 italic">No missing keywords found!</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500" size={16} />
                        Matched Keywords ({matchResults.matched.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchResults.matched.length > 0 ? matchResults.matched.map(kw => (
                          <span key={kw} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-medium">
                            {kw}
                          </span>
                        )) : (
                          <span className="text-sm text-slate-500 italic">No matched keywords yet.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
