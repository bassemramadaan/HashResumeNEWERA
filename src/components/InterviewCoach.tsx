import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageSquare, HelpCircle, ChevronDown, Award, Loader2, BookOpen, Lightbulb, PenTool } from "lucide-react";
import { useResumeStore } from "../store/useResumeStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { aiService } from "../services/aiService";

interface QuestionItem {
  question: string;
  tip: string;
  answerOutline: string;
}

const FALLBACK_QUESTIONS: Record<"ar" | "en" | "fr", Record<string, QuestionItem[]>> = {
  ar: {
    developer: [
      {
        question: "كيف تتعامل مع مشكلة تقنية صعبة أو خلل تسبب في توقف النظام؟",
        tip: "ركز على مهارات استكشاف الأخطاء وحلها المنهجي، والهدوء تحت الضغط، واستخدام السجلات والـ Debugging.",
        answerOutline: "(صيغة STAR) أبدأ بعزل المشكلة وتحديد المسبب الرئيسي، ثم أضع حلاً مؤقتاً لتخفيف الأثر، يليه حل جذري لضمان عدم التكرار مع توثيق المعالجة كاملاً.",
      },
      {
        question: "اشرح مشروعاً تقنياً معقداً عملت عليه مؤخراً وما كان دورك الفعلي فيه؟",
        tip: "ركز على لغات البرمجة التي استخدمتها، والقرارات المعمارية التي اتخذتها ومخرجات المشروع بالأرقام.",
        answerOutline: "قمت بقيادة تطوير نظام لإدارة الأداء بالاعتماد على React و Node.js، ونجحت في تقليص وقت معالجة البيانات بنسبة 35% عبر تحسين الاستعلامات والـ Caching.",
      },
      {
        question: "كيف تواكب أحدث التقنيات وأدوات البرمجة المستمرة بشكل سنوي؟",
        tip: "المقابِل يريد معرفة مدى شغفك وقابليتك للتطور الذاتي المستمر.",
        answerOutline: "أتابع دورياً توثيقات المكتبات الرسمية، وأشارك في مشروعات مفتوحة المصدر، بالإضافة لتخصيص ساعة أسبوعية لتجربة إصدارات لغات البرمجة الجديدة.",
      },
    ],
    default: [
      {
        question: "تحدث عن موقف واجهت فيه خلافاً مع زميل في العمل وكيف تم حله؟",
        tip: "أظهر مهارات الاستماع الفعال والتواصل الاحترافي للفصل بين الجوانب الشخصية والمهنية المباشرة.",
        answerOutline: "ركزت على الأهداف المشتركة للمشروع، وعقدنا جلسة حوار هادئة لفهم وجهة نظر الطرف الآخر، وخرجنا بصيغة توافقية أرضت الجميع وأنهينا العمل بنجاح.",
      },
      {
        question: "ما هو أكبر تحدٍ مهني مررت به حتى الآن وكيف تغلبت عليه؟",
        tip: "اختر تحدياً حقيقياً مع ذكر خطوات معينة ملموسة اتخذتها للتغلب عليه ونتائج واضحة بالأرقام.",
        answerOutline: "كنت مسؤولاً عن تسليم مخرجات معقدة في جدول زمني مضغوط للغاية. قمت بإعادة ترتيب أولويات المهام وتوزيع الأدوار، ونجحنا في تسليم المشروع قبل الموعد بيومين.",
      },
      {
        question: "لماذا تظن أنك المرشح الأفضل والأنسب لهذا المنصب الوظيفي؟",
        tip: "اربط بين المهارات المذكورة في سيرتك وصميم الاحتياجات الوظيفية للشركة لتثبت ملاءمتك التامة لهم.",
        answerOutline: "أمتلك حزمة مهارات فريدة وسجلاً حافلاً بالنجاحات، وتحديداً في المساهمة بتحسين العمليات والتعلم السريع للمنصات الحديثة، وهو ما ينعكس فوراً على كفاءة الفريق.",
      },
    ],
  },
  en: {
    developer: [
      {
        question: "How do you systematically approach debugging a critical production bug?",
        tip: "Focus on structured problem solving, staying calm under pressure, and using logs, testing, and monitoring tools.",
        answerOutline: "Using the STAR method: I first replicate the bug in a staging environment, analyze runtime logs, implement a safe hotfix, and write a regression test to prevent recurrence.",
      },
      {
        question: "Tell us about a challenging tech stack decision you made. Why did you choose it?",
        tip: "Demonstrate architectural thinking, balancing trade-offs, scalability, and long-term team maintenance cost.",
        answerOutline: "I migrated our real-time messaging pipeline from WebSockets to Server-Sent Events to optimize battery consumption on mobile clients, saving 30% computing resource overhead.",
      },
      {
        question: "How do you ensure code cleanliness and robust testing under tight delivery deadlines?",
        tip: "Explain your balanced approach to technical debt vs. timely market releases.",
        answerOutline: "By prioritizing robust unit tests for core logical helpers, conducting brief peer pull request reviews, and scheduling code refactoring sessions in our tech-debt backlog.",
      },
    ],
    default: [
      {
        question: "Can you share an instance where you worked with a difficult team member and how you resolved it?",
        tip: "Focus on active listening, empathy, separating personal feelings, and prioritizing project objectives.",
        answerOutline: "I initiated a one-on-one friendly sync, aligned strictly on shared engineering goals, resolved the miscommunication professionally, and delivered the milestone successfully.",
      },
      {
        question: "What is your greatest professional accomplishment so far?",
        tip: "Focus on tangible business indicators, specific metrics, personal contribution, and clear delivery timeline.",
        answerOutline: "I refactored our file-archiving process flow, leading to an immediate 40% performance speed improvement and saving thousands in bandwidth costs.",
      },
      {
        question: "Why should we hire you over other qualified applicants?",
        tip: "Directly map your existing proven skillset to the exact painpoints outlined in the company's job description.",
        answerOutline: "I bring a well-rounded combination of target competencies, deep engineering passion, and a proven track record of boosting team efficiency starting from week one.",
      },
    ],
  },
  fr: {
    default: [
      {
        question: "Parlez-nous d'une situation où vous avez fait face à un défi complexe et comment vous l'avez surmonté.",
        tip: "Mettez en valeur votre rigueur, votre analyse et les résultats tangibles de vos actions.",
        answerOutline: "J'ai restructuré nos flux de travail pour respecter une échéance stricte, ce qui a permis de finaliser le projet avec deux jours d'avance.",
      },
      {
        question: "Pourquoi devrions-nous vous retenir pour ce poste particulier ?",
        tip: "Faites le lien direct entre vos compétences clés et les besoins réels de leur équipe technique.",
        answerOutline: "J'apporte des compétences éprouvées et un engagement fort en matière d'efficacité, ce qui me permettra d'être opérationnel dès la première semaine.",
      },
    ],
  },
};

export default function InterviewCoach() {
  const { language } = useLanguageStore();
  const { data } = useResumeStore();
  
  const isAr = language === "ar";
  
  // Initialize from store, but let them edit
  const [jobTitle, setJobTitle] = useState(data.personalInfo.jobTitle || "");
  const [skillsInput, setSkillsInput] = useState(data.skills?.join(", ") || "");
  
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const getFallback = (): QuestionItem[] => {
    const langKey = (language === "ar" || language === "en" || language === "fr") ? language : "en";
    const jobKey = jobTitle.toLowerCase().match(/(dev|web|soft|engineer|programmer|برمج|سير|مطور)/) ? "developer" : "default";
    
    // Fallback safe indexer
    const list = FALLBACK_QUESTIONS[langKey][jobKey] || FALLBACK_QUESTIONS[langKey]["default"] || FALLBACK_QUESTIONS["en"]["default"];
    return list;
  };

  const generateAIQuestions = async () => {
    if (!jobTitle.trim()) return;
    setLoading(true);
    setActiveIdx(null);
    setQuestions([]);

    const prompt = `
      You are an expert HR Manager and Technical Recruiter.
      Candidate Details:
      Job Title: "${jobTitle || "Professional"}"
      Skills: ${skillsInput || "General Professional Competencies"}
      Language: "${language === "ar" ? "Arabic" : language === "fr" ? "French" : "English"}"

      Generate exactly 3 tailored behavioral and situational interview questions with helpful recruiters' tips and a professional STAR model outline response!
      Return ONLY a pure JSON array following this structure (No markdown wrap, no backticks, no trailing commas):
      [
        {
          "question": "The question tailored to their background",
          "tip": "Hint on what recruiters look for in this question",
          "answerOutline": "A brief model outline of how they should formulate their answers"
        }
      ]
    `;

    try {
      const response = await aiService.generateContent(prompt, "You are a recruitment assistant configured to output raw JSON arrays.");
      const cleaned = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed);
      } else {
        throw new Error("Invalid output layout");
      }
    } catch (e) {
      console.warn("Generating interview questions via AI limits reached, pulling stellar heuristic mock interview questions:", e);
      // Fallback
      setQuestions(getFallback());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-3xl mx-auto space-y-6 text-start select-none relative overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-indigo-500/[0.03] to-transparent rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-radial from-orange-500/[0.02] to-transparent rounded-full pointer-events-none" />

      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 via-[#1C1A35] to-[#FF4D2D] p-3 text-white flex items-center justify-center shadow-lg shrink-0 relative">
            <MessageSquare size={20} className="relative z-10" />
            <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-slate-900 text-sm sm:text-base tracking-tight leading-tight">
                {isAr ? "مستشار الاستعداد للمقابلات الذكي" : "AI Interview Coach & Prep"}
              </h4>
              <span className="bg-gradient-to-r from-[#FF4D2D]/10 to-indigo-500/10 text-[#FF4D2D] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#FF4D2D]/20">
                PRO AI
              </span>
            </div>
            <p className="text-slate-400 text-[10px] sm:text-[11px] font-bold mt-1">
              {isAr 
                ? "توليد أسئلة مقابلة متقدمة وإجابات نموذجية مستهدفة بناءً على بيانات مجالك مخصصة!" 
                : "Generate custom mock interview questions and structured STAR response templates matching your goals!"}
            </p>
          </div>
        </div>
      </div>

      {/* Editable Inputs for Target Job Title & Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100/80 relative z-10">
        <div className="space-y-1.5 text-start">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            {isAr ? "المسمى الوظيفي المستهدف" : "Target Job Title"}
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder={isAr ? "مثال: مطور ويب، مهندس برمجيات" : "e.g. Frontend Engineer, Product Manager"}
            className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 transition focus:outline-hidden focus:border-[#FF4D2D]/60 focus:ring-4 focus:ring-[#FF4D2D]/5"
          />
        </div>

        <div className="space-y-1.5 text-start">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            {isAr ? "المهارات الرائجة (مفصولة بفاصلة)" : "Keywords / Skills (comma separated)"}
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder={isAr ? "مثال: React, Node.js, Agile" : "e.g. React, Node.js, Agile, UI/UX"}
            className="w-full bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 transition focus:outline-hidden focus:border-[#FF4D2D]/60 focus:ring-4 focus:ring-[#FF4D2D]/5"
          />
        </div>

        <div className="sm:col-span-2 pt-2 flex justify-end">
          <button
            onClick={generateAIQuestions}
            disabled={loading || !jobTitle.trim()}
            className="w-full sm:w-auto bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-none py-3 px-6 rounded-xl text-xs font-black hover:opacity-90 active:scale-[0.98] duration-150 disabled:opacity-40 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={12} className="text-[#FF4D2D]" />
            <span>{isAr ? "توليد أسئلة مخصصة بالذكاء الاصطناعي" : "Generate Custom Coach"}</span>
          </button>
        </div>
      </div>

      {/* Loading state with animations */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-4">
          <div className="relative flex items-center justify-center">
            <Loader2 className="animate-spin text-[#FF4D2D] w-8 h-8 relative z-10" />
            <div className="absolute w-12 h-12 bg-[#FF4D2D]/10 rounded-full blur-xs animate-ping" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-black text-slate-800">
              {isAr ? "جاري قراءة تفاصيل سيرتك وتحليل الخبرات..." : "Analyzing candidate records and custom background details..."}
            </p>
            <p className="text-[10px] text-slate-400 font-bold font-mono">
              {isAr ? "تجهيز نظام STAR لتنسيق الأجوبة..." : "Mapping behavioral response indexes..."}
            </p>
          </div>
        </div>
      )}

      {/* Accordion Questions List */}
      <AnimatePresence>
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
                <BookOpen size={11} className="text-[#FF4D2D]" />
                {isAr ? "الأسئلة المقترحة لمجالك" : "TAILORED QUESTIONS LIST"}
              </span>
              <button 
                onClick={generateAIQuestions}
                className="text-[10px] font-black text-[#FF4D2D] hover:underline hover:opacity-80 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles size={10} />
                <span>{isAr ? "إعادة التوليد بتحديثات جديدة" : "Regenerate New Set"}</span>
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((item, idx) => {
                const isExpanded = activeIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                      isExpanded 
                        ? "border-[#FF4D2D]/40 bg-linear-to-b from-white to-slate-50/20 shadow-[0_4px_24px_rgba(255,102,51,0.06)] scale-[1.01]" 
                        : "border-slate-150 bg-slate-50/20 hover:border-slate-300"
                    }`}
                  >
                    {/* Header Trigger */}
                    <button
                      onClick={() => setActiveIdx(isExpanded ? null : idx)}
                      className="w-full text-start p-4 sm:p-5 flex items-start gap-3.5 justify-between font-sans cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-xl text-[11px] font-mono font-black flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isExpanded ? "bg-[#FF4D2D] text-white rotate-6" : "bg-slate-100 text-slate-500"
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="font-black text-slate-800 text-xs sm:text-[13px] leading-snug">
                          {item.question}
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 shrink-0 transition-transform duration-300 mt-1.5 ${isExpanded ? "rotate-180 text-slate-700" : ""}`}
                      />
                    </button>

                    {/* Collapsible Content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="border-t border-slate-100 bg-white"
                        >
                          <div className="p-4 sm:p-5 space-y-4">
                            {/* Tips */}
                            {item.tip && (
                              <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-xl p-4 flex gap-3 text-indigo-950 leading-relaxed text-xs">
                                <Lightbulb size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <span className="font-extrabold text-indigo-800 block">
                                    {isAr ? "هدف ومقصد مسؤول التوظيف:" : "What Recruiters Are Looking For:"}
                                  </span>
                                  <p className="font-medium text-slate-650">{item.tip}</p>
                                </div>
                              </div>
                            )}

                            {/* STAR Answer Template */}
                            {item.answerOutline && (
                              <div className="bg-emerald-50/30 border border-emerald-100/40 rounded-xl p-4 flex gap-3 text-emerald-950 leading-relaxed text-xs">
                                <Award size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <span className="font-extrabold text-emerald-800 block">
                                    {isAr ? "صيغة الإجابة المقترحة بطريقة STAR:" : "Suggested STAR Format Formulation:"}
                                  </span>
                                  <p className="font-medium text-slate-650">{item.answerOutline}</p>
                                </div>
                              </div>
                            )}

                            {/* Action Tracker Suggestion */}
                            <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                              <span className="flex items-center gap-1">
                                <PenTool size={11} className="text-slate-350" />
                                {isAr ? "تلميح: دوّن إجابتك الخاصة بصحفة الملاحظات" : "Pro tip: write down your custom draft"}
                              </span>
                              <span>{isAr ? "معادلة STAR ممتازة للقبول" : "STAR formula helps you win"}</span>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to action info text empty state */}
      {!loading && questions.length === 0 && (
        <div className="border border-dashed border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-4 bg-linear-to-b from-slate-50/10 to-slate-150/10">
          <HelpCircle className="mx-auto text-slate-300 w-9 h-9 animate-bounce" />
          <div className="space-y-2 max-w-sm mx-auto">
            <h5 className="font-black text-slate-800 text-xs sm:text-[14px]">
              {isAr ? "تخصيص مستشار المقابلات فورا" : "Begin Your Tailored Practice"}
            </h5>
            <p className="text-[11px] text-slate-400 font-bold leading-normal">
              {isAr 
                ? "أدخل المسمى الوظيفي المستهدف والمهارات بالنموذج أعلاه لتصميم أسئلة ذكية ملائمة تماماً للمقابلات." 
                : "Provide your target title and critical key skills above to synthesize interactive real-world recruiter simulations."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

