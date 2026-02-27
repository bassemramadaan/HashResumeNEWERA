import { useResumeStore } from '../../store/useResumeStore';
import { CheckCircle2, AlertCircle, Activity, TrendingUp, Target } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ATSAudit() {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills } = data;

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

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
          <Target className="text-indigo-500" size={24} />
          ATS Resume Audit
        </h2>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-100">
        
        {/* Score Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-zinc-100">
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-zinc-100"
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
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">/ 100</span>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">
              {score >= 80 ? "Great Job! You're ATS Ready." : score >= 50 ? "Good start, but needs work." : "Needs significant improvements."}
            </h3>
            <p className="text-zinc-600 leading-relaxed max-w-lg">
              Applicant Tracking Systems (ATS) scan resumes for keywords, formatting, and completeness. 
              Follow the suggestions below to improve your score and increase your chances of landing an interview.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Improvements */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
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
                    <span className="text-sm text-zinc-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Good Points */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="text-indigo-500" size={20} />
              Looking Good ({goodPoints.length})
            </h4>
            {goodPoints.length === 0 ? (
              <div className="p-4 bg-zinc-50 text-zinc-500 rounded-xl text-sm font-medium border border-zinc-100">
                Fill out your resume to see what you're doing well.
              </div>
            ) : (
              <ul className="space-y-3">
                {goodPoints.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <CheckCircle2 className="shrink-0 text-indigo-500 mt-0.5" size={16} />
                    <span className="text-sm text-zinc-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
