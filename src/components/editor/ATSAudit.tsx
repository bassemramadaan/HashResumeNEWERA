import { useMemo, useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  CheckCircle2,
  AlertCircle,
  Activity,
  Target,
  Wand2,
  Check,
  Sparkles,
  Eye,
  RefreshCw,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateATSScore } from "../../utils/ats";
import { ATSAnalyzer } from "../ATSAnalyzer";

export default function ATSAudit() {
  const { data, updateJobDescription } = useResumeStore();
  const { language } = useLanguageStore();
  const t = translations[language].atsAudit;
  const { personalInfo } = data;
  const isAr = language === "ar";
  const [showSimulator, setShowSimulator] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const { score, sections } = useMemo(() => calculateATSScore(data), [data]);
  const isEmpty = score === 0 && !personalInfo.fullName;

  if (isEmpty) {
    return (
      <div className="space-y-6 font-sans max-w-4xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 shadow-xs">
            <Target className="text-orange-500" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950">{t.title}</h2>
            <p className="text-[11px] text-slate-500 font-medium">HashResume Automated Intelligence</p>
          </div>
        </div>

        <div className="bg-white p-8 md:p-14 rounded-3xl border border-slate-200/70 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-slate-100">
            <Activity className="text-slate-400 animate-pulse" size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">{t.noDataTitle}</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">{t.noDataDesc}</p>
          </div>
        </div>
      </div>
    );
  }

  // Visual status markers matching premium tone
  const getScoreVerdict = (s: number) => {
    if (s >= 85) return { text: isAr ? "سيرة مثالية وجاهزة!" : "Highly Optimized", color: "text-emerald-600 bg-emerald-50 border-emerald-150" };
    if (s >= 65) return { text: isAr ? "جيدة وتحتاج تحسين طفيف" : "Needs Adjustments", color: "text-amber-600 bg-amber-50 border-amber-150" };
    return { text: isAr ? "تحتاج إعادة هيكلة" : "Critical Optimization Required", color: "text-rose-600 bg-rose-50 border-rose-150" };
  };

  const getATSParsedText = () => {
    let text = "";
    text += `========================================================\n`;
    text += `  ATS ENGINE PARSER v5.0 // CORE SCAN PROTOCOL\n`;
    text += `  STATUS: 100% PLAIN-TEXT READABLE & SEGMENTED\n`;
    text += `  TIMESTAMP: ${new Date().toISOString()}\n`;
    text += `========================================================\n\n`;

    text += `[STRUCTURE UNIT_01: CONTACT & CREDENTIALS]\n`;
    text += `--------------------------------------------------------\n`;
    text += `FULL NAME: ${personalInfo.fullName || " [EMPTY] "}\n`;
    text += `JOB TITLE: ${personalInfo.jobTitle || " [EMPTY] "}\n`;
    text += `EMAIL:     ${personalInfo.email || " [EMPTY] "}\n`;
    text += `PHONE:     ${personalInfo.phone || " [EMPTY] "}\n`;
    text += `LOCALITY:  ${personalInfo.address || " [EMPTY] "}\n`;
    if (personalInfo.linkedin) text += `LINKEDIN:  ${personalInfo.linkedin}\n`;
    if (personalInfo.github)   text += `GITHUB:    ${personalInfo.github}\n`;
    text += `\n`;

    text += `[STRUCTURE UNIT_02: PROFILE SUMMARY]\n`;
    text += `--------------------------------------------------------\n`;
    text += `${personalInfo.summary || " [No profile summary parsed] "}\n\n`;

    text += `[STRUCTURE UNIT_03: EXPERIENCE TIMELINE]\n`;
    text += `--------------------------------------------------------\n`;
    if (data.experience && data.experience.length > 0) {
      data.experience.forEach((exp: any, i: number) => {
        text += `RECORD #${i + 1}:\n`;
        text += `  COMPANY:  ${exp.company || " [NOT DECLARED] "}\n`;
        text += `  POSITION: ${exp.position || " [NOT DECLARED] "}\n`;
        text += `  TIMELINE: ${exp.startDate || "N/A"} - ${exp.currentlyWorking ? "Present" : exp.endDate || "N/A"}\n`;
        text += `  EXTRACTED RESPONSIBILITIES:\n`;
        if (exp.description) {
          text += `    ${exp.description.replace(/\n/g, "\n    ")}\n`;
        } else {
          text += `    [Warning: No responsibility text found for parsing]\n`;
        }
        text += `\n`;
      });
    } else {
      text += ` [No experience files registered. WARNING: High danger score] \n\n`;
    }

    text += `[STRUCTURE UNIT_04: EDUCATION HISTORY]\n`;
    text += `--------------------------------------------------------\n`;
    if (data.education && data.education.length > 0) {
      data.education.forEach((edu: any, i: number) => {
        text += `RECORD #${i + 1}:\n`;
        text += `  INSTITUTION: ${edu.institution || " [NOT DECLARED] "}\n`;
        text += `  DEGREE:      ${edu.degree || " [NOT DECLARED] "}\n`;
        text += `  TIMELINE:    ${edu.startDate || "N/A"} - ${edu.endDate || "N/A"}\n`;
        if (edu.description) text += `  DETAILS:     ${edu.description}\n`;
        text += `\n`;
      });
    } else {
      text += ` [No higher educational tracks parsed] \n\n`;
    }

    text += `[STRUCTURE UNIT_05: TAXONOMY TAGS / SKILLS]\n`;
    text += `--------------------------------------------------------\n`;
    if (data.skills && data.skills.length > 0) {
      const skillsList = data.skills.map((s: any) => typeof s === 'string' ? s : s.name).filter(Boolean);
      text += `SKILLS PARSED: ${skillsList.join(" | ")}\n\n`;
    } else {
      text += ` [Critical Warning: No indexed skills parsed] \n\n`;
    }

    text += `[STRUCTURE UNIT_06: PORTFOLIO PROJECTS]\n`;
    text += `--------------------------------------------------------\n`;
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach((proj: any, i: number) => {
        text += `RECORD #${i + 1}:\n`;
        text += `  PROJECT NAME: ${proj.name || " [NOT DECLARED] "}\n`;
        if (proj.link) text += `  PROJECT LINK: ${proj.link}\n`;
        if (proj.description) text += `  DETAILS:      ${proj.description}\n`;
        text += `\n`;
      });
    } else {
      text += ` [No custom project listings found] \n\n`;
    }

    text += `========================================================\n`;
    text += `  SCAN CYCLE COMPLETE -- RESULT: VERIFIED PARSE READY\n`;
    text += `========================================================\n`;
    return text;
  };

  const handleScanSimulation = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const scoreVerdict = getScoreVerdict(score);

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Title Header area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100 shadow-xs">
            <Target className="text-brand-600 animate-pulse" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">
              {t.title}
            </h2>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
              {isAr ? "تحليل فوري قبل تفعيل التصدير" : "Instance diagnostic before lock"}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* ATS Vision Simulator Toggle Button */}
          <button
            onClick={() => {
              if (!showSimulator) {
                handleScanSimulation();
              }
              setShowSimulator(!showSimulator);
            }}
            className={cn(
              "px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-3xs",
              showSimulator 
                ? "bg-slate-900 border-slate-900 text-white hover:bg-slate-800" 
                : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <Eye size={14} className={cn(showSimulator && "text-brand-400")} />
            <span>{isAr ? "محاكي فحص الـ ATS البصري" : "ATS Vision Simulator"}</span>
            <span className="bg-brand-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black scale-90 animate-pulse">
              NEW
            </span>
          </button>

          <div className={`px-3 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 ${scoreVerdict.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            <span>{scoreVerdict.text}</span>
          </div>
        </div>
      </div>

      {showSimulator ? (
        /* ATS Vision Terminal Screen Simulator */
        <div className="space-y-6">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden text-start" dir="ltr">
            {/* Terminal Top bar decoration */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono font-medium text-slate-400 ml-2">ats_crawler_system_v5.sh</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleScanSimulation}
                  disabled={isScanning}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-350 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw size={12} className={cn("text-slate-400", isScanning && "animate-spin")} />
                  <span>{isAr ? "إعادة فحص" : "RE-SCAN"}</span>
                </button>
                <button
                  onClick={() => setShowSimulator(false)}
                  className="bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-350 p-1.5 rounded-lg border border-slate-700 transition-all cursor-pointer"
                  title="Close Simulator"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Terminal Core Viewport */}
            <div className="p-6 md:p-8 font-mono text-xs text-emerald-400 overflow-x-auto min-h-[400px] max-h-[550px] leading-relaxed relative">
              {isScanning ? (
                /* Scanning overlay animations */
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  <span className="text-xs font-mono tracking-widest text-[#FF4D2D] animate-pulse uppercase">
                    [CRAWLER_BOT]: SCANNING RAW DATA STRUCTURE...
                  </span>
                  <div className="w-48 bg-slate-900 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#FF4D2D] h-full rounded-full animate-[loading_1s_infinite]" style={{ width: '40%' }} />
                  </div>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap select-text font-mono tracking-wide text-indigo-200">
                  {getATSParsedText()}
                </pre>
              )}
            </div>
            
            {/* Ambient terminal green bar reflection */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-brand-500 animate-pulse pointer-events-none" />
          </div>

          {/* User reassuring card info block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 text-start flex gap-3">
              <span className="text-xl">💡</span>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                  {isAr ? "لماذا يفيدك هذا المنظور البصري؟" : "How does this simulation assist you?"}
                </h4>
                <p className="text-[11px] text-slate-650 leading-relaxed font-semibold">
                  {isAr
                    ? "يقوم المحاكي بتقشير التصاميم والألوان وإظهار النصوص الخام تمامًا التي تستخلصها أنظمة الموارد البشرية كـ Workday أو Taleo لتكون واثقًا من قابلية قراءتها الآلية بنسبة 100%."
                    : "The simulator strips away graphic colors and shapes, mimicking how corporate screening engines (like Workday or Taleo) crawl text layout, securing index-safe readability."}
                </p>
              </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 text-start flex gap-3">
              <span className="text-xl">🎯</span>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                  {isAr ? "نصيحة ذهبية للقبول" : "Golden Rule for Approval"}
                </h4>
                <p className="text-[11px] text-slate-650 leading-relaxed font-semibold">
                  {isAr
                    ? "تأكّد من عدم ترك حقول فارغة (مثل [EMPTY]). روبوتات تصفية الكفاءات تعتمد على وجود الكلمات الدلالية المناسبة في تصنيفاتها الصحيحة لفرز ملفك للمقابلة الشخصية."
                    : "Ensure parser tokens are populated rather than [EMPTY]. Screening spiders search specifically for context boundaries to route candidates to managers."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Dashboard panel blocks */
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Metric gauge Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200/70 p-6 md:p-8 rounded-3xl shadow-xs flex flex-col items-center justify-center text-center space-y-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 to-orange-500" />
          
          <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="w-full h-full transform -rotate-90 absolute inset-0">
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={390}
                strokeDashoffset={390 - (390 * Math.min(score, 100)) / 100}
                className={cn(
                  "transition-all duration-1000 ease-out text-brand-600"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                {score}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                {t.scoreOutOf}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-sm font-extrabold text-slate-950">
              {score >= 80 ? t.greatJob : score >= 50 ? t.goodStart : t.needsImprovement}
            </h4>
            <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto leading-relaxed">
              {t.atsExplanation}
            </p>
          </div>
        </div>

        {/* Section Breakdown Grid list */}
        <div className="lg:col-span-8 bg-white border border-slate-200/70 p-6 md:p-8 rounded-3xl shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
              {t.sectionBreakdown}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section, idx) => {
              const pct = section.maxScore > 0 ? (section.score / section.maxScore) * 100 : 0;
              const isPerfect = section.score === section.maxScore;
              return (
                <div key={idx} className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{section.title}</span>
                    <span className={`font-extrabold px-1.5 py-0.5 rounded-md text-[10px] ${
                      isPerfect ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {section.score}/{section.maxScore}
                    </span>
                  </div>
                  
                  <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 rounded-full",
                        isPerfect ? "bg-emerald-500" : pct > 50 ? "bg-brand-500" : "bg-orange-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Job Description Tailoring */}
      <div className="bg-white border border-slate-200/70 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">
              <Wand2 className="text-orange-500" size={16} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {isAr ? "مقارن الوصف الوظيفي الذكي (Instant Matching)" : "AI Job Description Mirroring"}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {isAr 
                  ? "الصق متطلبات الوظيفة الشاغرة لتحليل الثغرات المهارية وحلها قبل تنزيل الملف." 
                  : "Compare against corporate vacancies to immediately find core skill targets."}
              </p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <textarea
            value={data.jobDescription || ""}
            onChange={(e) => updateJobDescription(e.target.value)}
            placeholder={isAr ? "الصق متطلبات الوظيفة الشاغرة ومؤهلاتها هنا..." : "Paste corporate job description terms, requirements or specifications..."}
            className="w-full h-28 p-4 border border-slate-200 bg-white hover:border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/10 rounded-2xl transition-all text-xs resize-none"
            dir={isAr ? "rtl" : "ltr"}
          />
          {!data.jobDescription && (
            <div className={`absolute bottom-3 ${isAr ? 'left-3' : 'right-3'} flex items-center gap-1.5 text-[10px] font-bold text-slate-400 select-nonepointer-events-none`}>
              <Sparkles size={11} className="text-orange-400 animate-pulse" />
              <span>{isAr ? "يقوم بكتابة اقتراحات فورية للمهارات الصعبة" : "Auto-extracts key tags"}</span>
            </div>
          )}
        </div>

        {data.jobDescription && data.jobDescription.trim().length > 10 && (
          <div className="pt-2">
            <ATSAnalyzer
              resume={JSON.stringify(data)}
              jobDescription={data.jobDescription}
            />
          </div>
        )}
      </div>

      {/* Detailed Diagnostic logs / Improvements & Success points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommended Upgrades / Detailed suggestions */}
        <div className="bg-white border border-slate-200/70 p-6 md:p-8 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertCircle size={16} className="text-orange-500 shrink-0" />
            <h3 className="text-sm font-extrabold text-slate-900">
              {t.detailedSuggestions}
            </h3>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {sections.some(s => s.improvements.length > 0) ? (
              sections.map((section, idx) => 
                section.improvements.length > 0 && (
                  <div key={idx} className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      {section.title}
                    </span>
                    <div className="space-y-2">
                      {section.improvements.map((imp, i) => (
                        <div key={i} className="flex gap-2.5 p-3 rounded-xl border border-orange-100/50 bg-orange-50/20 text-xs text-slate-700 leading-normal">
                          <span className="text-orange-500 shrink-0 font-bold">✦</span>
                          <span>{imp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">
                {isAr ? "لا توجد تعديلات عاجلة للتطبيق!" : "No modifications recommended!"}
              </p>
            )}
          </div>
        </div>

        {/* Working Well / Points of Excellence */}
        <div className="bg-white border border-slate-200/70 p-6 md:p-8 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <h3 className="text-sm font-extrabold text-slate-900">
              {t.workingWell}
            </h3>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {sections.some(s => s.goodPoints.length > 0) ? (
              sections.map((section, idx) => 
                section.goodPoints.length > 0 && (
                  <div key={idx} className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      {section.title}
                    </span>
                    <div className="space-y-2">
                      {section.goodPoints.map((gp, i) => (
                        <div key={i} className="flex gap-2.5 p-3 rounded-xl border border-emerald-100/50 bg-emerald-50/20 text-xs text-slate-700 leading-normal">
                          <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{gp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">
                {isAr ? "اكمل تعبئة الحقول الأساسية أولاً" : "Include core information to calculate perfect marks"}
              </p>
            )}
          </div>
        </div>
        </div>
        </div>
      )}
    </div>
  );
}
