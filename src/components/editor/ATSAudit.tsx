import { useMemo } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  CheckCircle2,
  AlertCircle,
  Activity,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateATSScore } from "../../utils/ats";

export default function ATSAudit() {
  const { data } = useResumeStore();
  const { language } = useLanguageStore();
  const t = translations[language].atsAudit;
  const { personalInfo } = data;

  const { score, sections } = useMemo(() => calculateATSScore(data), [data]);
  const isEmpty = score === 0 && !personalInfo.fullName;

  if (isEmpty) {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="text-indigo-500" size={24} />
            {t.title}
          </h2>
        </div>
        <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 text-center transition-colors">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ring-1 ring-slate-900/5">
            <Activity className="text-slate-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {t.noDataTitle}
          </h3>
          <p className="text-white0 max-w-md mx-auto">{t.noDataDesc}</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-indigo-500";
    if (s >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Target className="text-indigo-500" size={24} />
          {t.title}
        </h2>
      </div>

      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition-colors">
        {/* Score Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100">
          <div className="relative flex items-center justify-center shrink-0 w-40 h-40">
            <svg className="w-40 h-40 transform -rotate-90 absolute inset-0">
              <defs>
                <linearGradient
                  id="score-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    className="text-indigo-600"
                    stopColor="currentColor"
                  />
                  <stop
                    offset="100%"
                    className="text-cyan-600"
                    stopColor="currentColor"
                  />
                </linearGradient>
              </defs>
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100 transition-colors"
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
                className={cn(
                  "transition-all duration-1000 ease-out",
                  score < 80 ? getScoreColor(score) : "",
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={cn(
                  "text-5xl font-black tracking-tighter",
                  score >= 80
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent"
                    : getScoreColor(score),
                )}
              >
                {score}
              </span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
                {t.scoreOutOf}
              </span>
            </div>
          </div>

          <div className="text-center md:text-start">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {score >= 80
                ? t.greatJob
                : score >= 50
                  ? t.goodStart
                  : t.needsImprovement}
            </h3>
            <p className="text-slate-600 leading-relaxed max-w-lg">
              {t.atsExplanation}
            </p>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            {t.sectionBreakdown}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">
                    {section.title}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full",
                      section.score === section.maxScore
                        ? "bg-emerald-100 text-emerald-700"
                        : section.score > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700",
                    )}
                  >
                    {section.score}/{section.maxScore}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      section.score === section.maxScore
                        ? "bg-emerald-500"
                        : section.score > 0
                          ? "bg-yellow-500"
                          : "bg-red-500",
                    )}
                    style={{
                      width: `${section.maxScore > 0 ? (section.score / section.maxScore) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Feedback */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-slate-900">
              {t.detailedSuggestions}
            </h3>
            {sections.map(
              (section, idx) =>
                section.improvements.length > 0 && (
                  <div key={idx} className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <AlertCircle size={14} className="text-red-500" />
                      {section.title}
                    </h4>
                    <ul className="space-y-2">
                      {section.improvements.map((imp, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-4 p-4 bg-red-50/30 rounded-xl border border-red-100/50"
                        >
                          <div className="mt-2 shrink-0 w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-sm text-slate-700">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
            )}
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-bold text-slate-900">
              {t.workingWell}
            </h3>
            {sections.map(
              (section, idx) =>
                section.goodPoints.length > 0 && (
                  <div key={idx} className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      {section.title}
                    </h4>
                    <ul className="space-y-2">
                      {section.goodPoints.map((gp, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-4 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100/50"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-emerald-500 shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-slate-700">{gp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
