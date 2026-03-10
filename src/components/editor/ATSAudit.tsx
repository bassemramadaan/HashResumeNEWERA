import { useState, useMemo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { CheckCircle2, AlertCircle, Activity, Target, Briefcase, Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { calculateATSScore } from '../../lib/ats';

// Basic stop words to ignore in keyword matching
const STOP_WORDS = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 'so', 'if', 'out', 'not', 'we', 'my', 'by', 'from', 'an', 'will', 'can', 'about', 'which', 'your', 'all', 'has', 'one', 'more', 'do', 'their', 'there', 'what', 'who', 'when', 'where', 'why', 'how', 'any', 'some', 'such', 'into', 'up', 'down', 'over', 'under', 'between', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']);

export default function ATSAudit() {
  const { data, updateJobDescription } = useResumeStore();
  const { personalInfo, experience, education, skills, jobDescription } = data;
  const [showMatcher, setShowMatcher] = useState(!!jobDescription);

  const { score, goodPoints, improvements } = calculateATSScore(data);
  const isEmpty = score === 0 && !personalInfo.fullName; // Simple check, or reuse logic from lib if exported

  const matchResults = useMemo(() => {
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
  }, [jobDescription, personalInfo, experience, education, skills]);

  if (isEmpty) {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="text-indigo-500 dark:text-indigo-400" size={24} />
            ATS Resume Audit
          </h2>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center transition-colors">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ring-1 ring-slate-900/5 dark:ring-slate-100/10">
            <Activity className="text-slate-400 dark:text-slate-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Data to Analyze</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Please fill in your personal information, experience, education, and skills to get an ATS score and personalized suggestions.
          </p>
        </div>
      </div>
    );
  }

  // Score calculation is now handled by calculateATSScore hook imported above
  
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-indigo-500 dark:text-indigo-400";
    if (s >= 50) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return "bg-indigo-500 dark:bg-indigo-400";
    if (s >= 50) return "bg-yellow-500 dark:bg-yellow-400";
    return "bg-red-500 dark:bg-red-400";
  };

  // Job Description Matching Logic
  // matchResults is calculated above to respect Rules of Hooks

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="text-indigo-500 dark:text-indigo-400" size={24} />
          ATS Resume Audit
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        
        {/* Score Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800">
          <div className="relative flex items-center justify-center shrink-0 w-40 h-40">
            <svg className="w-40 h-40 transform -rotate-90 absolute inset-0">
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className="text-indigo-600 dark:text-indigo-400" stopColor="currentColor" />
                  <stop offset="100%" className="text-cyan-600 dark:text-cyan-400" stopColor="currentColor" />
                </linearGradient>
              </defs>
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100 dark:text-slate-800 transition-colors"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={score >= 80 ? "url(#score-gradient)" : "currentColor"}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * score) / 100}
                className={cn("transition-all duration-1000 ease-out", score < 80 ? getScoreColor(score) : "")}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn(
                "text-5xl font-black tracking-tighter", 
                score >= 80 ? "bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent" : getScoreColor(score)
              )}>
                {score}
              </span>
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">/ 100</span>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {score >= 80 ? "Great Job! You're ATS Ready." : score >= 50 ? "Good start, but needs work." : "Needs significant improvements."}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              Applicant Tracking Systems (ATS) scan resumes for keywords, formatting, and completeness. 
              Follow the suggestions below to improve your score and increase your chances of landing an interview.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Improvements */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="text-red-500 dark:text-red-400" size={20} />
              To Improve ({improvements.length})
            </h4>
            {improvements.length === 0 ? (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-medium border border-indigo-100 dark:border-indigo-800/50 transition-colors">
                Perfect! No major improvements needed.
              </div>
            ) : (
              <ul className="space-y-3">
                {improvements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-red-50/50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/50 transition-colors">
                    <div className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Good Points */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="text-indigo-500 dark:text-indigo-400" size={20} />
              Looking Good ({goodPoints.length})
            </h4>
            {goodPoints.length === 0 ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-sm font-medium border border-slate-100 dark:border-slate-700 transition-colors">
                Fill out your resume to see what you're doing well.
              </div>
            ) : (
              <ul className="space-y-3">
                {goodPoints.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 transition-colors">
                    <CheckCircle2 className="shrink-0 text-indigo-500 dark:text-indigo-400 mt-0.5" size={16} />
                    <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Job Description Matcher (FREE) */}
        <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="text-indigo-500 dark:text-indigo-400" size={24} />
              Job Description Matcher <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-2">Free</span>
            </h3>
            <button 
              onClick={() => setShowMatcher(!showMatcher)}
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-4 py-2 rounded-full transition-colors"
            >
              {showMatcher ? 'Hide Matcher' : 'Compare with JD'}
            </button>
          </div>

          {showMatcher && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Paste Job Description Here
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => updateJobDescription(e.target.value)}
                  placeholder="Paste the requirements and responsibilities from the job posting..."
                  className="w-full h-40 p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-sm"
                />
              </div>

              {matchResults && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
                    <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Match Score</div>
                    <div className={cn(
                      "text-5xl font-black tracking-tighter mb-2",
                      matchResults.matchPercentage >= 70 ? "text-emerald-500 dark:text-emerald-400" : matchResults.matchPercentage >= 40 ? "text-yellow-500 dark:text-yellow-400" : "text-red-500 dark:text-red-400"
                    )}>
                      {matchResults.matchPercentage}%
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Based on top 20 keywords
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <AlertCircle className="text-red-500 dark:text-red-400" size={16} />
                        Missing Keywords ({matchResults.missing.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchResults.missing.length > 0 ? matchResults.missing.map(kw => (
                          <span key={kw} className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50 px-3 py-1 rounded-full text-xs font-medium transition-colors">
                            {kw}
                          </span>
                        )) : (
                          <span className="text-sm text-slate-500 dark:text-slate-400 italic">No missing keywords found!</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500 dark:text-emerald-400" size={16} />
                        Matched Keywords ({matchResults.matched.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchResults.matched.length > 0 ? matchResults.matched.map(kw => (
                          <span key={kw} className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 px-3 py-1 rounded-full text-xs font-medium transition-colors">
                            {kw}
                          </span>
                        )) : (
                          <span className="text-sm text-slate-500 dark:text-slate-400 italic">No matched keywords yet.</span>
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
