import { useState, useMemo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { CheckCircle2, AlertCircle, Activity, Target, Briefcase } from 'lucide-react';
import { cn } from '../../utils';
import { calculateATSScore, getJobMatchResults } from '../../utils/ats';

export default function ATSAudit() {
  const { data, updateJobDescription } = useResumeStore();
  const { personalInfo, jobDescription } = data;
  const [showMatcher, setShowMatcher] = useState(!!jobDescription);

  const { score, sections } = calculateATSScore(data);
  const isEmpty = score === 0 && !personalInfo.fullName;

  const matchResults = useMemo(() => {
    return getJobMatchResults(data);
  }, [data]);

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

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-indigo-500 dark:text-indigo-400";
    if (s >= 50) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

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
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800">
          <div className="relative flex items-center justify-center shrink-0 w-32 h-32 md:w-40 md:h-40">
            <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90 absolute inset-0">
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className="text-indigo-600 dark:text-indigo-400" stopColor="currentColor" />
                  <stop offset="100%" className="text-cyan-600 dark:text-cyan-400" stopColor="currentColor" />
                </linearGradient>
              </defs>
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-100 dark:text-slate-800 transition-colors md:hidden"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100 dark:text-slate-800 transition-colors hidden md:block"
              />
              {/* Mobile Progress */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={score >= 80 ? "url(#score-gradient)" : "currentColor"}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={352}
                strokeDashoffset={352 - (352 * score) / 100}
                className={cn("transition-all duration-1000 ease-out md:hidden", score < 80 ? getScoreColor(score) : "")}
              />
              {/* Desktop Progress */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={score >= 80 ? "url(#score-gradient)" : "currentColor"}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * score) / 100}
                className={cn("transition-all duration-1000 ease-out hidden md:block", score < 80 ? getScoreColor(score) : "")}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn(
                "text-4xl md:text-5xl font-black tracking-tighter", 
                score >= 80 ? "bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent" : getScoreColor(score)
              )}>
                {score}
              </span>
              <span className="text-[10px] md:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 md:mt-1">/ 100</span>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {score >= 80 ? "Great Job! You're ATS Ready." : score >= 50 ? "Good start, but needs work." : "Needs significant improvements."}
            </h3>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              Applicant Tracking Systems (ATS) scan resumes for keywords, formatting, and completeness. 
              Follow the suggestions below to improve your score and increase your chances of landing an interview.
            </p>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="mb-12">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-6">Section Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {sections.map((section, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">{section.title}</span>
                  <span className={cn("text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full", 
                    section.score === section.maxScore ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                    section.score > 0 ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" :
                    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  )}>
                    {section.score}/{section.maxScore}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-500", 
                      section.score === section.maxScore ? "bg-emerald-500" :
                      section.score > 0 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${section.maxScore > 0 ? (section.score / section.maxScore) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Feedback */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Detailed Suggestions</h3>
            {sections.map((section, idx) => (
              section.improvements.length > 0 && (
                <div key={idx} className="space-y-3">
                  <h4 className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={14} className="text-red-500" />
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-3 p-4 bg-red-50/30 dark:bg-red-900/10 rounded-xl border border-red-100/50 dark:border-red-800/30">
                        <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>

          <div className="space-y-6 md:space-y-8">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">What's Working Well</h3>
            {sections.map((section, idx) => (
              section.goodPoints.length > 0 && (
                <div key={idx} className="space-y-3">
                  <h4 className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.goodPoints.map((gp, i) => (
                      <li key={i} className="flex items-start gap-3 p-4 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-800/30">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{gp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
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
