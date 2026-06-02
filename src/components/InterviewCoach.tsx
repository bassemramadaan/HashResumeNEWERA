import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, ChevronDown, Award, Loader2, 
  BookOpen, Lightbulb, PenTool, CheckCircle2, 
  Mic, MicOff, RefreshCw, Check, Sparkle
} from "lucide-react";
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
    developer: [
      {
        question: "Comment structurez-vous la résolution d'un bug critique en production ?",
        tip: "Montrez votre esprit de méthode, votre calme sous pression et l'usage d'outils de log et monitoring.",
        answerOutline: "Méthode STAR : Isoler le problème, appliquer un correctif temporaire sécurisé, identifier la cause racine et ajouter un test de non-régression.",
      },
    ],
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

const T = {
  ar: {
    coachTitle: "مستشار المقابلات الذكي",
    coachSubtitle: "محاكاة واقعية للمقابلات السلوكية والفنية المخصصة لمجالك",
    jobLabel: "المسمى الوظيفي المستهدف",
    jobPlaceholder: "مثال: واجهات أمامية، مهندس برمجيات، مدير مشاريع",
    skillsLabel: "الكلمات المفتاحية والمهارات الأساسية",
    skillsPlaceholder: "مثال: React, Node.js, Agile, UI/UX",
    prepModeLabel: "نوعية الأسئلة",
    modeBehavioral: "أسئلة سلوكية وإدارية",
    modeTechnical: "أسئلة فنية وتقنية عميقة",
    btnGenerate: "ابدأ جلسة المحاكاة بالذكاء الاصطناعي",
    btnGenerating: "جاري تحليل الخلفية المهنية وتوليد الأسئلة...",
    checklistTitle: "مؤشر استعدادك للمقابلة",
    checklistDesc: "استعد نفسياً وتقنياً بإنهاء الخطوات الخمس الأساسية قبل البدء:",
    checkReady: "مستعد ومصمم للنجاح!",
    readyBanner: "مبارك! بيئة استعدادك جاهزة 100%. ابدأ بصياغة وتوليد أسئلتك المخصصة الآن.",
    regenerate: "توليد مجموعة أسئلة جديدة",
    recruiterTip: "نظرة مسؤول التوظيف (السر المهني):",
    starFormat: "هيكلية الإجابة النموذجية وصيغة STAR:",
    typeDraft: "تمرن على كتابة إجابتك هنا وصياغتها للتجربة:",
    vocalSim: "ممارسة تحدث شفهية (صوتية مقترحة)",
    vocalRecordStart: "ابدأ تجربة إجابة صوتية",
    vocalRecordStop: "إيقاف الميكروفون المبرمج",
    vocalWarning: "تلميح: تخيل أنك أمام المقابل وتحدث بصوت مسموع لبناء الثقة بالنفس والطلاقة.",
    saveResponse: "حفظ مسودة الإجابة",
    responseSaved: "تم مراجعة وحفظ المسودة بنجاح!",
    interactiveSuccess: "التحضير رائع",
    evaluationHeader: "تقويم الإجابة الذاتي ومؤشر القبول",
    draftSuccessMsg: "تم تدوين وحفظ مسودة إجابتك لهذه المسألة.",
    emptyStateTitle: "بوابة التدريب التفاعلي المتقدم",
    emptyStateSubtitle: "أدخل معلومات دورك الوظيفي المستهدف أو أتمم فحص الاستعداد الجانبي لإنتاج أسئلة ذكاء اصطناعي مكافئة لمقابلات كبرى الشركات العالمية.",
    tabCoach: "🚀 محاكي المقابلة الشخصية",
    tabChecklist: "🎯 فحص التهيئة والاستعداد",
    evaluationLabel: "تحليل ومطابقة الإجابة بصيغة STAR"
  },
  en: {
    coachTitle: "Smart AI Interview Coach",
    coachSubtitle: "Real behavioral and technical simulation structured specifically for your track",
    jobLabel: "Target Job Title",
    jobPlaceholder: "e.g. Frontend Engineer, Product Manager, Data Analyst",
    skillsLabel: "Keywords & Core Competencies",
    skillsPlaceholder: "e.g. React, Node.js, Agile, System Design",
    prepModeLabel: "Simulation Target Mode",
    modeBehavioral: "Behavioral & Leadership",
    modeTechnical: "Deep Technical & Architectural",
    btnGenerate: "Launch AI Simulation Session",
    btnGenerating: "Analyzing career details and formulating challenges...",
    checklistTitle: "Your Pre-Interview Readiness",
    checklistDesc: "Go through these 5 essential parameters before entering your target mock room:",
    checkReady: "Fully prepared to conquer!",
    readyBanner: "Sensational! Your workspace prep is 100% complete. Click Generate Custom Coach above.",
    regenerate: "Regenerate New Set",
    recruiterTip: "What Recruiters Are Looking For:",
    starFormat: "Suggested STAR Framework Formulation:",
    typeDraft: "Type your practicing response draft here:",
    vocalSim: "Vocal Confidence Practice Mode",
    vocalRecordStart: "Simulate Speaking Aloud",
    vocalRecordStop: "Stop Simulating Microphone",
    vocalWarning: "Pro tip: Say your answer aloud to train your voice tone. Simulating builds great verbal momentum!",
    saveResponse: "Save Response Draft",
    responseSaved: "Response practice saved successfully!",
    interactiveSuccess: "Great preparation",
    evaluationHeader: "Self-Review & Acceptance Metrics",
    draftSuccessMsg: "Your practice response has been registered and locked in for this run.",
    emptyStateTitle: "The Advanced Interview Studio",
    emptyStateSubtitle: "Provide your professional title or finish the prep index check to deploy realistic simulations matching major tech cohorts.",
    tabCoach: "🚀 AI Placement simulator",
    tabChecklist: "🎯 Readiness Checklist",
    evaluationLabel: "STAR Answer Layout Alignment"
  },
  fr: {
    coachTitle: "Coach d'Entretien IA",
    coachSubtitle: "Simulations adaptées à votre parcours technique et professionnel",
    jobLabel: "Poste visé",
    jobPlaceholder: "Ex. Développeur Fullstack, Chef de projet",
    skillsLabel: "Mots-clés & Compétences",
    skillsPlaceholder: "Ex. React, Agile, Node.js",
    prepModeLabel: "Type de Simulation",
    modeBehavioral: "Questions Comportementales",
    modeTechnical: "Questions Techniques & Architecture",
    btnGenerate: "Lancer la Simulation IA",
    btnGenerating: "Formulation des défis professionnels en cours...",
    checklistTitle: "Indicateur de Préparation",
    checklistDesc: "Passez en revue les points clés essentiels pour maximiser votre aisance :",
    checkReady: "Prêt(e) à cartonner !",
    readyBanner: "Parfait ! Votre espace est prêt à 100%. Lancez votre simulation personnalisée ci-dessus.",
    regenerate: "Générer un nouveau set",
    recruiterTip: "Ce que recherchent les recruteurs :",
    starFormat: "Trame de réponse STAR suggérée :",
    typeDraft: "Saisissez votre brouillon de réponse ici :",
    vocalSim: "Pratique orale (Simulée)",
    vocalRecordStart: "S'entraîner à voix haute",
    vocalRecordStop: "Arrêter le simulateur micro",
    vocalWarning: "Conseil : Formulez votre réponse à haute voix pour fluidifier votre élocution.",
    saveResponse: "Enregistrer mon brouillon",
    responseSaved: "Votre brouillon a été enregistré avec succès !",
    interactiveSuccess: "Bonne préparation",
    evaluationHeader: "Auto-évaluation & Format STAR",
    draftSuccessMsg: "Votre réponse d'entraînement a été enregistrée pour cette session.",
    emptyStateTitle: "Studio d'Entraînement Avancé",
    emptyStateSubtitle: "Saisissez l'intitulé de votre poste cible ou complétez le test d'aptitude pour générer des questions d'entrevues réalistes.",
    tabCoach: "🚀 Simulateur IA interactif",
    tabChecklist: "🎯 Check-list de pré-lancement",
    evaluationLabel: "Alignement de trame de réponse"
  }
};

export default function InterviewCoach() {
  const { language } = useLanguageStore();
  const { data } = useResumeStore();
  const isAr = language === "ar";
  const t = T[language as keyof typeof T] || T.en;

  // Track settings
  const [jobTitle, setJobTitle] = useState(data.personalInfo?.jobTitle || "");
  const [skillsInput, setSkillsInput] = useState(data.skills?.join(", ") || "");
  const [prepMode, setPrepMode] = useState<"behavioral" | "technical">("behavioral");
  const [activeTab, setActiveTab] = useState<"coach" | "checklist">("coach");

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Audio simulation state for speech training
  const [isRecording, setIsRecording] = useState<Record<number, boolean>>({});
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [userDrafts, setUserDrafts] = useState<Record<number, string>>({});
  const [savedDrafts, setSavedDrafts] = useState<Record<number, boolean>>({});

  // Checklist state management
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const checklistItems = isAr 
    ? [
        { id: 1, title: "فحص الكاميرا والزاوية", desc: "تأكد من سطوع الإضاءة وارتفاع مستوى الكاميرا في اتجاه العين نظير الارتياح." },
        { id: 2, title: "عزل الضجيج والصوت الفعال", desc: "استخدم ميكروفون مخصص وتأكد من الهدوء التام للمحيط قبل لقاء المقابل." },
        { id: 3, title: "مراجعة بنود المسيرة المفرزة", desc: "أعد قراءة مهامك السابقة لتربطها تلقائياً بمسارات الأسئلة التشغيلية." },
        { id: 4, title: "اختبار استقرار شبكة الإنترنت", desc: "تأكد من جودة وباندودث الاتصال تلافيًا لأي انقطاع للبث." },
        { id: 5, title: "مراجعة هيكلية STAR الذكية", desc: "تذكر صياغة الإجابة: الموقف (Situation)، المهمة (Task)، الإجراء (Action)، والنتيجة (Result)." }
      ]
    : [
        { id: 1, title: "Check Camera & Angle Alignment", desc: "Ensure your lighting source is front-facing and camera is at eye level." },
        { id: 2, title: "Audio Balance & Noise Cancelation", desc: "Use a solid dedicated microphone and clear out ambient chatter." },
        { id: 3, title: "Review Core Resume Benchmarks", desc: "Reflect on your past key achievements to map them to behavior questions." },
        { id: 4, title: "Secure Stable High-Speed Connection", desc: "Check network reliability ahead of the call to avoid live hiccups." },
        { id: 5, title: "Internalize key STAR formulations", desc: "Maintain structured responses: Situation, Task, Action, and Quantifiable Results." }
      ];

  // Sync state with store if needed on initialization
  useEffect(() => {
    if (data.personalInfo?.jobTitle) {
      setJobTitle(prev => prev || data.personalInfo?.jobTitle || "");
    }
    if (data.skills) {
      setSkillsInput(prev => prev || data.skills.join(", "));
    }
  }, [data.personalInfo?.jobTitle, data.skills]);

  // Audio timer simulator hook
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const hasActiveRecord = Object.values(isRecording).some(Boolean);
    if (hasActiveRecord) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const getFallback = (): QuestionItem[] => {
    const langKey = (language === "ar" || language === "en" || language === "fr") ? language : "en";
    const jobKey = jobTitle.toLowerCase().match(/(dev|web|soft|engineer|programmer|برمج|سير|مطور)/) ? "developer" : "default";
    
    // safe fallback indexing
    const items = FALLBACK_QUESTIONS[langKey]?.[jobKey] || FALLBACK_QUESTIONS[langKey]?.["default"] || FALLBACK_QUESTIONS["en"]?.["default"];
    return items;
  };

  const generateAIQuestions = async () => {
    if (!jobTitle.trim()) return;
    setLoading(true);
    setActiveIdx(null);
    setQuestions([]);
    setIsRecording({});
    setUserDrafts({});
    setSavedDrafts({});

    const prompt = `
      You are an expert HR Manager and Technical Recruiter.
      Candidate Details:
      Job Title: "${jobTitle || "Professional"}"
      Skills: ${skillsInput || "General Professional Competencies"}
      Prep Focus: "${prepMode === "technical" ? "Deep Systems Architecture, Coding Best Practices, technical constraints" : "Behavioral, Competency, Leadership challenges, interpersonal skills"}"
      Language: "${language === "ar" ? "Arabic" : language === "fr" ? "French" : "English"}"

      Generate exactly 3 customized situational and role-specific interview questions with recruiters' tips and standard STAR model response formulations.
      Return ONLY a pure JSON array following this structure (No markdown wrap, no backticks, no trailing commas):
      [
        {
          "question": "The customized interview question relative to their track",
          "tip": "Constructive hint on what hiring managers seek here",
          "answerOutline": "A brief outline demonstrating a stellar professional response using the STAR method"
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
        throw new Error("Invalid schema shape");
      }
    } catch (e) {
      console.warn("Generating interview questions AI exception - launching local heuristic list instead", e);
      setQuestions(getFallback());
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklistItem = (id: number) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleVoiceSimulator = (idx: number) => {
    setIsRecording(prev => {
      const state = !prev[idx];
      // clear other recorder simulations
      return { [idx]: state };
    });
  };

  const saveResponseDraft = (idx: number) => {
    setSavedDrafts(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setSavedDrafts(prev => ({ ...prev, [idx]: false }));
    }, 4000);
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalChecklist = checklistItems.length;
  const percentageCompleted = Math.round((completedCount / totalChecklist) * 100);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden text-start font-sans max-w-4xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Upper Interactive Hub tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/60 p-2 gap-1 select-none">
        <button
          onClick={() => setActiveTab("coach")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "coach"
              ? "bg-white text-slate-900 shadow-sm border border-slate-100 font-bold"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
          }`}
        >
          <span>{t.tabCoach}</span>
        </button>
        <button
          onClick={() => setActiveTab("checklist")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "checklist"
              ? "bg-white text-slate-900 shadow-sm border border-slate-100 font-bold"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
          }`}
        >
          <span>{t.tabChecklist}</span>
          {percentageCompleted < 100 ? (
            <span className="w-2 h-2 bg-[#FF4D2D] rounded-full animate-pulse" />
          ) : (
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center">✓</span>
          )}
        </button>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
        {/* TAB 1: COACH STUDIO */}
        <AnimatePresence mode="wait">
          {activeTab === "coach" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 animate-gpu"
            >
              
              {/* Header Info Area */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <Sparkles className="text-[#FF4D2D] w-4 h-4" />
                      <span>{t.coachTitle}</span>
                    </h3>
                    <span className="bg-[#FF4D2D]/10 text-[#FF4D2D] text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md border border-[#FF4D2D]/15">
                      V3.5 ENGINE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold">
                    {t.coachSubtitle}
                  </p>
                </div>
              </div>

              {/* Dynamic Inputs grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/40 p-5 rounded-2xl border border-slate-100 relative">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                    {t.jobLabel}
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder={t.jobPlaceholder}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-850 placeholder-slate-400 focus:outline-hidden focus:border-[#FF4D2D]/60 focus:ring-4 focus:ring-[#FF4D2D]/5 transition-all duration-150"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                    {t.skillsLabel}
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder={t.skillsPlaceholder}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-850 placeholder-slate-400 focus:outline-hidden focus:border-[#FF4D2D]/60 focus:ring-4 focus:ring-[#FF4D2D]/5 transition-all duration-150"
                  />
                </div>

                {/* Sub configuration switches */}
                <div className="md:col-span-2 pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Mode select segment */}
                  <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                      {t.prepModeLabel}
                    </span>
                    <div className="flex border border-slate-200 rounded-xl p-1 bg-white select-none w-full sm:w-auto gap-0.5 mt-1">
                      <button
                        type="button"
                        onClick={() => setPrepMode("behavioral")}
                        className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                          prepMode === "behavioral"
                            ? "bg-slate-900 text-white"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {t.modeBehavioral}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrepMode("technical")}
                        className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                          prepMode === "technical"
                            ? "bg-[#FF4D2D] text-white"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {t.modeTechnical}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={generateAIQuestions}
                    disabled={loading || !jobTitle.trim()}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white border-none py-3 px-6 rounded-xl text-xs font-black transition-all active:scale-[0.98] duration-150 disabled:opacity-40 disabled:pointer-events-none shadow-sm flex items-center justify-center gap-2 cursor-pointer self-end"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={12} className="animate-spin text-white" />
                        <span>{t.btnGenerating}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} className="text-[#FF4D2D] animate-pulse" />
                        <span>{t.btnGenerate}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* LOADING STATE */}
              {loading && (
                <div className="py-16 border border-dashed border-slate-150 rounded-2xl flex flex-col items-center justify-center space-y-4 bg-slate-50/20 select-none">
                  <div className="relative flex items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-[#FF4D2D] relative z-10" />
                    <div className="absolute w-12 h-12 bg-indigo-500/10 rounded-full animate-ping blur-xs" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-black text-slate-800">
                      {isAr ? "جاري نسج محاكاة المقابلة بمستويات احترافية..." : "Formulating precise real-world simulations..."}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {isAr ? "تحليل الكلمات المفتاحية وضبط معايير المقابلة..." : "Analyzing structural competency keywords..."}
                    </p>
                  </div>
                </div>
              )}

              {/* QUESTIONS LIST */}
              {!loading && questions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
                      <BookOpen size={11} className="text-[#FF4D2D]" />
                      {isAr ? "الأسئلة المستهدفة المنتجة" : "Target mock question slate"}
                    </span>
                    <button 
                      onClick={generateAIQuestions}
                      className="text-[10px] font-black text-[#FF4D2D] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={10} className="animate-spin-slow" />
                      <span>{t.regenerate}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {questions.map((item, idx) => {
                      const isExpanded = activeIdx === idx;
                      const activeRec = !!isRecording[idx];
                      return (
                        <div
                          key={idx}
                          className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                            isExpanded 
                              ? "border-slate-300/80 bg-slate-50/30 shadow-[0_8px_30px_rgba(0,0,0,0.03)]" 
                              : "border-slate-200/60 bg-transparent hover:border-slate-300"
                          }`}
                        >
                          {/* Card Header Trigger */}
                          <button
                            onClick={() => setActiveIdx(isExpanded ? null : idx)}
                            className="w-full text-start p-4 sm:p-5 flex items-start gap-4 justify-between cursor-pointer select-none"
                          >
                            <div className="flex items-start gap-3">
                              <span className={`w-6 h-6 rounded-lg text-[10px] font-mono font-black flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                isExpanded ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                              }`}>
                                {idx + 1}
                              </span>
                              <span className="font-bold text-slate-800 text-xs sm:text-[13px] leading-relaxed">
                                {item.question}
                              </span>
                            </div>
                            <ChevronDown
                              size={15}
                              className={`text-slate-400 shrink-0 transition-transform duration-300 mt-1 ${isExpanded ? "rotate-180 text-slate-700" : ""}`}
                            />
                          </button>

                          {/* Expanded detail box */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t border-slate-100 bg-white"
                              >
                                <div className="p-4 sm:p-5 space-y-4">
                                  
                                  {/* Secret Tip */}
                                  {item.tip && (
                                    <div className="bg-indigo-50/40 border border-indigo-100/60 rounded-xl p-4 flex gap-3 text-xs leading-relaxed">
                                      <Lightbulb size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                                      <div className="space-y-0.5">
                                        <span className="font-black text-indigo-900 block font-sans">
                                          {t.recruiterTip}
                                        </span>
                                        <p className="font-semibold text-slate-600 font-sans">{item.tip}</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* STAR framework structure */}
                                  {item.answerOutline && (
                                    <div className="bg-emerald-50/30 border border-emerald-100/60 rounded-xl p-4 flex gap-3 text-xs leading-relaxed">
                                      <Award size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                                      <div className="space-y-0.5">
                                        <span className="font-black text-emerald-900 block font-sans">
                                          {t.starFormat}
                                        </span>
                                        <p className="font-semibold text-slate-650 font-sans">{item.answerOutline}</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* EXQUISITE VOCAL FEEDBACK MOCK STAGE */}
                                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-4 font-sans select-none">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                      <div className="space-y-0.5 text-start">
                                        <h5 className="text-[11px] font-black text-slate-700 flex items-center gap-1.5 uppercase font-mono">
                                          <Mic size={12} className="text-[#FF4D2D]" />
                                          {t.vocalSim}
                                        </h5>
                                        <p className="text-[10px] text-slate-400 font-bold">
                                          {t.vocalWarning}
                                        </p>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => toggleVoiceSimulator(idx)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-3xs ${
                                          activeRec 
                                            ? "bg-[#FF4D2D] text-white animate-pulse" 
                                            : "bg-slate-900 hover:bg-slate-800 text-white"
                                        }`}
                                      >
                                        {activeRec ? (
                                          <>
                                            <MicOff size={11} />
                                            <span>{t.vocalRecordStop}</span>
                                          </>
                                        ) : (
                                          <>
                                            <Mic size={11} className="text-white" />
                                            <span>{t.vocalRecordStart}</span>
                                          </>
                                        )}
                                      </button>
                                    </div>

                                    {/* simulated audio recorder bouncing active bars */}
                                    {activeRec && (
                                      <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 font-mono text-[11px] font-black text-[#FF4D2D]">
                                          <span className="w-1.5 h-1.5 bg-[#FF4D2D] rounded-full animate-ping shrink-0" />
                                          <span>{formatTimer(recordingSeconds)}</span>
                                        </div>
                                        {/* sound waves bouncing motion divs */}
                                        <div className="flex items-end gap-1 h-5 select-none">
                                          {[0.3, 0.7, 1.2, 0.5, 1.5, 0.8, 1.3, 0.4, 0.9, 1.1, 0.6].map((multiplier, i) => (
                                            <motion.div
                                              key={i}
                                              className="w-0.75 bg-[#FF4D2D] rounded-full"
                                              animate={{ height: ["4px", `${18 * multiplier}px`, "4px"] }}
                                              transition={{ duration: 0.95, delay: i * 0.08, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Draft practicing workspace */}
                                  <div className="space-y-1.5 text-start">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">
                                      {t.typeDraft}
                                    </label>
                                    <div className="relative">
                                      <textarea
                                        value={userDrafts[idx] || ""}
                                        onChange={(e) => setUserDrafts(prev => ({ ...prev, [idx]: e.target.value }))}
                                        rows={3}
                                        placeholder={isAr ? "اكتب أفكارك أو صغ إجابتك لتصحيح التوليف..." : "Formulate your narrative strategy here..."}
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#FF4D2D]/50 focus:bg-white focus:ring-4 focus:ring-[#FF4D2D]/5 transition-all duration-150"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => saveResponseDraft(idx)}
                                        className="absolute bottom-3.5 end-3 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer"
                                      >
                                        <PenTool size={9} />
                                        <span>{t.saveResponse}</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Practice Review Alerts */}
                                  {savedDrafts[idx] && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="bg-emerald-50 border border-emerald-150 p-3 rounded-xl flex items-center justify-between text-[11px] text-emerald-800 font-bold"
                                    >
                                      <span className="flex items-center gap-1.5">
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        {t.responseSaved}
                                      </span>
                                      <span className="text-[9px] uppercase tracking-wider font-mono opacity-80">{t.interactiveSuccess}</span>
                                    </motion.div>
                                  )}

                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* EMPTY WORKSPACE */}
              {!loading && questions.length === 0 && (
                <div className="border border-slate-200 rounded-2xl p-6 sm:p-10 text-center space-y-6 bg-slate-50/15 relative">
                  <div className="max-w-sm mx-auto space-y-3 select-none">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-800 flex items-center justify-center border border-slate-200 mix-blend-multiply mx-auto">
                      <Sparkle className="w-5 h-5 text-[#FF4D2D] animate-spin-slow" />
                    </div>
                    <h4 className="font-black text-slate-850 text-xs sm:text-[13px] tracking-tight leading-snug">
                      {t.emptyStateTitle}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold leading-relaxed">
                      {t.emptyStateSubtitle}
                    </p>
                  </div>

                  <div className="flex justify-center flex-wrap gap-2 text-[10px] font-bold text-slate-500 uppercase font-mono select-none">
                    <span className="bg-slate-100 p-1.5 rounded-md px-3 border"># {isAr ? "منهجية STAR" : "STAR framework"}</span>
                    <span className="bg-slate-100 p-1.5 rounded-md px-3 border"># {isAr ? "تحليل السيرة" : "BIO alignment"}</span>
                    <span className="bg-slate-100 p-1.5 rounded-md px-3 border"># {isAr ? "جاهزية المقابلة" : "HR standards"}</span>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 2: INTERACTIVE PREPARATION CHECKLIST */}
        <AnimatePresence mode="wait">
          {activeTab === "checklist" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 animate-gpu"
            >
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-1.5">
                  <CheckCircle2 className="text-indigo-600 w-4 h-4" />
                  <span>{t.checklistTitle}</span>
                </h3>
                <p className="text-xs text-slate-500 font-bold leading-normal">
                  {t.checklistDesc}
                </p>
              </div>

              {/* Progress slider HUD */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 select-none">
                <div className="space-y-1.5 text-center md:text-start w-full md:w-auto">
                  <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-700">
                      {isAr ? "مقياس جاهزية العمل الحالية:" : "Readiness progress matrix:"}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${
                      percentageCompleted === 100 
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                        : "bg-indigo-50 text-indigo-800 border border-indigo-100"
                    }`}>
                      {percentageCompleted}% {isAr ? "مستعد" : "Ready"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">
                    {isAr
                      ? `${completedCount} من أصل ${totalChecklist} مهام تدريب منجزة بنجاح.`
                      : `${completedCount} of ${totalChecklist} prep steps satisfied.`}
                  </p>
                </div>

                {/* Progress bar container */}
                <div className="w-full md:w-56 bg-slate-200 rounded-full h-2 relative overflow-hidden shrink-0">
                  <motion.div 
                    className={`h-full rounded-full bg-gradient-to-r ${percentageCompleted === 100 ? "from-emerald-500 to-teal-400" : "from-[#FF4D2D] to-indigo-500"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentageCompleted}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Checklist grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {checklistItems.map((item) => {
                  const checked = !!checkedItems[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`p-4 rounded-2xl text-start transition-all duration-200 border flex gap-3 cursor-pointer group select-none relative overflow-hidden ${
                        checked 
                          ? "bg-slate-900 border-slate-900 text-white shadow-xs" 
                          : "bg-white border-slate-200 hover:bg-slate-50/50 hover:border-slate-300 text-slate-800"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                        checked 
                          ? "bg-white text-slate-950" 
                          : "border border-slate-300 group-hover:border-slate-400 bg-white"
                      }`}>
                        {checked && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                      </div>
                      <div className="space-y-1">
                        <h6 className={`text-xs font-black transition-colors ${checked ? "text-white" : "text-slate-850"}`}>
                          {item.title}
                        </h6>
                        <p className={`text-[10px] leading-relaxed font-bold ${checked ? "text-slate-300/90" : "text-slate-500"}`}>
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {percentageCompleted === 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl text-center text-xs font-black text-emerald-800 flex items-center justify-center gap-2 select-none"
                >
                  <span>🎉</span>
                  <span>{t.readyBanner}</span>
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
