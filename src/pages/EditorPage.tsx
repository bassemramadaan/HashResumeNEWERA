import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { trackEvent, FUNNEL_EVENTS } from "../utils/analytics";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "motion/react";
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Download,
  LayoutTemplate,
  Target,
  CheckCircle2,
  Maximize2,
  X,
  FileText,
  Sparkles,
  ArrowUp,
  Settings,
  ArrowRight,
  Award,
  Lock,
} from "lucide-react";
import { useResumeStore, ResumeData, getResumeSignature } from "../store/useResumeStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { Link } from "react-router-dom";
import { translations } from "../i18n/translations";
import SettingsModal from "../components/SettingsModal";
import KeyboardShortcutsModal from "../components/KeyboardShortcutsModal";
import { cn } from "@/lib/utils";
import { calculateATSScore } from "../utils/ats";
import { generateWord } from "../utils/generateWord";
import { DEFAULT_BREAKDOWN } from "../constants";
import EditorNavbar from "../components/editor/EditorNavbar";
import EditorSidebar from "../components/editor/EditorSidebar";
import MobileEditorLayout from "../components/editor/MobileEditorLayout";
import ResumePreview from "../components/preview/ResumePreview";
import CoverLetterPreview from "../components/preview/CoverLetterPreview";
import UniversalCommandBar from "../components/editor/UniversalCommandBar";
import ATSHealthGauge from "../components/editor/ATSHealthGauge";

// Lazy load heavy components
const PersonalInfoForm = lazy(
  () => import("../components/editor/PersonalInfoForm"),
);
const ExperienceForm = lazy(
  () => import("../components/editor/ExperienceForm"),
);
const EducationForm = lazy(() => import("../components/editor/EducationForm"));
const SkillsForm = lazy(() => import("../components/editor/SkillsForm"));
const ProjectsForm = lazy(() => import("../components/editor/ProjectsForm"));
const CertificationsForm = lazy(() => import("../components/editor/CertificationsForm"));
const ATSAudit = lazy(() => import("../components/editor/ATSAudit"));
const CoverLetterForm = lazy(
  () => import("../components/editor/CoverLetterForm"),
);
const FinishStep = lazy(() => import("../components/editor/FinishStep"));
const PaymentModal = lazy(() => import("../components/payment/PaymentModal"));
const PostDownloadModal = lazy(
  () => import("../components/payment/PostDownloadModal"),
);
const FeedbackModal = lazy(() => import("../components/FeedbackModal"));
const ResumeCheckerModal = lazy(
  () => import("../components/editor/ResumeCheckerModal"),
);
const LinkedInImportModal = lazy(
  () => import("../components/editor/LinkedInImportModal"),
);

const FormLoader = () => (
  <div className="space-y-6 w-full animate-pulse opacity-60">
    <div className="flex items-center justify-between">
      <div className="h-8 w-40 bg-slate-200 rounded-lg"></div>
      <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
    </div>
    <div className="bg-white border border-slate-200 rounded-2xl h-40 w-full shadow-sm"></div>
    <div className="bg-white border border-slate-200 rounded-2xl h-40 w-full shadow-sm"></div>
  </div>
);

type Tab =
  | "basics"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "cover-letter"
  | "finish"
  | "review";

interface TabItem {
  id: Tab;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  tourId?: string;
}

const ProgressTrackerModal = ({
  isOpen,
  onClose,
  data,
  activeTab,
  onJumpToStep,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  activeTab: string;
  onJumpToStep: (id: string) => void;
}) => {
  const { language } = useLanguageStore();
  const t = translations[language].editor.progressTracker;

  const steps = [
    {
      id: "basics",
      label: String(t.steps.basics || "Basic Info"),
      icon: User,
      done: !!(data.personalInfo.fullName && data.personalInfo.email),
    },
    {
      id: "experience",
      label: String(t.steps.experience || "Experience"),
      icon: Briefcase,
      done: data.experience.length > 0,
    },
    {
      id: "education",
      label: String(t.steps.education || "Education"),
      icon: GraduationCap,
      done: data.education.length > 0,
    },
    {
      id: "skills",
      label: String(t.steps.skills || "Skills"),
      icon: Wrench,
      done: data.skills.length > 0,
    },
    {
      id: "finish",
      label: String(t.steps.polish || "Review & Polish"),
      icon: Target,
      done: false,
    },
  ];

  const filledCount = steps.filter((s) => s.done).length;
  const progressPercent = Math.round((filledCount / (steps.length - 1)) * 100);
  const estimatedTime =
    progressPercent === 100 ? 0 : progressPercent > 50 ? 2 : 5;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-neutral-50 rounded-3xl shadow-2xl overflow-hidden border border-neutral-200"
          >
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl mb-4">
                  <Target size={32} />
                </div>
                <h2 className="text-2xl font-black text-neutral-900 mb-2">
                  {String(t.title || "")}
                </h2>
                <p className="text-neutral-500 text-sm">{String(t.subtitle || "")}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-neutral-400 mb-2 px-1">
                  <span>{progressPercent}% Complete</span>
                  <span>
                    {estimatedTime > 0
                      ? String(t.estimatedTime || "").replace(
                          "{time}",
                          estimatedTime.toString(),
                        )
                      : String(t.ready || "")}
                  </span>
                </div>
                <div className="h-3 bg-neutral-100 rounded-full overflow-hidden mb-8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-brand-500"
                  />
                </div>

                <div className="grid gap-3">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const isActive = activeTab === step.id;
                    return (
                      <button
                        key={step.id}
                        onClick={() => {
                          onJumpToStep(step.id);
                          onClose();
                        }}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-2xl border transition-all text-start group",
                          isActive
                            ? "bg-white border-slate-300 shadow-md ring-1 ring-slate-100/50"
                            : "bg-transparent border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200",
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            step.done
                              ? "bg-emerald-50 text-emerald-600"
                              : isActive
                                ? "bg-slate-900 text-white"
                                : "bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200",
                          )}
                        >
                          {step.done ? (
                            <CheckCircle2 size={20} />
                          ) : (
                            <Icon size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-0.5">
                            {step.id}
                          </div>
                          <div
                            className={cn(
                              "text-sm font-semibold",
                              isActive ? "text-neutral-900" : "text-neutral-600",
                            )}
                          >
                            {step.label}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-8 bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 active:scale-95"
              >
                Continue Building
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


const ATS_SECTION_TIPS: Record<string, Record<string, { title: string; tips: string[] }>> = {
  ar: {
    basics: {
      title: "💡 نصائح المعلومات الشخصية لـ ATS متميز",
      tips: [
        "استخدم بريداً إلكترونياً مهنياً ومباشراً.",
        "احرص على إضافة رابط ملفك على LinkedIn ومعرض أعمالك.",
        "تجنب تضمين معلومات زائدة مثل الحالة الاجتماعية أو الديانة لضمان المهنية."
      ]
    },
    experience: {
      title: "💡 نصائح الخبرة العملية لـ ATS متميز",
      tips: [
        "ابدأ كل نقطة عمل بفعل حركة قوي (طوّرت، أدرت، حققت) وتجنب 'كنت مسؤولا عن'.",
        "أضف أرقاماً ونتائج ملموسة تُظهر حجم إنجازاتك (مثال: زيادة الأداء بنسبة 25%).",
        "رتب خبراتك من الأحدث إلى الأقدم بشكل تسلسلي واضح."
      ]
    },
    education: {
      title: "💡 نصائح التعليم لـ ATS متميز",
      tips: [
        "اذكر المسمى الرسمي للشهادة والتخصص والجامعة بدقة كامة.",
        "إذا كان معدلك التراكمي متميزاً (جيّد جداً فما فوق)، قم بتضمينه.",
        "أضف أي مشاريع تخرج مميزة أو مساقات أكاديمية متقدمة ذات صلة."
      ]
    },
    skills: {
      title: "💡 نصائح المهارات لـ ATS متميز",
      tips: [
        "احرص على إدراج الكلمات المفتاحية الصريحة المطلوبة للوظيفة ليتجاوز الـ ATS بسهولة.",
        "قم بتصنيف مهاراتك بشكل متوازن بين تقنية متخصصة وشخصية تفاعلية.",
        "اكتب أسماء المهارات والتقنيات بصيغتها الرسمية المتعارف عليها صناعياً."
      ]
    },
    projects: {
      title: "💡 نصائح المشاريع لـ ATS متميز",
      tips: [
        "وضح المشكلة التي قمت بحلها، المعمارية والتقنيات الأساسية بوضوح.",
        "أضف روابط برمجية حية لمستودع الكود (GitHub/GitLab) لتسهيل مراجعتها.",
        "ركز على المشاريع التي تبرز عملك الفردي والجماعي وتكامل التقنيات."
      ]
    },
    certifications: {
      title: "💡 نصائح الشهادات لـ ATS متميز",
      tips: [
        "اذكر الجهة المانحة الرسمية المعتمدة (مثل Google, AWS, Cisco, Microsoft).",
        "اكتب تاريخ الحصول والمسمى الكامل للشهادة بدقة تامة لزيادة الموثوقية.",
        "أعطِ الأولوية للشهادات المرتبطة مباشرة بالشاغر الوظيفي المستهدف."
      ]
    },
    custom: {
      title: "💡 نصائح الأقسام المخصصة لـ ATS متميز",
      tips: [
        "اجعل عناوين الأقسام احترافية ومباشرة (مثل اللغات، العمل التطوعي، الأنشطة القيادية).",
        "استغل هذا القسم لعرض اللغات التي تجيدها ومستوى الطلاقة الخاص بك فيه.",
        "تأكد من ملاءمة هذا القسم وتوافقه مع ثقافة ونوعية الشركات المستهدفة."
      ]
    },
    "cover-letter": {
      title: "💡 نصائح خطاب التقديم لـ ATS متميز",
      tips: [
        "تأكد من مخاطبة الشركة أو مسؤول التوظيف بالاسم لزيادة الاهتمام المباشر.",
        "استخدم الذكاء الاصطناعي المدمج لصياغة خطاب رصين متطابق مع متطلبات الوظيفة.",
        "وضح شغفك وقدرتك الفريدة على سد ثغرة حقيقية داخل فريق الشركة."
      ]
    },
    finish: {
      title: "💡 التدقيق النهائي ومراجعة الـ ATS",
      tips: [
        "تأكد التام خلو سيرتك من أي أخطاء إملائية أو لغوية (قم بقراءتها أكثر من مرة).",
        "احرص أن تكون السيرة مضغوطة في صفحة واحدة ممتلئة وغنية (أو صفحتين كحد أقصى).",
        "قم بالتصدير بصيغة PDF لضمان بقاء الخطوط والتصميم دون أي خلل بالمخابرات والـ ATS."
      ]
    }
  },
  en: {
    basics: {
      title: "💡 Personal Info Tips for ATS Success",
      tips: [
        "Use a professional, clean email address (e.g., name@domain.com).",
        "Be sure to include active links to your LinkedIn profile and portfolio.",
        "Excluding redundant facts like marital status ensures maximum professional focus."
      ]
    },
    experience: {
      title: "💡 Experience Tips for ATS Success",
      tips: [
        "Always initiate descriptions with active verb directives (e.g., Developed, Optimized, Promoted).",
        "Quantify your career successes with metrics (e.g., cut operating costs by 15%).",
        "Maintain strict reverse-chronological structuring (newest first)."
      ]
    },
    education: {
      title: "💡 Education Tips for ATS Success",
      tips: [
        "Document exact degree designations, concentrations, and the educational institution.",
        "Reference honors, excellent GPA scores, or research accomplishments.",
        "Mention academic course paths aligned with target keywords."
      ]
    },
    skills: {
      title: "💡 Skills & Expertise Tips for ATS Success",
      tips: [
        "Focus on exact domain terms from the target job post.",
        "Provide a rich mix of specialized technical skills and behavioral soft skills.",
        "State technical names in standard industry format (e.g., TypeScript, SQL)."
      ]
    },
    projects: {
      title: "💡 Projects Tips for ATS Success",
      tips: [
        "Outline the concrete challenges solved, toolsets utilized, and final outcomes.",
        "Supply reachable URL resources to production hosts or GitHub codebases.",
        "Emphasize projects exhibiting advanced backend/frontend capability."
      ]
    },
    certifications: {
      title: "💡 Certifications Tips for ATS Success",
      tips: [
        "Highlight certifications from recognized authorities (AWS, Cisco, Google, etc.).",
        "State the exact official certification titles and completion dates.",
        "Filter out basic coursework to spotlight high-value credentials."
      ]
    },
    custom: {
      title: "💡 Custom Sections Tips for ATS Success",
      tips: [
        "Keep section headings concise, direct, and globally understood.",
        "Highly recommended for languages with corresponding fluency targets.",
        "Add volunteer achievements to exhibit leadership and community commitment."
      ]
    },
    "cover-letter": {
      title: "💡 Cover Letter Tips for ATS Success",
      tips: [
        "Tailor the header to directly index the hiring manager or recruiter name.",
        "Incorporate highly focused role summaries with the built-in generator.",
        "Briefly declare your long-term goals and direct cultural fit."
      ]
    },
    finish: {
      title: "💡 Final Checklist & Export Tips",
      tips: [
        "Review closely to catch and eliminate grammar and spacing discrepancies.",
        "Optimize page real estate to fit cleanly into 1 or 2 standard A4 pages.",
        "Export in PDF to verify styling persists on recruiter screening tools."
      ]
    }
  }
};


export default function EditorPage() {
  const { language, dir, setLanguage } = useLanguageStore();
  const t = (translations[language as keyof typeof translations] || translations.en).editor;

  const formRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>("basics");
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isTipsOpen, setIsTipsOpen] = useState(true);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const [showScoreChecklist, setShowScoreChecklist] = useState(false);
  const [showAIBanner, setShowAIBanner] = useState(true);
  const [showWelcomeProgress, setShowWelcomeProgress] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hashresume_hide_welcome_progress") !== "true";
    }
    return true;
  });
  const [showSmartImportCard, setShowSmartImportCard] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hashresume_hide_smart_import_card") !== "true";
    }
    return true;
  });

  const [focusMode, setFocusMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("focusMode") === "true";
    }
    return false;
  });

  const [showAtsPanel, setShowAtsPanel] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hashresume_show_ats_panel") !== "false";
    }
    return true;
  });

  const handleToggleAtsPanel = () => {
    setShowAtsPanel((prev) => {
      const next = !prev;
      localStorage.setItem("hashresume_show_ats_panel", String(next));
      return next;
    });
  };

  useEffect(() => {
    localStorage.setItem("focusMode", String(focusMode));
  }, [focusMode]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDesktop = window.innerWidth > 768;
      setIsIntroExpanded(isDesktop);
      setIsTipsOpen(isDesktop);
    }
  }, []);

  // Keyboard-Aware dynamic focus auto-scrolling for mobile devices
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        setTimeout(() => {
          target.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 220);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: "instant" as any });
    }
  }, [activeTab]);
  


  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleFormScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 300);
  };

  const scrollToFormTop = () => {
    formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPostDownloadModal, setShowPostDownloadModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showResumeChecker, setShowResumeChecker] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    show: boolean;
    step: number;
    format: "pdf" | "docx" | "txt";
  } | null>(null);
  const [overflowLines, setOverflowLines] = useState(0);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "load" | "clear";
    message: string;
  } | null>(null);
  const [previewMode, setPreviewMode] = useState<"resume" | "cover-letter">(
    "resume",
  );
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  const fullName = useResumeStore((state) => state.data.personalInfo.fullName);
  const data = useResumeStore((state) => state.data);
  const isPremium = React.useMemo(() => {
    if (!data.isPremium) return false;
    
    // Check if we have an unlocked signature stored. If we do, do a total data matching.
    if (data.unlockedSignature) {
      return getResumeSignature(data) === data.unlockedSignature;
    }
    
    // Fallback comparison for name & email
    const nameMatch = !data.unlockedName || 
      data.unlockedName.trim().toLowerCase() === (data.personalInfo.fullName || "").trim().toLowerCase();
    const emailMatch = !data.unlockedEmail || 
      data.unlockedEmail.trim().toLowerCase() === (data.personalInfo.email || "").trim().toLowerCase();
      
    return nameMatch && emailMatch;
  }, [data]);
  const loadExampleData = useResumeStore((state) => state.loadExampleData);
  const resetData = useResumeStore((state) => state.resetData);

  const isEmpty = 
    !data.personalInfo?.fullName && 
    !data.personalInfo?.email &&
    !data.personalInfo?.phone &&
    !data.personalInfo?.summary &&
    (!data.experience || data.experience.length === 0) && 
    (!data.education || data.education.length === 0) && 
    (!data.skills || data.skills.length === 0);

  const { score: atsScore } = React.useMemo(() => {
    if (isEmpty) return { score: 0, criticalFailures: [], tips: [] };
    try {
      return calculateATSScore(data);
    } catch (e) {
      console.error("ATS Audit failed", e);
      return { score: 0, criticalFailures: [], tips: [] };
    }
  }, [data, isEmpty]);

  const breakdown = React.useMemo(() => {
    return DEFAULT_BREAKDOWN.map((b, i) => {
      let done = false;
      if (i === 0) done = !!(data.personalInfo?.email && data.personalInfo?.phone);
      else if (i === 1) done = !!(data.personalInfo?.summary && data.personalInfo.summary.length > 20);
      else if (i === 2) done = !!(data.experience && data.experience.length > 0);
      else if (i === 3) done = !!(data.skills && data.skills.length >= 5);
      else if (i === 4) done = !!(data.education && data.education.length > 0);
      else if (i === 5) done = !!(data.skills && data.skills.length >= 5 && data.experience && data.experience.length > 0);
      return { ...b, done };
    });
  }, [data]);

  useEffect(() => {
    trackEvent(FUNNEL_EVENTS.EDITOR_START, { language });
  }, [language]);

  useEffect(() => {
    if (showFullPreview) {
      trackEvent(FUNNEL_EVENTS.PREVIEW_OPENED, { language });
    }
  }, [showFullPreview, language]);

  useEffect(() => {
    if (showPaymentModal) {
      trackEvent(FUNNEL_EVENTS.PAYMENT_CLICK, { language });
    }
  }, [showPaymentModal, language]);

  useEffect(() => {
    if (data.settings?.template) {
      trackEvent(FUNNEL_EVENTS.TEMPLATE_CHOSEN, {
        templateId: data.settings.template,
      });
    }
  }, [data.settings?.template]);

  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    setIsSaving(true);
    const endTimer = setTimeout(() => {
      setIsSaving(false);
    }, 800);
    return () => clearTimeout(endTimer);
  }, [data]);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Safe temporal subscription
  const [temporalState, setTemporalState] = useState({
    canUndo: false,
    canRedo: false,
  });

  useEffect(() => {
    // Check if temporal exists before subscribing
    if (!useResumeStore.temporal) return;
    
    // Initial state
    const updateTemporalState = () => {
      const state = useResumeStore.temporal.getState();
      setTemporalState({
        canUndo: state.pastStates.length > 0,
        canRedo: state.futureStates.length > 0,
      });
    };
    
    updateTemporalState();
    
    // Subscribe to changes
    const unsubscribe = useResumeStore.temporal.subscribe(updateTemporalState);
    return () => unsubscribe();
  }, []);

  const handleUndo = () => useResumeStore.temporal?.getState().undo();
  const handleRedo = () => useResumeStore.temporal?.getState().redo();

  // Real-time Page Overflow Detector
  useEffect(() => {
    const checkOverflow = () => {
      if (componentRef.current) {
        const height = componentRef.current.scrollHeight;
        const pageHeight = 1125; // A4 height limit at 96 DPI
        if (height > pageHeight) {
          const lines = Math.max(1, Math.round((height - pageHeight) / 22));
          setOverflowLines(lines);
        } else {
          setOverflowLines(0);
        }
      }
    };
    const timer = setTimeout(checkOverflow, 400);
    const interval = setInterval(checkOverflow, 2000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [data]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          if (temporalState.canRedo) handleRedo();
        } else {
          if (temporalState.canUndo) handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        if (temporalState.canRedo) handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [temporalState.canUndo, temporalState.canRedo]);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${fullName || "Resume"}_CV`,
    onAfterPrint: () => {
      setShowPostDownloadModal(true);
      setTimeout(() => setShowFeedbackModal(true), 2000);
    },
  });

  const handleExportClick = () => {
    setShowResumeChecker(true);
  };

  const handleProceedToExport = async (
    format: "pdf" | "docx" | "txt" = "pdf",
  ) => {
    setShowResumeChecker(false);
    if (!isPremium) {
      setShowPaymentModal(true);
      return;
    }

    setExportStatus({ show: true, step: 0, format });

    // Helper to simulate elegant delays to give sense of premium craftsmanship
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    if (format === "pdf") {
      try {
        setExportStatus({ show: true, step: 1, format }); // "Formatting margins & aligning..."
        await sleep(1000);

        setExportStatus({ show: true, step: 2, format }); // "Optimizing premium typography..."
        await sleep(1000);

        const htmlContent = componentRef.current?.innerHTML;
        const styles = Array.from(
          document.head.querySelectorAll('style, link[rel="stylesheet"]'),
        )
          .map((el) => el.outerHTML)
          .join("\n");

        setExportStatus({ show: true, step: 3, format }); // "Assembling PDF stream..."
        await sleep(1000);

        const response = await fetch("/api/pdf/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            html: `<div class="p-8">${htmlContent}</div>`,
            css: styles,
          }),
        });

        if (!response.ok) throw new Error("PDF generation failed");

        setExportStatus({ show: true, step: 4, format }); // "Finalizing file encoding..."
        await sleep(600);

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fullName || "Resume"}_CV.pdf`;
        link.click();
        
        useResumeStore.getState().lockResume();

        setExportStatus({ show: true, step: 5, format }); // "SUCCESS!"
        await sleep(1200);

        setExportStatus(null);
        setShowPostDownloadModal(true);
        setTimeout(() => setShowFeedbackModal(true), 2000);
      } catch (err) {
        console.error(
          "Server PDF Generation Failed. Falling back to client-side. Error:",
          err,
        );
        setExportStatus(null);
        handlePrint();
        useResumeStore.getState().lockResume();
      }
    } else if (format === "docx") {
      try {
        setExportStatus({ show: true, step: 1, format });
        await sleep(800);
        setExportStatus({ show: true, step: 3, format });
        await sleep(800);
        generateWord(useResumeStore.getState().data);
        useResumeStore.getState().lockResume();
        setExportStatus({ show: true, step: 5, format });
        await sleep(1000);
        setExportStatus(null);
      } catch (e) {
        console.error("Word gen err:", e);
        setExportStatus(null);
      }
    } else if (format === "txt") {
      try {
        setExportStatus({ show: true, step: 1, format });
        await sleep(550);
        const data = useResumeStore.getState().data;
        const text = `${data.personalInfo.fullName}\n${data.personalInfo.email}\n${data.personalInfo.phone}\n\nEXPERIENCE\n${data.experience
          .map((exp) => `${exp.position} at ${exp.company}\n${exp.description}`)
          .join("\n\n")}`;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${data.personalInfo.fullName || "resume"}.txt`;
        link.click();
        useResumeStore.getState().lockResume();
        setExportStatus({ show: true, step: 5, format });
        await sleep(1000);
        setExportStatus(null);
      } catch (e) {
        console.error("Txt gen err:", e);
        setExportStatus(null);
      }
    }
  };

  const tabs: TabItem[] = [
    {
      id: "basics",
      label: String(language === "ar" ? "المعلومات الشخصية" : "Personal Information"),
      shortLabel: String(language === "ar" ? "البيانات" : "Basics"),
      icon: User,
      tourId: "personal-info",
    },
    {
      id: "experience",
      label: String(language === "ar" ? "الخبرة العملية" : "Experience"),
      shortLabel: String(language === "ar" ? "الخبرة" : "Exp"),
      icon: Briefcase,
      tourId: "experience-section",
    },
    {
      id: "education",
      label: String(language === "ar" ? "التعليم" : "Education"),
      shortLabel: String(language === "ar" ? "التعليم" : "Edu"),
      icon: GraduationCap,
      tourId: "education-section",
    },
    {
      id: "skills",
      label: String(language === "ar" ? "المهارات" : "Skills"),
      shortLabel: String(language === "ar" ? "المهارات" : "Skills"),
      icon: Wrench,
      tourId: "skills-section",
    },
    {
      id: "certifications",
      label: String(language === "ar" ? "الشهادات" : "Certifications"),
      shortLabel: String(language === "ar" ? "الشهادات" : "Certs"),
      icon: Award,
      tourId: "certifications-section",
    },
    {
      id: "cover-letter",
      label: String(language === "ar" ? "خطاب التقديم" : "Cover Letter"),
      shortLabel: String(language === "ar" ? "الخطاب" : "Cover"),
      icon: FileText,
      tourId: "cover-letter-section",
    },
    {
      id: "finish",
      label: String(language === "ar" ? "التحميل والتدقيق" : "Audit & Download"),
      shortLabel: String(language === "ar" ? "تحميل" : "Finish"),
      icon: Download,
      tourId: "review-section",
    },
  ];

  const activeTabIndex = tabs.findIndex((t) => t.id === activeTab) + 1;

  const tabDescriptions: Record<Tab, string> = {
    basics: String(t.basicsDesc || "Basic info"),
    experience: String(t.experienceDesc || "Experience info"),
    education: String(t.educationDesc || "Education info"),
    skills: String(t.skillsDesc || "Skills info"),
    projects: String(language === "ar" ? "أضف مشاريعك التي عملت عليها" : "Add projects you've worked on"),
    certifications:
      String(language === "ar"
        ? "أضف الشهادات والإنجازات المهنية."
        : "Add professional certifications and achievements."),
    "cover-letter": String(t.coverLetterDesc || "Cover letter info"),
    finish: String(t.finishDesc || "Finish info"),
    review: String(t.finishDesc || "Finish info"),
  };

  const sidebarCompletionMap: Record<string, number> = {
    basics: data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.jobTitle ? 100 : (data.personalInfo.fullName || data.personalInfo.email ? 50 : 0),
    experience: data.experience && data.experience.length > 0 ? 100 : 0,
    education: data.education && data.education.length > 0 ? 100 : 0,
    skills: data.skills && data.skills.length > 0 ? 100 : 0,
    certifications: data.certifications && data.certifications.length > 0 ? 100 : 0,
    "cover-letter": data.coverLetter?.generatedContent ? 100 : 0,
    finish: atsScore,
  };

  const formContent = (
    <div className={cn(focusMode ? "max-w-[720px]" : "max-w-4xl", "mx-auto pb-[120px] sm:pb-32 relative")}>
      {/* Dynamic Persistent Resume Completion Progress Bar */}
      {!focusMode && showWelcomeProgress && (
        <div className="mb-6 bg-[#FFF7F5] border border-[#FFD5CB] text-[#001639] rounded-xl p-4.5 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.01)] relative overflow-hidden group select-none pr-10 rtl:pl-10">
          <button
            onClick={() => {
              setShowWelcomeProgress(false);
              localStorage.setItem("hashresume_hide_welcome_progress", "true");
            }}
            className="absolute top-3 right-3 rtl:left-3 rtl:right-auto w-6 h-6 rounded-full bg-slate-950/5 hover:bg-slate-950/10 text-slate-700 hover:text-slate-900 flex items-center justify-center font-bold text-[10px] cursor-pointer border border-transparent hover:border-slate-300/30 transition-all z-20"
            title={language === "ar" ? "إغلاق" : "Close"}
          >
            ✕
          </button>
          <div className="absolute inset-0 bg-radial-gradient(circle at top right, rgba(255, 77, 45, 0.08), transparent 70%) pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF4D2D]/10 flex items-center justify-center border border-[#FF4D2D]/20 shrink-0">
                <Sparkles className="w-5 h-5 text-[#FF4D2D] animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#001639] leading-tight font-sans">
                  {atsScore < 25 ? (
                    language === "ar" ? (
                      "ابدأ بمعلوماتك الأساسية — 5 خطوات للسيرة المثالية ✨"
                    ) : language === "fr" ? (
                      "Commencez par vos infos de base — 5 étapes pour un CV parfait ✨"
                    ) : (
                      "Start with your basic information — 5 steps to the perfect resume ✨"
                    )
                  ) : (
                    language === "ar" ? (
                      <>سيرتك الذاتية ممتازة ومكتملة بنسبة <span className="text-[#FF4D2D] text-base font-extrabold">{atsScore}%</span>! استمر في الإضافة لتخطي الفلاتر 🚀</>
                    ) : language === "fr" ? (
                      <>Votre CV est complété à <span className="text-[#FF4D2D] text-base font-extrabold">{atsScore}%</span> — continuez pour le rendre parfait ! 🚀</>
                    ) : (
                      <>Excellent! Your resume is <span className="text-[#FF4D2D] text-base font-extrabold">{atsScore}%</span> complete — keep going to make it perfect! 🚀</>
                    )
                  )}
                </h4>
                <p className="text-[10px] text-[#001639]/70 font-semibold mt-0.5 font-sans">
                  {language === "ar" 
                    ? "املأ حقول الخبرات العملية والتعليم لرفع نسبة تخطي أنظمة الفرز والحصول على فرصتك المثالية!"
                    : "Fill in experience and education fields to bypass automatic recruiter filters and land top-tier interviews!"}
                </p>
              </div>
            </div>
            
            <div className="flex-1 max-w-xs w-full">
              <div className="flex justify-between items-center mb-1.5 text-[10px] text-[#001639]/70 font-extrabold font-sans">
                <span>{language === "ar" ? "نسبة الاكتمال" : "Completion Progress"}</span>
                <span className="text-[#001639] font-black">{atsScore}%</span>
              </div>
              <div className="h-2.5 bg-[#FF4D2D]/5 rounded-full overflow-hidden border border-[#FFD5CB]/60 p-[1px]">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-[#FF4D2D] relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${atsScore}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Auto-Parser Onboarding Step Card */}
      {activeTab === "basics" && showSmartImportCard && (
        <div className="mb-6 bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-brand-500/10 border border-brand-500/20 rounded-[2rem] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs hover:shadow-md transition-all duration-300 relative pr-10 rtl:pl-10">
          <button
            onClick={() => {
              setShowSmartImportCard(false);
              localStorage.setItem("hashresume_hide_smart_import_card", "true");
            }}
            className="absolute top-4 right-4 rtl:left-4 rtl:right-auto w-6 h-6 rounded-full bg-slate-950/5 hover:bg-slate-950/10 text-slate-700 hover:text-slate-900 flex items-center justify-center font-bold text-[10px] cursor-pointer border border-transparent hover:border-slate-300/30 transition-all z-20"
            title={language === "ar" ? "إغلاق" : "Close"}
          >
            ✕
          </button>
          <div className="flex items-center gap-3.5 text-start">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-brand-500/30 shrink-0 shadow-xs">
              <Sparkles className="w-6 h-6 text-brand-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-950 tracking-tight leading-snug">
                {language === "ar" ? "عندك CV قديم؟ ارفعه وهنملا كل حاجة ✨" : "Have an old CV? Upload it and we will fill everything ✨"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed max-w-xl">
                {language === "ar" ? "مستخلص السير الذاتية الذكي بالذكاء الاصطناعي (PDF): ارفع ملف سيرتك القديمة أو ملف لينكد إن وسنقوم بملء الحقول تلقائياً وبأمان." : "Smart AI Auto-Parser: Drag/drop your old layout PDF or LinkedIn profile, and watch Gemini populate all fields instantly."}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLinkedInModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex justify-center items-center gap-2 bg-slate-900 hover:bg-black text-white shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Sparkles size={14} />
            {language === "ar" ? "ابدأ الاستيراد الذكي" : "Start Smart Import"}
          </button>
        </div>
      )}
      {data.isLocked && (
        <div className="absolute inset-0 z-[100] bg-white/70 backdrop-blur-md flex items-center justify-center rounded-[2rem] mx-[-1rem] px-4" style={{ height: 'max-content', minHeight: '100%' }}>
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_24px_70px_-15px_rgba(0,0,0,0.18)] max-w-md w-full text-center border border-slate-200 relative overflow-hidden mt-20">
             <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-slate-700 to-slate-900 overflow-hidden" />
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-200">
               <Lock className="w-10 h-10 text-slate-700" />
             </div>
             <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
               {language === 'ar' ? 'تم تأمين السيرة الذاتية' : 'Resume Locked'}
             </h2>
             <p className="text-sm text-slate-500 mb-8 font-semibold leading-relaxed">
               {language === 'ar' 
                 ? 'لقد قمت بتصدير وتحميل هذه السيرة الذاتية بنجاح. لضمان الموثوقية ولاستخدام لمرة واحدة، تم تأمين هذا الملف ولا يمكن العودة لتعديله مرة أخرى. إذا كنت بحاجة لإنشاء ملف جديد والمزيد من التعديلات، يرجى مسح البيانات والبدء من جديد.' 
                 : 'You have successfully exported this resume. To ensure integrity for a one-time export, this file is permanently locked and cannot be edited. If you need to make new edits or create another resume, please reset your data and start fresh.'}
             </p>
             <button 
               onClick={() => setConfirmAction({ type: "clear", message: t.clearConfirm })} 
               className="bg-slate-900 hover:bg-black text-white font-black text-sm px-6 py-3.5 rounded-xl w-full transition-all active:scale-95 shadow-md shadow-slate-900/20"
             >
               {language === 'ar' ? 'مسح البيانات والبدء من جديد (Reset)' : 'Reset Data and Start Fresh'}
             </button>
          </div>
        </div>
      )}
      
                {/* Tab instructions header moved inside scroll area */}
                <div className="pb-6">
                  <motion.div
                    layout
                    key={"tab-" + activeTab}
                    className="bg-white dark:bg-neutral-0 rounded-[2rem] border border-[#E8E6DF] dark:border-neutral-200 shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 transform-gpu"
                  >
                    {/* Header / Toggle Row */}
                    <div 
                      onClick={() => setIsIntroExpanded(!isIntroExpanded)}
                      className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/40 dark:hover:bg-neutral-50/10 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0 text-start">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 shadow-slate-900/10 ring-4 ring-slate-50 dark:ring-neutral-50 border border-white/20">
                          <Sparkles size={16} className="text-white animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-[10px] sm:text-xs font-black text-slate-800 dark:text-neutral-800 uppercase tracking-wider">
                              {String(tabs.find((t) => t.id === activeTab)?.label || "")}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-neutral-600 font-extrabold bg-slate-100 dark:bg-neutral-200 px-1.5 py-0.5 rounded-md text-slate-400">
                              {activeTabIndex} / {tabs.length}
                            </span>
                            {activeTab === "basics" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsLinkedInModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-[#FF4D2D] text-[9px] font-black px-2 py-0.5 rounded-full border border-rose-200/50 active:scale-95 transition-all cursor-pointer shadow-2xs leading-none"
                              >
                                <Sparkles size={8} className="animate-pulse" />
                                {language === "ar" ? "الاستيراد الذكي ✨" : "Smart Import ✨"}
                              </button>
                            )}
                          </div>
                          <h1 className={cn("text-xs sm:text-base font-black text-neutral-900 dark:text-neutral-900 tracking-tight leading-snug", isIntroExpanded ? "whitespace-normal text-balance" : "truncate")}>
                            {isIntroExpanded 
                              ? String(tabDescriptions[activeTab] || "") 
                              : (language === "ar" ? "اضغط لعرض دليل ملء البيانات ونقاط الـ ATS" : "Tap to view guidelines, examples & ATS score")}
                          </h1>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {/* If collapsed, show a mini ATS pill */}
                        {!isIntroExpanded && (
                          <div className="hidden xs:inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-extrabold text-[9px] bg-slate-100 dark:bg-neutral-200 text-slate-700 dark:text-neutral-800 border border-slate-200 dark:border-neutral-300">
                            <span>ATS {atsScore}%</span>
                          </div>
                        )}
                        <motion.span 
                          animate={{ rotate: isIntroExpanded ? 180 : 0 }}
                          className="text-slate-400 text-[10px]"
                        >
                          ▼
                        </motion.span>
                      </div>
                    </div>

                    {/* Expanded Panel Body */}
                    <AnimatePresence initial={false}>
                      {isIntroExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <div className="px-5 pb-5 sm:px-7 sm:pb-7 pt-2 border-t border-slate-100 dark:border-neutral-200 flex flex-col xl:flex-row gap-5 xl:gap-6 items-start xl:items-center relative bg-gradient-to-b from-white to-slate-50/30 dark:from-neutral-0 dark:to-neutral-50/30">
                            <div className="absolute top-0 end-0 w-64 h-64 rounded-[2rem] opacity-[0.02] bg-slate-900 pointer-events-none transform translate-x-1/3 -translate-y-1/3 rotate-12"></div>
                            
                            {/* Step info detailed subtitle */}
                            <div className="flex-1 text-start w-full relative z-10">
                              <h1 className="text-sm sm:text-lg font-black text-neutral-900 dark:text-neutral-900 tracking-tight leading-snug">
                                {String(tabDescriptions[activeTab] || "")}
                              </h1>
                              {language === "ar" ? (
                                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                                  💡 استخدم الأزرار لتعبئة الحقول ببيانات تخصصية كاملة كمثال لخطوتك، أو مسح الحقول تماماً للبدء من جديد.
                                </p>
                              ) : (
                                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                                  💡 Use the actions below to fill with a parsed professional outline or reset your fields completely.
                                </p>
                              )}
                            </div>

                            {/* Premium Live ATS Score & Checklist Panel */}
                            <div className="relative z-20 shrink-0 w-full xl:w-auto" style={{ direction: dir }}>
                              <div 
                                onClick={() => setShowScoreChecklist(!showScoreChecklist)}
                                className="flex items-center gap-4 bg-slate-50/70 dark:bg-neutral-100/70 hover:bg-slate-50 dark:hover:bg-neutral-100 border border-slate-200/80 dark:border-neutral-200 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 select-none shadow-3xs"
                              >
                                {/* Circular dynamic gauge */}
                                <div className="relative flex items-center justify-center w-11 h-11 shrink-0">
                                  <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" className="text-slate-200 dark:text-neutral-200" strokeWidth="3" />
                                    <motion.circle
                                      cx="22"
                                      cy="22"
                                      r="18"
                                      fill="none"
                                      stroke={atsScore >= 80 ? "#10B981" : atsScore >= 50 ? "#F59E0B" : "#FF4D2D"}
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeDasharray={2 * Math.PI * 18}
                                      initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
                                      animate={{ strokeDashoffset: 2 * Math.PI * 18 * (1 - atsScore / 100) }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                  </svg>
                                  <span className="absolute text-[10px] font-black text-slate-900 dark:text-neutral-900">{atsScore}%</span>
                                </div>

                                {/* Interactive labels */}
                                <div className="text-start min-w-[110px]">
                                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                    {language === "ar" ? "قوة الـ ATS" : "ATS Strength"}
                                  </div>
                                  <div className="font-extrabold text-[11px] leading-tight">
                                    {atsScore >= 80 ? (
                                      <span className="text-emerald-600 flex items-center gap-1">
                                        <span>⭐</span> {language === "ar" ? "جاهزة تماماً" : "ATS Ready"}
                                      </span>
                                    ) : atsScore >= 50 ? (
                                      <span className="text-amber-600 flex items-center gap-1">
                                        <span>⚠️</span> {language === "ar" ? "مستوى مقبول" : "Acceptable"}
                                      </span>
                                    ) : (
                                      <span className="text-[#FF4D2D] flex items-center gap-1">
                                        <span>❌</span> {language === "ar" ? "ضعيف جداً" : "Incomplete"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[9px] text-slate-400 font-bold mt-1 leading-none hover:text-slate-600 dark:hover:text-neutral-600 flex items-center gap-1">
                                    <span>{language === "ar" ? "عرض المتمتطلبات" : "Check list"}</span>
                                    <span className={`text-[8px] transition-transform duration-200 ${showScoreChecklist ? "rotate-180" : ""}`}>▼</span>
                                  </div>
                                </div>
                              </div>

                              {/* Dropdown Checklist overlay with satisfying checkmarks */}
                              <AnimatePresence>
                                {showScoreChecklist && (
                                  <>
                                    {/* Backdrop to close click-outside */}
                                    <div className="fixed inset-0 z-10" onClick={() => setShowScoreChecklist(false)} />
                                    <motion.div
                                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                      className="absolute top-full end-0 mt-2 bg-white dark:bg-neutral-0 rounded-2xl border border-slate-200 dark:border-neutral-200 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.12)] z-20 w-72 text-start select-none"
                                    >
                                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-200 pb-2.5 mb-2.5">
                                        <h4 className="text-xs font-black text-slate-800 dark:text-neutral-800">
                                          {language === "ar" ? "معايير السيرة الذاتية الذكية" : "ATS Quality Checklist"}
                                        </h4>
                                        <span className="text-[9px] bg-slate-100 dark:bg-neutral-100 text-slate-500 dark:text-neutral-550 font-extrabold px-1.5 py-0.5 rounded-md">
                                          {breakdown.filter(x => x.done).length} / {breakdown.length}
                                        </span>
                                      </div>
                                      <ul className="space-y-2">
                                        {breakdown.map((item, idx) => {
                                          return (
                                            <li key={idx} className="flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-neutral-600 font-semibold">
                                              <span className="truncate leading-none">
                                                {language === "ar" ? item.label.ar : language === "fr" ? item.label.fr : item.label.en}
                                              </span>
                                              {item.done ? (
                                                <span className="w-4 h-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-850 rounded-full flex items-center justify-center text-[10px] select-none font-bold">✓</span>
                                              ) : (
                                                <span className="w-4 h-4 bg-slate-50 dark:bg-neutral-100 border border-slate-200 dark:border-neutral-200 rounded-full flex items-center justify-center text-[10px] text-slate-400 dark:text-neutral-400 select-none">○</span>
                                              )}
                                            </li>
                                          );
                                        })}
                                      </ul>
                                      <div className="mt-3.5 bg-slate-50 dark:bg-neutral-100 rounded-xl p-2.5 border border-slate-100/80 dark:border-neutral-200/80 text-[10px] text-slate-500 dark:text-neutral-550 font-bold leading-relaxed">
                                        {language === "ar" 
                                          ? "💡 احرص على ملء كافة عناصر السيرة لضمان تخطي فلاتر الشركات والذكاء الاصطناعي بنجاح." 
                                          : "💡 Ensure all tasks are completed to make your profile bypass industry ATS filters perfectly."}
                                      </div>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Controls Actions */}
                            <div className="flex items-center gap-2 z-10 w-full xl:w-auto mt-2 xl:mt-0">
                              <button
                                onClick={() =>
                                  setConfirmAction({
                                    type: "load",
                                    message: t.overwriteConfirm,
                                  })
                                }
                                className="flex-1 xl:flex-none text-[10px] font-black uppercase tracking-widest text-[#FF4D2D] bg-[#FF4D2D]/5 hover:bg-[#FF4D2D]/10 h-11 px-4 text-center rounded-xl transition-all border border-[#FF4D2D]/10 shadow-3xs whitespace-nowrap active:scale-95 cursor-pointer"
                              >
                                {String(t.loadExample || "")}
                              </button>
                              <button
                                onClick={() =>
                                  setConfirmAction({
                                    type: "clear",
                                    message: t.clearConfirm,
                                  })
                                }
                                className="flex-1 xl:flex-none text-[10px] font-black uppercase tracking-widest text-neutral-450 hover:text-rose-600 h-11 px-4 rounded-xl hover:bg-rose-50/50 transition-all border border-transparent whitespace-nowrap active:scale-95 cursor-pointer"
                              >
                                {String(t.clearAll || "")}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {!focusMode && ATS_SECTION_TIPS[language === "ar" ? "ar" : "en"]?.[activeTab] && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <div className="bg-orange-50/20 backdrop-blur-xs rounded-2xl border border-slate-700/15 p-4 transition-all overflow-hidden shadow-2xs">
                      <button
                        onClick={() => setIsTipsOpen(!isTipsOpen)}
                        className="w-full flex items-center justify-between font-bold text-xs text-slate-900 hover:opacity-85 transition-opacity"
                      >
                        <span className="flex items-center gap-2">
                          <span>{ATS_SECTION_TIPS[language === "ar" ? "ar" : "en"][activeTab].title}</span>
                        </span>
                        <span className="text-[10px] bg-slate-900/10 px-2.5 py-1 rounded-lg">
                          {isTipsOpen ? (language === "ar" ? "إخلاق" : "Hide") : (language === "ar" ? "عرض النصائح" : "Show Tips")}
                        </span>
                      </button>
                      
                      {isTipsOpen && (
                        <motion.ul 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3.5 space-y-2 text-xs md:text-sm text-slate-800 list-none ltr:pl-0 rtl:pr-0 border-t border-slate-300/10 pt-3"
                        >
                          {ATS_SECTION_TIPS[language === "ar" ? "ar" : "en"][activeTab].tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 leading-relaxed font-semibold text-slate-700">
                              <span className="text-slate-900 shrink-0 mt-0.5">✓</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </div>
                  </motion.div>
                )}

            {/* Direct Flow AI Integrations Callout Banner */}
            {showAIBanner && data.personalInfo.fullName && activeTab !== "cover-letter" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-orange-100/30 border border-orange-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-start relative"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#FF4D2D]/10 rounded-xl text-[#FF4D2D] shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      {language === "ar" 
                        ? `مرحباً بك ${data.personalInfo.fullName}! تم حفظ بيانات سيرتك الذاتية بنجاح ✅` 
                        : `Welcome back, ${data.personalInfo.fullName}! Your resume details are saved ✅`}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                      {language === "ar"
                        ? "هل ترغب في صياغة خطاب تغطية ذكي (Cover Letter) مخصص أو بدء محاكاة المقابلة الشخصية للتدريب مع مدرب الذكاء الاصطناعي بناءً على خبراتك المحفوظة؟"
                        : "Ready to auto-generate a custom Cover Letter or start simulator-practice with the AI Interview Coach built around your experiences?"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => setActiveTab("cover-letter")}
                    className="flex-1 sm:flex-none text-[10px] font-black bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    {language === "ar" ? "✍️ خطاب التغطية" : "✍️ Cover Letter"}
                  </button>
                  <Link
                    to="/interview-prep"
                    className="flex-1 sm:flex-none text-center text-[10px] font-black bg-[#FF4D2D] hover:bg-[#E64528] text-white py-2.5 px-3.5 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    {language === "ar" ? "🤖 مدرب المقابلات" : "🤖 Interview Coach"}
                  </Link>
                  <button
                    onClick={() => setShowAIBanner(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={"tab-" + activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Suspense fallback={<FormLoader />}>
                        {activeTab === "basics" && (
                        <div className="space-y-12">

                          <section>
                            <div className="flex items-center gap-4 mb-6 text-start">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white relative overflow-hidden" style={{ backgroundColor: '#FF4D2D', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.3)' }}>
                                <User
                                  size={24}
                                  className="relative z-10 drop-shadow-sm"
                                />
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div>
                                <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                                  {String(typeof t.personalInfo === 'string' ? t.personalInfo : "Personal Information")}
                                </h2>
                                <p className="text-xs text-neutral-500 font-medium">
                                  {language === "ar"
                                    ? "بياناتك الأساسية ومعلومات التواصل"
                                    : "Basic details and contact info"}
                                </p>
                              </div>
                            </div>
                            <PersonalInfoForm />

                            <div className="mt-12 pt-8 border-t border-neutral-100 hidden md:flex justify-end">
                              <button
                                onClick={() => setActiveTab("experience")}
                                className="group flex items-center gap-3 bg-neutral-950 text-white px-8 py-4 rounded-2xl font-bold border border-slate-700 shadow-lg hover:bg-black transition-all active:scale-95"
                              >
                                {language === "ar"
                                  ? "الخطوة التالية: الخبرة"
                                  : "Next: Experience"}
                                <ArrowRight
                                  size={20}
                                  className="group-hover:translate-x-1 transition-transform rtl:rotate-180 group-hover:rtl:-translate-x-1"
                                />
                              </button>
                            </div>
                          </section>
                        </div>
                      )}
                      {activeTab === "experience" && (
                        <div className="space-y-12">
                          <section>
                            <div className="flex items-center gap-4 mb-6 text-start px-1">
                              <div className="w-14 h-14 rounded-3xl bg-white shadow-xl shadow-neutral-200/50 flex items-center justify-center text-brand-500 relative overflow-hidden group border border-neutral-100/50 shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-rose-50 opacity-50" />
                                <Briefcase
                                  size={28}
                                  className="relative z-10 drop-shadow-sm"
                                />
                              </div>
                              <div>
                                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                                  {String(t.experience?.title || "Experience")}
                                </h2>
                                <p className="text-[10px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider">
                                  {language === "ar"
                                    ? "تاريخك المهني وإنجازاتك"
                                    : "Work history and achievements"}
                                </p>
                              </div>
                            </div>
                            <div className="px-1">
                              <ExperienceForm />
                            </div>

                            <div className="mt-12 pt-8 border-t border-neutral-100 hidden md:flex justify-between gap-4">
                              <button
                                onClick={() => setActiveTab("basics")}
                                className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                              >
                                {language === "ar" ? "السابق" : "Previous"}
                              </button>
                              <button
                                onClick={() => setActiveTab("education")}
                                className="group flex items-center gap-3 bg-neutral-950 text-white px-8 py-4 rounded-2xl font-bold border border-slate-700 shadow-lg hover:bg-black transition-all active:scale-95"
                              >
                                {language === "ar"
                                  ? "الخطوة التالية: التعليم"
                                  : "Next: Education"}
                                <ArrowRight
                                  size={20}
                                  className="group-hover:translate-x-1 transition-transform rtl:rotate-180 group-hover:rtl:-translate-x-1"
                                />
                              </button>
                            </div>
                          </section>
                        </div>
                      )}
                      {activeTab === "education" && (
                        <div className="space-y-12">
                          <section>
                            <div className="flex items-center gap-4 mb-6 text-start px-1">
                              <div className="w-14 h-14 rounded-3xl bg-white shadow-xl shadow-neutral-200/50 flex items-center justify-center text-brand-500 relative overflow-hidden group border border-neutral-100/50 shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-rose-50 opacity-50" />
                                <GraduationCap
                                  size={28}
                                  className="relative z-10 drop-shadow-sm"
                                />
                              </div>
                              <div>
                                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                                  {String(t.education?.title || "Education")}
                                </h2>
                                <p className="text-[10px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider">
                                  {language === "ar"
                                    ? "خلفيتك الأكاديمية والتعليمية"
                                    : "Academic background"}
                                </p>
                              </div>
                            </div>
                            <div className="px-1">
                              <EducationForm />
                            </div>

                            <div className="mt-12 pt-8 border-t border-neutral-100 hidden md:flex justify-between gap-4">
                              <button
                                onClick={() => setActiveTab("experience")}
                                className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                              >
                                {language === "ar" ? "السابق" : "Previous"}
                              </button>
                              <button
                                onClick={() => setActiveTab("skills")}
                                className="group flex items-center gap-3 bg-neutral-950 text-white px-8 py-4 rounded-2xl font-bold border border-slate-700 shadow-lg hover:bg-black transition-all active:scale-95"
                              >
                                {language === "ar"
                                  ? "الخطوة التالية: المهارات"
                                  : "Next: Skills"}
                                <ArrowRight
                                  size={20}
                                  className="group-hover:translate-x-1 transition-transform rtl:rotate-180 group-hover:rtl:-translate-x-1"
                                />
                              </button>
                            </div>
                          </section>
                        </div>
                      )}
                      {activeTab === "skills" && (
                        <section>
                          <div className="flex items-center gap-4 mb-6 text-start">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white relative overflow-hidden" style={{ backgroundColor: '#FF4D2D', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.3)' }}>
                              <Wrench
                                size={24}
                                className="relative z-10 drop-shadow-sm"
                              />
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                                {String(typeof t.skills?.title === 'string' ? t.skills.title : "Skills")}
                              </h2>
                              <p className="text-xs text-neutral-500 font-medium">
                                {language === "ar"
                                  ? "مهاراتك التقنية والشخصية"
                                  : "Tech & soft skills"}
                              </p>
                            </div>
                          </div>
                          <SkillsForm />

                          <div className="mt-12 pt-8 border-t border-neutral-100 hidden md:flex justify-between gap-4">
                            <button
                              onClick={() => setActiveTab("education")}
                              className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                            >
                              {language === "ar" ? "السابق" : "Previous"}
                            </button>
                            <button
                              onClick={() => setActiveTab("projects")}
                              className="group flex items-center gap-3 bg-neutral-950 text-white px-8 py-4 rounded-2xl font-bold border border-slate-700 shadow-lg hover:bg-black transition-all active:scale-95"
                            >
                              {language === "ar"
                                ? "الخطوة التالية: المشاريع"
                                : "Next: Projects"}
                              <ArrowRight
                                size={20}
                                className="group-hover:translate-x-1 transition-transform rtl:rotate-180 group-hover:rtl:-translate-x-1"
                              />
                            </button>
                          </div>
                        </section>
                      )}
                      {activeTab === "projects" && (
                        <section>
                          <div className="flex items-center gap-4 mb-6 text-start">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white relative overflow-hidden" style={{ backgroundColor: '#FF4D2D', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.3)' }}>
                              <LayoutTemplate
                                size={24}
                                className="relative z-10 drop-shadow-sm"
                              />
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                                {String(t.projects?.title || "Projects")}
                              </h2>
                              <p className="text-xs text-neutral-500 font-medium">
                                {language === "ar"
                                  ? "أرنا أفضل أعمالك ومشاريعك"
                                  : "Showcase your best work and projects"}
                              </p>
                            </div>
                          </div>
                          <ProjectsForm />

                          <div className="mt-12 pt-8 border-t border-neutral-100 hidden md:flex justify-between gap-4">
                            <button
                              onClick={() => setActiveTab("skills")}
                              className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                            >
                              {language === "ar" ? "السابق" : "Previous"}
                            </button>
                            <button
                              onClick={() => setActiveTab("certifications")}
                              className="group flex items-center gap-3 bg-neutral-950 text-white px-8 py-4 rounded-2xl font-bold border border-slate-700 shadow-lg hover:bg-black transition-all active:scale-95"
                            >
                              {language === "ar"
                                ? "الخطوة التالية: الشهادات"
                                : "Next: Certifications"}
                              <ArrowRight
                                size={20}
                                className="group-hover:translate-x-1 transition-transform rtl:rotate-180 group-hover:rtl:-translate-x-1"
                              />
                            </button>
                          </div>
                        </section>
                      )}
                      {activeTab === "certifications" && (
                        <section>
                          <div className="flex items-center gap-4 mb-6 text-start">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white relative overflow-hidden" style={{ backgroundColor: '#FF4D2D', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.3)' }}>
                              <Award
                                size={24}
                                className="relative z-10 drop-shadow-sm"
                              />
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                                {String(t.certifications?.title || "Certifications")}
                              </h2>
                              <p className="text-xs text-neutral-500 font-medium">
                                {language === "ar"
                                  ? "الشهادات والإنجازات المهنية"
                                  : "Certifications and professional achievements"}
                              </p>
                            </div>
                          </div>
                          <CertificationsForm />

                          <div className="mt-12 pt-8 border-t border-neutral-100 hidden md:flex justify-between gap-4">
                            <button
                              onClick={() => setActiveTab("projects")}
                              className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                            >
                              {language === "ar" ? "السابق" : "Previous"}
                            </button>
                            <button
                              onClick={() => setActiveTab("cover-letter")}
                              className="group flex items-center gap-3 bg-neutral-950 text-white px-8 py-4 rounded-2xl font-bold border border-slate-700 shadow-lg hover:bg-black transition-all active:scale-95"
                            >
                              {language === "ar"
                                ? "الخطوة التالية: خطاب التقديم"
                                : "Next: Cover Letter"}
                              <ArrowRight
                                size={20}
                                className="group-hover:translate-x-1 transition-transform rtl:rotate-180 group-hover:rtl:-translate-x-1"
                              />
                            </button>
                          </div>
                        </section>
                      )}
                      {activeTab === "cover-letter" && (
                        <section>
                          <div className="flex items-center gap-4 mb-6 text-start">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white relative overflow-hidden" style={{ backgroundColor: '#FF4D2D', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.3)' }}>
                              <FileText
                                size={24}
                                className="relative z-10 drop-shadow-sm"
                              />
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                                {String(t.coverLetter?.title || "Cover Letter")}
                              </h2>
                              <p className="text-xs text-neutral-500 font-medium">
                                {language === "ar"
                                  ? "خطاب تقديمي مخصص بالذكاء الاصطناعي"
                                  : "AI-powered personalized letter"}
                              </p>
                            </div>
                          </div>
                          <CoverLetterForm />

                          <div className="mt-12 pt-8 border-t border-neutral-100 hidden md:flex justify-between gap-4">
                            <button
                              onClick={() => setActiveTab("certifications")}
                              className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                            >
                              {language === "ar" ? "السابق" : "Previous"}
                            </button>
                            <button
                              onClick={() => setActiveTab("finish")}
                              className="group flex items-center gap-3 bg-neutral-950 text-white px-8 py-4 rounded-2xl font-bold border border-slate-700 shadow-lg hover:bg-black transition-all active:scale-95"
                            >
                              {language === "ar"
                                ? "العودة للمراجعة والتحميل"
                                : "Back to Review & Download"}
                              <ArrowRight
                                size={20}
                                className="group-hover:translate-x-1 transition-transform rtl:rotate-180 group-hover:rtl:-translate-x-1"
                              />
                            </button>
                          </div>
                        </section>
                      )}
                      {activeTab === "finish" && (
                        <div className="space-y-8">
                          <ATSAudit />
                          <div className="pt-12 border-t border-neutral-100">
                            <FinishStep
                              onPrint={handleProceedToExport}
                              onExportWord={() => setShowPaymentModal(true)}
                              onJumpToStep={(step) => setActiveTab(step as Tab)}
                            />
                          </div>
                        </div>
                      )}
                      </Suspense>
                    </motion.div>
                  </AnimatePresence>
                </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col h-[100dvh] bg-neutral-50 overflow-hidden transition-colors duration-200",
        language === "ar" ? "font-editor-ar" : "font-editor-en",
      )}
      dir={dir}
    >
      <Helmet>
        <title>{language === "ar" ? "محرر السيرة الذاتية" : "Resume Editor"} | Hash Resume</title>
        <meta
          name="description"
          content="Build your professional resume with our AI-powered editor."
        />
      </Helmet>

      {isMobile ? (
        <MobileEditorLayout
          lang={language as "ar" | "en" | "fr"}
          atsScore={atsScore}
          activeSection={activeTab}
          onSectionChange={(id: string) => setActiveTab(id as any)}
          completionMap={sidebarCompletionMap}
          onExportPDF={handleExportClick}
          onExportWord={() => handleProceedToExport("docx")}
          previewContent={
            <div className="w-full h-full overflow-y-auto overflow-x-hidden p-2 pb-16 scrollbar-none flex justify-center transform-gpu">
              <div 
                className="origin-top transform-gpu transition-all"
                style={{ 
                  width: '210mm',
                  minHeight: "297mm",
                  transform: `scale(${Math.min(0.46, (windowWidth - 28) / 794)})`,
                  marginBottom: `-${(1 - Math.min(0.46, (windowWidth - 28) / 794)) * 297}mm`,
                  WebkitUserSelect: 'none',
                }}
              >
                <div className="bg-white shadow-[0_4px_25px_rgba(0,0,0,0.06)] rounded-sm overflow-hidden w-full h-full">
                  <Suspense fallback={<FormLoader />}>
                  {previewMode === "cover-letter" ? <CoverLetterPreview /> : <ResumePreview ref={componentRef} />}
                  </Suspense>
                </div>
              </div>
            </div>
          }
        >
          <main ref={formRef} onScroll={handleFormScroll} className="w-full h-full overflow-y-auto pb-6 relative scrollbar-none editor-form-scrollable">
            <div className="min-h-full flex flex-col">
              <div className="flex-1">
                {formContent}
              </div>
              <div className="mt-8 px-4 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
                {Object.keys(sidebarCompletionMap).indexOf(activeTab as any) > 0 ? (
                  <button
                    onClick={() => {
                      const allTabs = Object.keys(sidebarCompletionMap);
                      const currentIndex = allTabs.indexOf(activeTab as any);
                      setActiveTab(allTabs[currentIndex - 1] as any);
                    }}
                    className="flex-1 py-3.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ArrowRight size={16} className="rtl:-scale-x-100 ltr:rotate-180" />
                    {language === "ar" ? "السابق" : language === "fr" ? "Précédent" : "Previous"}
                  </button>
                ) : (
                  <div className="flex-1" />
                )}
                {Object.keys(sidebarCompletionMap).indexOf(activeTab as any) < Object.keys(sidebarCompletionMap).length - 1 ? (
                  <button
                    onClick={() => {
                      const allTabs = Object.keys(sidebarCompletionMap);
                      const currentIndex = allTabs.indexOf(activeTab as any);
                      setActiveTab(allTabs[currentIndex + 1] as any);
                    }}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm shadow-slate-900/10"
                  >
                    {language === "ar" ? "التالي" : language === "fr" ? "Suivant" : "Next"}
                    <ArrowRight size={16} className="rtl:-scale-x-100" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleProceedToExport("pdf")}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-orange-600 border border-orange-500 text-white font-bold text-sm hover:bg-orange-700 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {language === "ar" ? "تصدير" : language === "fr" ? "Exporter" : "Export"}
                    <ArrowRight size={16} className="rtl:-scale-x-100" />
                  </button>
                )}
              </div>
            </div>
          </main>
        </MobileEditorLayout>
      ) : (
        <>
          <EditorNavbar
        lang={language as "ar" | "en" | "fr"}
        onLangChange={setLanguage}
        atsScore={atsScore}
        atsBreakdown={breakdown}
        isSaved={!isSaving}
        onUndo={handleUndo}
        onExportPDF={handleExportClick}
        onExportWord={() => handleProceedToExport("docx")}
        onTogglePreview={() => setShowFullPreview(!showFullPreview)}
        previewOpen={showFullPreview}
        isLocked={data.isLocked}
        onBackToHome={() => { window.location.href = "/"; }}
        onShowSettings={() => setIsSettingsModalOpen(true)}
        onShowShortcuts={() => setShowKeyboardShortcuts(true)}
        onShowCommandBar={() => setIsCommandBarOpen(true)}
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode(!focusMode)}
      />

      {/* Real-time Progress tracker moved to tabs and dock */}

      <PanelGroup
        orientation={isMobile ? "vertical" : "horizontal"}
        className="flex-1 w-full h-full overflow-hidden relative editor-form"
      >
        {/* Editor Area */}
        <Panel defaultSize={55} minSize={30} className="block">
          <div className={cn("flex flex-row h-full overflow-hidden transition-all duration-300", focusMode ? "bg-white" : "bg-neutral-50")}>
            <EditorSidebar
              activeTab={activeTab}
              onTabChange={(id) => setActiveTab(id as Tab)}
              lang={language as "ar" | "en" | "fr"}
              completionMap={sidebarCompletionMap}
            />
            <main
              ref={formRef}
              onScroll={handleFormScroll}
              className={cn(
                "flex-1 overflow-y-auto p-4 sm:p-8 sm:pt-10 scroll-smooth relative",
                focusMode ? "bg-white" : ""
              )}
            >
              {formContent}
              {focusMode && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-slate-200 text-slate-500 rounded-full py-2 px-5 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold select-none z-50">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>
                    {language === "ar" 
                      ? "Focus Mode ON — بتركز على المحتوى" 
                      : language === "fr"
                      ? "Focus Mode ON — Concentré sur le contenu"
                      : "Focus Mode ON — Focusing on Content"}
                  </span>
                </div>
              )}{/* Mobile Scroll to Top */}
                <AnimatePresence>
                  {showScrollTop && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 20 }}
                      onClick={scrollToFormTop}
                      className="md:hidden fixed bottom-[90px] sm:bottom-28 end-6 w-12 h-12 bg-neutral-50 text-neutral-900 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-200 flex items-center justify-center z-40 active:scale-90 transition-transform"
                    >
                      <ArrowUp size={24} />
                    </motion.button>
                  )}
                </AnimatePresence>
            </main>
          </div>
        </Panel>

        {!isMobile && !focusMode && (
          <>
            <PanelResizeHandle className="w-1.5 focus:outline-none bg-neutral-200 hover:bg-brand-500 active:bg-brand-600 transition-colors group z-50">
              <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-12 w-1 bg-white rounded-full" />
              </div>
            </PanelResizeHandle>

            {/* Preview Area / Bottom Sheet for Mobile */}
            <Panel
              defaultSize={45}
              minSize={30}
              className="w-full h-full"
            >
          <div
            data-tour="preview-pane"
            className="bg-neutral-100 border-s border-neutral-200 flex-col flex h-full overflow-hidden relative transition-colors duration-200"
          >
            <div className="h-14 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between px-6 shrink-0 absolute top-0 start-0 end-0 z-10 transition-colors duration-200 transform-gpu">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-neutral-50 rounded-xl p-1 border border-neutral-200">
                    <button
                      onClick={() => setPreviewMode("resume")}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black tracking-wider transition-all",
                        previewMode === "resume"
                          ? "bg-neutral-50 text-neutral-900 shadow-sm ring-1 ring-neutral-200"
                          : "text-neutral-500 hover:text-neutral-700",
                        language !== "ar" && "uppercase"
                      )}
                    >
                      <LayoutTemplate size={14} />
                      {language === "ar" ? "السيرة الذاتية" : t.resumeTab}
                    </button>
                    <button
                      onClick={() => setPreviewMode("cover-letter")}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black tracking-wider transition-all",
                        previewMode === "cover-letter"
                          ? "bg-neutral-50 text-neutral-900 shadow-sm ring-1 ring-neutral-200"
                          : "text-neutral-500 hover:text-neutral-700",
                        language !== "ar" && "uppercase"
                      )}
                    >
                      <FileText size={14} />
                      {language === "ar" ? "خطاب التغطية" : t.coverLetterTab}
                    </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFullPreview(true)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                  title={String(t.fullPreview || "")}
                >
                  <Maximize2 size={18} />
                </button>
                {!data.isLocked && (
                  <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                    title={String(t.resumeSettings || "")}
                  >
                    <Settings size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Page Overflow Indicator Alert banner */}
            <AnimatePresence>
              {overflowLines > 0 && previewMode === "resume" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="absolute bottom-6 start-6 end-6 z-20 bg-amber-55/95 backdrop-blur-md border border-amber-200 text-amber-950 rounded-2xl p-4.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex items-center justify-between gap-4"
                  dir={language === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0">⚠️</span>
                    <div className="space-y-0.5 animate-pulse">
                      <p className="text-xs font-black">
                        {language === "ar"
                          ? `سيرتك الذاتية تتجاوز الصفحة الواحدة بحوالي ${overflowLines} أسطر!`
                          : `Your CV exceeds one page by about ${overflowLines} lines!`}
                      </p>
                      <p className="text-[10px] text-amber-800 leading-normal font-medium">
                        {language === "ar"
                          ? "نوصي بتفعيل ميزة \"الاحتواء الموفر للمساحة\" لضغط الهوامش وتقليل الحجم ذكياً تلقائياً."
                          : "Apply our compact custom margin and spacing configuration to seamlessly fit content into exactly 1 page."}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      useResumeStore.getState().updateSettings({
                        fontSize: "small",
                        lineHeight: "compact",
                        sectionSpacing: "compact",
                        marginSize: "compact"
                      });
                    }}
                    className="shrink-0 bg-amber-600 hover:bg-amber-700 hover:shadow text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
                  >
                    {language === "ar" ? "احتواء ذكي ✨" : "Fit to 1 Page ✨"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-2 sm:p-4 md:p-12 pt-24 md:pt-24 flex justify-center items-start bg-slate-50/70 relative">
              {previewMode === "resume" && (
                <div className="absolute top-24 end-6 z-30 hidden xl:block">
                  {showAtsPanel ? (
                    <ATSHealthGauge 
                      data={data} 
                      isAr={language === "ar"} 
                      onClose={handleToggleAtsPanel} 
                    />
                  ) : (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleToggleAtsPanel}
                      className="bg-slate-905 hover:bg-slate-950 text-white border border-slate-800/80 px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-[0_12px_36px_rgba(15,23,42,0.15)] cursor-pointer active:scale-95 transition-all"
                    >
                      <Sparkles size={13} className="text-amber-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {language === "ar" ? "📊 نقاط الـ ATS" : "📊 ATS Score"}
                      </span>
                      <span className="bg-emerald-505 text-white text-[11px] px-2 py-0.5 rounded-full font-black select-none leading-none">
                        {calculateATSScore(data).score}%
                      </span>
                    </motion.button>
                  )}
                </div>
              )}
              <div
                className={cn(
                  "origin-top transition-all duration-500 flex justify-center",
                  previewMode !== "cover-letter"
                    ? "scale-[0.5] sm:scale-[0.75] md:scale-[0.95] lg:scale-[1.1] xl:scale-[1.2] h-[calc(297mm*0.5)] sm:h-[calc(297mm*0.75)] md:h-[calc(297mm*0.95)] lg:h-[calc(297mm*1.1)] xl:h-[calc(297mm*1.2)]"
                    : "w-full max-w-3xl",
                )}
              >
                <div
                  className={cn(
                    "bg-white shadow-[0_25px_60px_-15px_rgba(15,23,42,0.08),0_0_1px_rgba(15,23,42,0.1)] rounded-md overflow-hidden",
                    previewMode !== "cover-letter"
                      ? "w-[210mm] min-h-[297mm] shrink-0"
                      : "w-full",
                  )}
                >
                  <Suspense fallback={<FormLoader />}>
                    {previewMode === "cover-letter" ? (
                      <CoverLetterPreview />
                    ) : (
                      <ResumePreview ref={componentRef} />
                    )}
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </Panel>
        </>
        )}
      </PanelGroup>

      <AnimatePresence>
        {showMobilePreview && (
          <div key="mobile-preview-container" className="md:hidden fixed inset-0 z-[60] flex flex-col">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobilePreview(false)}
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 h-[85vh] bg-neutral-100 rounded-t-[2rem] shadow-2xl z-[70] flex flex-col overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-3 shrink-0"
                style={{ background: '#fff', borderBottom: '1px solid var(--color-neutral-100)' }}
              >
                <div
                  className="flex items-center rounded-xl p-1"
                  style={{ background: 'var(--color-neutral-100)' }}
                >
                  <button
                    onClick={() => setPreviewMode("resume")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black tracking-wider transition-all",
                      language !== "ar" && "uppercase"
                    )}
                    style={previewMode === "resume" ? {
                      background: '#fff',
                      color: 'var(--color-neutral-900)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    } : { color: 'var(--color-neutral-500)' }}
                  >
                    <LayoutTemplate size={13} />
                    {language === "ar" ? "السيرة الذاتية" : t.resumeTab}
                  </button>
                  <button
                    onClick={() => setPreviewMode("cover-letter")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black tracking-wider transition-all",
                      language !== "ar" && "uppercase"
                    )}
                    style={previewMode === "cover-letter" ? {
                      background: '#fff',
                      color: 'var(--color-neutral-900)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    } : { color: 'var(--color-neutral-500)' }}
                  >
                    <FileText size={13} />
                    {language === "ar" ? "خطاب التغطية" : t.coverLetterTab}
                  </button>
                </div>
              
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                  style={{ background: 'var(--color-neutral-100)', color: 'var(--color-neutral-600)' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-x-hidden overflow-y-auto w-full p-2 sm:p-4 flex flex-col items-center bg-neutral-100">
                <div
                  className={cn(
                    "origin-top transition-all",
                    previewMode !== "cover-letter"
                      ? "scale-[0.4] sm:scale-[0.45] origin-top opacity-100"
                      : "w-full",
                  )}
                  style={previewMode !== "cover-letter" ? { 
                    width: "210mm",
                    height: "297mm",
                    marginBottom: "-170mm" // roughly 297 * 0.6
                  } : undefined}
                >
                  <div
                    className={cn(
                      "bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden mx-auto",
                      previewMode !== "cover-letter"
                        ? "w-[210mm] min-h-[297mm]"
                        : "w-full",
                    )}
                  >
                    <Suspense fallback={<FormLoader />}>
                      {previewMode === "cover-letter" ? (
                        <CoverLetterPreview />
                      ) : (
                        <ResumePreview ref={componentRef} />
                      )}
                    </Suspense>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>




        </>
      )}

      {/* Modals */}
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
        <LinkedInImportModal
          isOpen={isLinkedInModalOpen}
          onClose={() => setIsLinkedInModalOpen(false)}
        />
        {/* Full Page Preview Modal */}
        <AnimatePresence>
          {showFullPreview && (
            <div className="fixed inset-0 z-[100] flex flex-col bg-neutral-950/95 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col items-center"
              >
                <div className="w-full max-w-5xl flex justify-between items-center mb-8 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-neutral-50/10 rounded-2xl">
                      <FileText className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-white text-2xl font-black tracking-tight">
                        {String(t.resumePreview || "")}
                      </h2>
                      <p className="text-neutral-400 text-sm font-medium">
                        Review your masterpiece before exporting
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleExportClick}
                      className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-4 rounded-full flex items-center gap-2 font-black transition-all text-xs shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest"
                    >
                      <Download size={18} />
                      {String(t.exportPdf || "")}
                    </button>
                    <button
                      onClick={() => setShowFullPreview(false)}
                      className="bg-neutral-50/10 hover:bg-neutral-50/20 text-white p-4 rounded-full transition-colors border border-white/10"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="w-full max-w-[210mm] bg-neutral-50 shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden shrink-0 mb-20 ring-1 ring-white/20">
                  <Suspense fallback={<FormLoader />}>
                    <ResumePreview />
                  </Suspense>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <ResumeCheckerModal
          isOpen={showResumeChecker}
          onClose={() => setShowResumeChecker(false)}
          onProceed={handleProceedToExport}
        />

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            trackEvent(FUNNEL_EVENTS.PAID_DOWNLOAD, { language });
            setShowPaymentModal(false);
            handlePrint();
          }}
        />
        <PostDownloadModal
          isOpen={showPostDownloadModal}
          onClose={() => setShowPostDownloadModal(false)}
        />
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
        />

        <ProgressTrackerModal
          isOpen={showProgressTracker}
          onClose={() => setShowProgressTracker(false)}
          data={data}
          activeTab={activeTab}
          onJumpToStep={(id) => setActiveTab(id as Tab)}
        />

        <UniversalCommandBar
          isOpen={isCommandBarOpen}
          onClose={() => setIsCommandBarOpen(false)}
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab)}
        />

        {/* Action Confirmation Modal */}
        <AnimatePresence>
          {confirmAction && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-neutral-50 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-center text-neutral-900">
                    {confirmAction.type === "load"
                      ? "Load Example Data?"
                      : "Clear All Data?"}
                  </h3>
                  <p className="text-center text-neutral-600">
                    {confirmAction.message}
                  </p>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setConfirmAction(null)}
                      className="flex-1 py-2 bg-neutral-100 text-neutral-700 rounded-xl font-bold hover:bg-neutral-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (confirmAction.type === "load") {
                          loadExampleData();
                        } else {
                          resetData();
                        }
                        setConfirmAction(null);
                      }}
                      className={cn(
                        "flex-1 py-2 text-white rounded-xl font-bold transition-colors",
                        confirmAction.type === "load"
                          ? "bg-brand-500 hover:bg-brand-600"
                          : "bg-red-600 hover:bg-red-700",
                      )}
                    >
                      {confirmAction.type === "load"
                        ? "Yes, Load"
                        : "Yes, Clear"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Interactive Export Progress Indicator */}
        <AnimatePresence>
          {exportStatus && exportStatus.show && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] w-full max-w-sm overflow-hidden border border-slate-100 p-8 text-center space-y-6"
              >
                {/* Visual loader matching premium look */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-50/50" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent"
                  />
                  <span className="text-xl font-black text-brand-600">
                    {Math.min(100, exportStatus.step * 20)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-800">
                    {language === "ar" ? "جاري تحضير ملفك الفاخر 🌍" : "Preparing Your Premium Document 🌍"}
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
                    {language === "ar"
                      ? "جاري تنسيق الهوامش والخطوط وإجراء فحص مطابقة نظام الـ ATS الآلي..."
                      : "Formatting margins, applying custom spacing rules, and running real-time ATS keyword matching calculations..."}
                  </p>
                </div>

                {/* Animated progress checklist */}
                <div className="space-y-2.5 text-start bg-slate-50 p-4 rounded-xl border border-slate-100 max-w-sm mx-auto">
                  {[
                    { id: 1, ar: "جاري ضبط الهوامش الاستراتيجية والمسافات...", en: "Configuring page margins & boundaries..." },
                    { id: 2, ar: "جاري تحسين مظهر الخطوط الفاخرة للطباعة...", en: "Optimizing premium typography & sizes..." },
                    { id: 3, ar: "جاري دمج الكلمات المفتاحية لمطابقة الـ ATS...", en: "Aligning structure with parsing targets..." },
                    { id: 4, ar: "جاري تصدير وتشييد ملف الـ PDF النهائي...", en: "Rendering and compiling document stream..." },
                    { id: 5, ar: "تم التصدير بنجاح! جاري التنزيل...", en: "Ready! Starting download..." }
                  ].map((item) => {
                    const isActive = exportStatus.step === item.id;
                    const isCompleted = exportStatus.step > item.id;
                    return (
                      <div key={item.id} className="flex items-center gap-3 text-xs" dir={language === "ar" ? "rtl" : "ltr"}>
                        <span className={`w-2 h-2 rounded-full ${isCompleted ? "bg-emerald-500" : isActive ? "bg-brand-500 animate-ping" : "bg-slate-300"}`} />
                        <span className={isCompleted ? "text-slate-400 line-through font-medium" : isActive ? "text-zinc-900 font-extrabold" : "text-slate-500 font-medium"}>
                          {language === "ar" ? item.ar : item.en}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showKeyboardShortcuts && (
            <KeyboardShortcutsModal 
              isOpen={showKeyboardShortcuts} 
              onClose={() => setShowKeyboardShortcuts(false)} 
            />
          )}
        </AnimatePresence>



    </div>
  );
}
