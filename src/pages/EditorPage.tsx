import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { trackEvent, FUNNEL_EVENTS } from "../utils/analytics";
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
  Maximize2,
  X,
  SlidersHorizontal,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  Award,
  Lock,
  Folder,
  Eye,
  FileEdit,
} from "lucide-react";
import { useResumeStore, getResumeSignature } from "../store/useResumeStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { useActiveSectionStore } from "../store/useActiveSectionStore";
import { Link } from "react-router-dom";
import { translations } from "../i18n/translations";
import SettingsModal from "../components/SettingsModal";
import KeyboardShortcutsModal from "../components/KeyboardShortcutsModal";
import { cn } from "@/lib/utils";
import { calculateATSScore } from "../utils/ats";
import { DEFAULT_BREAKDOWN } from "../constants";
import EditorNavbar from "../components/editor/EditorNavbar";
import MobileEditorLayout from "../components/editor/MobileEditorLayout";
import ResumePreview from "../components/preview/ResumePreview";
import { FrictionlessConfetti } from "../components/FrictionlessConfetti";

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
const CertificationsForm = lazy(
  () => import("../components/editor/CertificationsForm"),
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
  | "finish"
  | "review";

interface TabItem {
  id: Tab;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  tourId?: string;
}

import { ProgressTrackerModal } from "../components/editor/ProgressTrackerModal";

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
  const [isTipsOpen, setIsTipsOpen] = useState(true);
  const [showAIBanner, setShowAIBanner] = useState(true);
  const [showMicroSpacingPanel, setShowMicroSpacingPanel] = useState(false);
  const touchStartRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  const tabOrder: Tab[] = [
    "basics",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
  ];
  const currentTabIndex = tabOrder.indexOf(activeTab);
  const hasNextTab = currentTabIndex >= 0 && currentTabIndex < tabOrder.length - 1;
  const hasPrevTab = currentTabIndex > 0;

  const handleNextTab = () => {
    if (hasNextTab) setActiveTab(tabOrder[currentTabIndex + 1]);
  };
  const handlePrevTab = () => {
    if (hasPrevTab) setActiveTab(tabOrder[currentTabIndex - 1]);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchEndX - touchStartRef.current;
    const diffY = touchEndY - touchStartYRef.current;
    
    if (Math.abs(diffX) > 75 && Math.abs(diffY) < 55) {
      if (diffX > 0) {
        handlePrevTab();
        scrollToFormTop();
      } else {
        handleNextTab();
        scrollToFormTop();
      }
    }
  };

  const [focusMode, setFocusMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("focusMode") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("focusMode", String(focusMode));
  }, [focusMode]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDesktop = window.innerWidth > 768;
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
  
  useEffect(() => {
    const handlePreviewSectionClick = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: Tab; field: string }>;
      if (customEvent && customEvent.detail) {
        const { tab, field } = customEvent.detail;
        
        // Update tab state
        setActiveTab(tab);
        
        // Hide overlays if open
        setShowFullPreview(false);
        setShowMobilePreview(false);
        
        // Track actively focused field
        useActiveSectionStore.getState().setActiveField(field);

        // Let layout settle, then target the specific form section and scroll smoothly
        setTimeout(() => {
          let element: HTMLElement | null = null;
          if (field === "personalInfo" || field === "fullName") {
            element = document.getElementById("fullName") || document.querySelector("[data-form-basics-personal]");
          } else if (field === "summary") {
            element = document.getElementById("summary") || document.querySelector("[data-form-basics-summary]");
          } else {
            element = document.querySelector(`[data-form-section="${field}"]`);
          }

          if (!element) {
            element = document.querySelector(".editor-form-scrollable input, .editor-form-scrollable textarea");
          }

          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            
            // Premium visual feedback ring
            element.classList.add("ring-2", "ring-[#FF4D2D]", "ring-offset-4");
            setTimeout(() => {
              element?.classList.remove("ring-2", "ring-[#FF4D2D]", "ring-offset-4");
            }, 1800);
          }
        }, 180);
      }
    };

    const handleOpenImportModal = () => {
      setIsLinkedInModalOpen(true);
    };

    window.addEventListener("preview-section-clicked", handlePreviewSectionClick);
    window.addEventListener("open-import-modal", handleOpenImportModal);
    return () => {
      window.removeEventListener("preview-section-clicked", handlePreviewSectionClick);
      window.removeEventListener("open-import-modal", handleOpenImportModal);
    };
  }, []);
  


  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleFormScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 300);
  };

  const scrollToFormTop = () => {
    formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasExported, setHasExported] = useState(false); // Track if user exported session
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
  const [showAtsAestheticPanel, setShowAtsAestheticPanel] = useState(false);
  const [showMobileAtsPanel, setShowMobileAtsPanel] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "load" | "clear";
    message: string;
  } | null>(null);
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

  const [showConfetti, setShowConfetti] = useState(false);
  const [hasCelebratedScore, setHasCelebratedScore] = useState(false);

  useEffect(() => {
    if (atsScore >= 90) {
      if (!hasCelebratedScore) {
        setHasCelebratedScore(true);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 4000);
      }
    } else if (atsScore < 85) {
      // Allow resets if score falls back, so they can re-trigger when upgrading
      setHasCelebratedScore(false);
    }
  }, [atsScore, hasCelebratedScore]);

  useEffect(() => {
    (window as any).triggerFrictionlessConfetti = () => {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
    };
    return () => {
      delete (window as any).triggerFrictionlessConfetti;
    };
  }, []);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
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

  // Exit intent & beforeunload logic
  useEffect(() => {
    // 1. Browser Native Warning (Only if they've worked on it and haven't exported recently)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Don't annoy if it's completely empty or they just downloaded
      if (!isEmpty && !hasExported && !data.isLocked) {
        e.preventDefault();
        e.returnValue = ""; // Standard way to trigger native prompt
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEmpty, hasExported, data.isLocked]);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

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

        const resumeElement = document.getElementById('resume-capture-area');
        if (!resumeElement) throw new Error("Resume element not found");

        setExportStatus({ show: true, step: 3, format }); // "Assembling PDF stream..."
        
        // Dynamically import to avoid SSR issues
        const [html2canvasModule, jsPDFModule] = await Promise.all([
          import('html2canvas'),
          import('jspdf')
        ]);
        
        const html2canvas = html2canvasModule.default;
        const jsPDF = jsPDFModule.default;

        // Ensure web fonts are completely ready in document context
        if (typeof document !== 'undefined' && (document as any).fonts) {
          try {
            await (document as any).fonts.ready;
          } catch (e) {
            console.warn("Fonts loading deferred", e);
          }
        }


        // Force a layout recalculation and wait for it to stabilize
        await new Promise(resolve => setTimeout(resolve, 300));

        const canvas = await html2canvas(resumeElement, {
          scale: 3, // High quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('resume-capture-area');
            if (el) {
              el.style.width = '794px';
              el.style.minHeight = '1123px';
              el.style.padding = '40px';
              el.style.boxSizing = 'border-box';
              el.style.overflow = 'visible';
              el.style.wordWrap = 'break-word';
              el.style.overflowWrap = 'break-word';
              el.style.whiteSpace = 'normal';
            }
          }
        });

        setExportStatus({ show: true, step: 4, format }); // "Finalizing file encoding..."
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
        
        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(
          canvas.toDataURL('image/png', 1.0),
          'PNG',
          0, 0,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        pdf.save(`${fullName || "Resume"}_CV.pdf`);

        useResumeStore.getState().lockResume();

        setExportStatus({ show: true, step: 5, format }); // "SUCCESS!"
        // Trigger confetti celebration!
        (window as any).triggerFrictionlessConfetti?.();
        await sleep(1200);

        setExportStatus(null);
        setHasExported(true);
        setShowPostDownloadModal(true);
        setTimeout(() => setShowFeedbackModal(true), 2000);
      } catch (err) {
        console.error(
          "PDF Generation Failed. Falling back to print method. Error:",
          err,
        );
        setExportStatus(null);
        handlePrint();
        setHasExported(true);
        useResumeStore.getState().lockResume();
      }
    } else if (format === "docx") {
      try {
        setExportStatus({ show: true, step: 1, format });
        await sleep(800);
        setExportStatus({ show: true, step: 3, format });
        await sleep(800);
        
        const resumeElement = document.getElementById('resume-capture-area');
        if (!resumeElement) throw new Error("Resume element not found");

        // Get all active styles to inject into exported document
        const styles = Array.from(document.styleSheets)
          .map(sheet => {
            try {
              return Array.from(sheet.cssRules || [])
                .map(rule => rule.cssText)
                .join('\n');
            } catch {
              return '';
            }
          })
          .join('\n');

        const htmlContent = `
          <!DOCTYPE html>
          <html dir="${document.documentElement.dir || 'ltr'}" xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
              <meta charset="UTF-8">
              <style>
                ${styles}
                /* Force proper rendering */
                * {
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
                  white-space: normal !important;
                  box-sizing: border-box !important;
                }
                body {
                  margin: 0;
                  padding: 0;
                  width: 794px;
                  font-family: Arial, sans-serif;
                }
              </style>
            </head>
            <body>
              ${resumeElement.outerHTML}
            </body>
          </html>
        `;
        
        // Use standard MS Word Blob application type
        const converted = new Blob(['\ufeff', htmlContent], {
            type: 'application/msword'
        });
        
        const url = URL.createObjectURL(converted);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fullName || 'CV'}_HashResume.doc`;
        a.click();
        URL.revokeObjectURL(url);

        useResumeStore.getState().lockResume();
        setExportStatus({ show: true, step: 5, format });
        // Trigger confetti celebration!
        (window as any).triggerFrictionlessConfetti?.();
        await sleep(1000);
        setExportStatus(null);
        setHasExported(true);
        setShowPostDownloadModal(true);
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
        setHasExported(true);
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
      id: "projects",
      label: String(language === "ar" ? "المشاريع" : "Projects"),
      shortLabel: String(language === "ar" ? "المشاريع" : "Projects"),
      icon: Folder,
      tourId: "projects-section",
    },
    {
      id: "certifications",
      label: String(language === "ar" ? "الشهادات" : "Certifications"),
      shortLabel: String(language === "ar" ? "الشهادات" : "Certs"),
      icon: Award,
      tourId: "certifications-section",
    },
    {
      id: "finish",
      label: String(language === "ar" ? "التحميل والتدقيق" : "Audit & Download"),
      shortLabel: String(language === "ar" ? "تحميل" : "Finish"),
      icon: Download,
      tourId: "review-section",
    },
  ];



  const sidebarCompletionMap: Record<string, number> = {
    basics: data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.jobTitle ? 100 : (data.personalInfo.fullName || data.personalInfo.email ? 50 : 0),
    experience: data.experience && data.experience.length > 0 ? 100 : 0,
    education: data.education && data.education.length > 0 ? 100 : 0,
    skills: data.skills && data.skills.length > 0 ? 100 : 0,
    certifications: data.certifications && data.certifications.length > 0 ? 100 : 0,
    finish: atsScore,
  };

  const formContent = (
    <div 
      className={cn(focusMode ? "max-w-[720px]" : "max-w-4xl", "mx-auto pb-[120px] sm:pb-32 relative")}
      onFocusCapture={(e) => {
        const target = e.target as HTMLElement;
        let section: string | null = null;
        const nameOrId = target.name || target.id || "";
        if (nameOrId === "summary" || nameOrId.includes("summary")) {
          section = "summary";
        } else if (target.closest("[id*='fullName'], [id*='email'], [id*='phone'], [id*='address'], [id*='linkedin'], [id*='github'], [id*='portfolio'], [id*='jobTitle'], [id*='nationality'], [id*='drivingLicense'], [id*='birthDate']")) {
          section = "personalInfo";
        } else {
          if (activeTab === "basics") {
            section = "personalInfo";
          } else {
            section = activeTab;
          }
        }
        useActiveSectionStore.getState().setActiveField(section);
      }}
      onBlurCapture={() => {
        useActiveSectionStore.getState().setActiveField(null);
      }}
    >
      {data.isLocked && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-amber-500/30 bg-amber-50 shadow-xs">
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  {language === 'ar' ? 'تم تحميل سيرتك — البيانات محمية' : 'Resume Downloaded — Data Locked'}
                </h3>
                <p className="text-xs text-amber-700 mt-1 font-medium">
                  {language === 'ar' ? 'يمكنك تغيير شكل القالب فقط. لتعديل البيانات يجب فتح القفل.' : 'You can only change the template. To edit data, you must unlock it.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('cv-is-locked');
                useResumeStore.getState().updateData({ ...data, isLocked: false });
                alert(language === 'ar' ? 'تنبيه: التعديل سيستلزم تحميل سيرتك مرة أخرى للحصول على النسخة المحدثة' : 'Alert: Editing will require you to download your resume again to get the updated version.');
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-2"
            >
              <span>✏️</span>
              {language === 'ar' ? 'تعديل السيرة' : 'Unlock to Edit'}
            </button>
          </div>
        </div>
      )}

                {!focusMode && ATS_SECTION_TIPS[language === "ar" ? "ar" : "en"]?.[activeTab] && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 transition-all overflow-hidden shadow-xs">
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
            {showAIBanner && data.personalInfo.fullName && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-start relative shadow-xs"
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
                        ? "هل ترغب في البدء بالبحث عن فرص وتوصيات عمل ذكية متوافقة تماماً مع سيرتك الذاتية؟"
                        : "Ready to explore live matches and job recommendation lists tailored to your resume?"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 self-end sm:self-center">
                  <Link
                    to="/hash-hunt"
                    className="flex-1 sm:flex-none text-center text-[10px] font-black bg-[#FF4D2D] hover:bg-[#E64528] text-white py-2.5 px-3.5 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    {language === "ar" ? "💼 ابحث عن وظائف" : "💼 Find Jobs (Hash Hunt)"}
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

            {/* Top Navigation Actions */}
            <div className="flex items-center justify-between mb-4 w-full px-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider hidden sm:block">
                {language === "ar" ? "التنقل بين الأقسام" : "Section Navigation"}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePrevTab}
                  disabled={!hasPrevTab}
                  title={language === "ar" ? "السابق" : "Previous"}
                  className={cn(
                    "p-2 rounded-xl border transition-all flex items-center justify-center",
                    hasPrevTab 
                      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm active:scale-95" 
                      : "bg-transparent border-slate-100 text-slate-300 cursor-not-allowed opacity-50"
                  )}
                >
                  <ArrowLeft size={16} className="rtl:-scale-x-100" />
                </button>
                <button
                  onClick={handleNextTab}
                  disabled={!hasNextTab}
                  title={language === "ar" ? "التالي" : "Next"}
                  className={cn(
                    "p-2 py-2 px-4 rounded-xl border transition-all flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider",
                    hasNextTab 
                      ? "bg-neutral-900 border-neutral-900 text-white hover:bg-black cursor-pointer shadow-md active:scale-95" 
                      : "bg-neutral-100 border-neutral-100 text-neutral-400 cursor-not-allowed opacity-50"
                  )}
                >
                   <span>{language === "ar" ? "التالي" : "Next"}</span>
                   <ArrowRight size={14} className="rtl:-scale-x-100" />
                </button>
              </div>
            </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={"tab-" + activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className={cn(data.isLocked && "pointer-events-none opacity-50 select-none")}
                    >
                      <Suspense fallback={<FormLoader />}>
                        {activeTab === "basics" && (
                        <div className="space-y-12">

                          <section>
                            <div className="flex items-center gap-4 mb-6 text-start">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F3F4F6] text-[#374151] relative overflow-hidden shrink-0 border border-slate-200/50">
                                <User
                                  size={22}
                                  className="relative z-10"
                                />
                              </div>
                              <div>
                                <h2 className="text-lg font-semibold text-[#111827] tracking-tight">
                                  {String(typeof t.personalInfo === 'string' ? t.personalInfo : "Personal Information")}
                                </h2>
                                <p className="text-[12px] text-[#9CA3AF] font-medium">
                                  {language === "ar"
                                    ? "بياناتك الأساسية ومعلومات التواصل"
                                    : "Basic details and contact info"}
                                </p>
                              </div>
                            </div>
                            <PersonalInfoForm />


                          </section>
                        </div>
                      )}
                      {activeTab === "experience" && (
                        <div className="space-y-12" data-form-section="experience">
                          <section>
                            <div className="flex items-center gap-4 mb-6 text-start px-1">
                              <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#374151] relative overflow-hidden shrink-0 border border-slate-200/50">
                                <Briefcase
                                  size={22}
                                  className="relative z-10"
                                />
                              </div>
                              <div>
                                <h2 className="text-lg font-semibold text-[#111827] tracking-tight">
                                  {String(t.experience?.title || "Experience")}
                                </h2>
                                <p className="text-[12px] text-[#9CA3AF] font-medium">
                                  {language === "ar"
                                    ? "تاريخك المهني وإنجازاتك"
                                    : "Work history and achievements"}
                                </p>
                              </div>
                            </div>
                            <div className="px-1">
                              <ExperienceForm />
                            </div>


                          </section>
                        </div>
                      )}
                      {activeTab === "education" && (
                        <div className="space-y-12" data-form-section="education">
                          <section>
                            <div className="flex items-center gap-4 mb-6 text-start px-1">
                              <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#374151] relative overflow-hidden shrink-0 border border-slate-200/50">
                                <GraduationCap
                                  size={22}
                                  className="relative z-10"
                                />
                              </div>
                              <div>
                                <h2 className="text-lg font-semibold text-[#111827] tracking-tight">
                                  {String(t.education?.title || "Education")}
                                </h2>
                                <p className="text-[12px] text-[#9CA3AF] font-medium">
                                  {language === "ar"
                                    ? "خلفيتك الأكاديمية والتعليمية"
                                    : "Academic background"}
                                </p>
                              </div>
                            </div>
                            <div className="px-1">
                              <EducationForm />
                            </div>


                          </section>
                        </div>
                      )}
                      {activeTab === "skills" && (
                        <section data-form-section="skills">
                          <div className="flex items-center gap-4 mb-6 text-start">
                            <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#374151] relative overflow-hidden shrink-0 border border-slate-200/50">
                              <Wrench
                                size={22}
                                className="relative z-10"
                              />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-[#111827] tracking-tight">
                                {String(typeof t.skills?.title === 'string' ? t.skills.title : "Skills")}
                              </h2>
                              <p className="text-[12px] text-[#9CA3AF] font-medium">
                                {language === "ar"
                                  ? "مهاراتك التقنية والشخصية"
                                  : "Tech & soft skills"}
                              </p>
                            </div>
                          </div>
                          <SkillsForm />


                        </section>
                      )}
                      {activeTab === "projects" && (
                        <section data-form-section="projects">
                          <div className="flex items-center gap-4 mb-6 text-start">
                            <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#374151] relative overflow-hidden shrink-0 border border-slate-200/50">
                              <LayoutTemplate
                                size={22}
                                className="relative z-10"
                              />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-[#111827] tracking-tight">
                                {String(t.projects?.title || "Projects")}
                              </h2>
                              <p className="text-[12px] text-[#9CA3AF] font-medium">
                                {language === "ar"
                                  ? "أرنا أفضل أعمالك ومشاريعك"
                                  : "Showcase your best work and projects"}
                              </p>
                            </div>
                          </div>
                          <ProjectsForm />


                        </section>
                      )}
                      {activeTab === "certifications" && (
                        <section data-form-section="certifications">
                          <div className="flex items-center gap-4 mb-6 text-start">
                            <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#374151] relative overflow-hidden shrink-0 border border-slate-200/50">
                              <Award
                                size={22}
                                className="relative z-10"
                              />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-[#111827] tracking-tight">
                                {String(t.certifications?.title || "Certifications")}
                              </h2>
                              <p className="text-[12px] text-[#9CA3AF] font-medium">
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
                              onClick={() => setActiveTab("finish")}
                              className="group flex items-center gap-3 bg-[#FF4D2D] hover:bg-[#E03C1E] text-white px-8 py-4 rounded-2xl font-bold border border-transparent shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition-all active:scale-95 cursor-pointer"
                            >
                              {language === "ar"
                                ? "الذهاب للمراجعة والتحميل"
                                : "Go to Review & Download"}
                              <ArrowRight
                                size={20}
                                className="group-hover:translate-x-1 transition-transform rtl:rotate-180 group-hover:rtl:-translate-x-1"
                              />
                            </button>
                          </div>
                        </section>
                      )}
                      {activeTab === "finish" && (
                        <FinishStep
                          onPrint={handleProceedToExport}
                          onExportWord={() => handleProceedToExport("docx")}
                          onJumpToStep={(step) => setActiveTab(step as Tab)}
                        />
                      )}
                      </Suspense>
                    </motion.div>
                  </AnimatePresence>
                </div>
  );

  const handleShareLink = () => {
    const shareId = "demo-premium-link-123";
    const domain = window.location.origin;
    const shareUrl = `${domain}/share/${shareId}`;
    navigator.clipboard.writeText(shareUrl);
    alert(language === 'ar' ? 'تم نسخ الرابط! (يجب ترقية الحساب للتفعيل)' : 'Link copied to clipboard! (Premium feature)');
  };

  return (
    <div
      className={cn(
        "flex flex-col h-[100dvh] bg-[#F9FAFB] overflow-hidden transition-colors duration-200",
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
        <link rel="canonical" href="https://hashresume.com/editor" />
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
          onOpenPreview={() => setShowMobilePreview(true)}
          onOpenAts={() => setShowMobileAtsPanel(true)}
        >
          <main ref={formRef} onScroll={handleFormScroll} className="w-full h-full overflow-y-auto pb-6 relative scrollbar-none editor-form-scrollable">
            <div className="min-h-full flex flex-col">
              <div className="flex-1 px-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -8, filter: "blur(2px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 8, filter: "blur(2px)" }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    {formContent}
                  </motion.div>
                </AnimatePresence>
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
        onShareLink={handleShareLink}
        onTogglePreview={() => setShowFullPreview(!showFullPreview)}
        previewOpen={showFullPreview}
        isLocked={data.isLocked}
        onBackToHome={() => { window.location.href = "/"; }}
        onShowSettings={() => setIsSettingsModalOpen(true)}
        onShowShortcuts={() => setShowKeyboardShortcuts(true)}
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode(!focusMode)}
      />

      {/* Real-time Progress tracker moved to tabs and dock */}

      <PanelGroup
        orientation={isMobile ? "vertical" : "horizontal"}
        className="flex-1 w-full h-full overflow-hidden relative editor-form"
        dir="ltr"
      >
        {/* Editor Area */}
        <Panel defaultSize={65} minSize={30} className="block">
          <div className={cn("flex flex-col h-full overflow-hidden relative transition-all duration-300", focusMode ? "bg-white" : "bg-[#F9FAFB]")} dir={dir}>
            
            <main
              ref={formRef}
              onScroll={handleFormScroll}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className={cn(
                "flex-1 overflow-y-auto p-4 sm:p-8 sm:pt-6 pb-36 sm:pb-32 scroll-smooth relative",
                focusMode ? "bg-white" : ""
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full"
                >
                  {formContent}
                </motion.div>
              </AnimatePresence>
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

            {/* Absolute-positioned Floating Section Dock inside the Editor workspace panel */}
            {!isMobile && !focusMode && (
              <div 
                className="absolute bottom-6 inset-x-0 mx-auto z-40 px-4 flex justify-center pointer-events-none"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                <div 
                  className="pointer-events-auto bg-[#252525]/90 backdrop-blur-3xl border border-white/10 rounded-full py-2 px-3 flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.25)] select-none"
                >
                  <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none relative">
                    {tabs.map((tab, idx) => {
                      const isActive = activeTab === tab.id;
                      const IconComponent = tab.icon;
                      
                      const isLast = idx === tabs.length - 1;

                      if (isLast) {
                        return (
                          <div key={tab.id} className="flex flex-row items-center relative group">
                            {/* Rich Interactive Tooltip */}
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] sm:text-xs font-bold py-1.5 px-3 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.3)] border border-slate-800 z-50 whitespace-nowrap">
                              {tab.label}
                            </div>
                            
                            <div className="h-6 w-[1px] bg-white/10 shrink-0 mx-2" />
                            <button
                              onClick={() => {
                                setActiveTab(tab.id as Tab);
                                scrollToFormTop();
                              }}
                              className={cn(
                                "relative w-12 h-10 sm:w-14 sm:h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 focus:outline-none ml-1",
                                isActive ? "text-[#FF4D2D]" : "text-[#FF4D2D]/70 hover:text-[#FF4D2D] hover:bg-white/5"
                              )}
                              title={tab.label}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="activeTabIndicatorDesktop"
                                  className="absolute inset-0 bg-white/15 rounded-full"
                                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                />
                              )}
                              <span className="relative z-10 flex items-center justify-center">
                                <IconComponent strokeWidth={isActive ? 2.2 : 1.8} className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#FF4D2D]" />
                              </span>
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div key={tab.id} className="relative group flex flex-col items-center">
                          {/* Rich Interactive Tooltip */}
                          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] sm:text-xs font-bold py-1.5 px-3 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.3)] border border-slate-800 z-50 whitespace-nowrap">
                            {tab.label}
                          </div>
                          
                          <button
                            onClick={() => {
                              setActiveTab(tab.id as Tab);
                              scrollToFormTop();
                            }}
                            className={cn(
                              "relative w-12 h-10 sm:w-14 sm:h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 focus:outline-none",
                              isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                          >
                            {/* Animated Active Liquid Pill Background */}
                            {isActive && (
                              <motion.div
                                layoutId="activeTabIndicatorDesktop"
                                className="absolute inset-0 bg-white/20 rounded-full"
                                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                              />
                            )}

                            {/* Icon above background */}
                            <span className="relative z-10 flex items-center justify-center">
                              <IconComponent strokeWidth={isActive ? 2 : 1.5} className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
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
              defaultSize={35}
              minSize={25}
              className="w-full h-full"
            >
          <div
            data-tour="preview-pane"
            className="bg-neutral-100 border-s border-neutral-200 flex-col flex h-full overflow-hidden relative transition-colors duration-200"
          >
            {/* Custom Spacing controls floats */}
            {showMicroSpacingPanel && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-[68px] end-6 z-30 w-72 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-slate-200/90 p-5 space-y-4 font-sans select-none"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <SlidersHorizontal size={13} className="text-[#FF4D2D]" />
                    {language === "ar" ? "خيارات المسافات" : "Spacing Options"}
                  </h4>
                  <button 
                    onClick={() => setShowMicroSpacingPanel(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      localStorage.setItem('cv-spacing', 'compact');
                      window.dispatchEvent(new Event('cv-spacing-changed'));
                    }}
                    className="w-full text-start p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-colors"
                  >
                    <div className="font-bold text-sm text-slate-800">Compact</div>
                    <div className="text-xs text-slate-500">
                      {language === "ar" ? "لو السيرة طويلة وعايز تضغطها في صفحة واحدة" : "If the resume is long and you want to fit it on one page"}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('cv-spacing', 'standard');
                      window.dispatchEvent(new Event('cv-spacing-changed'));
                    }}
                    className="w-full text-start p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-colors"
                  >
                    <div className="font-bold text-sm text-slate-800">Standard</div>
                    <div className="text-xs text-slate-500">
                      {language === "ar" ? "الافتراضي" : "Default"}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('cv-spacing', 'spacious');
                      window.dispatchEvent(new Event('cv-spacing-changed'));
                    }}
                    className="w-full text-start p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-colors"
                  >
                    <div className="font-bold text-sm text-slate-800">Spacious</div>
                    <div className="text-xs text-slate-500">
                      {language === "ar" ? "لو السيرة قصيرة وعايز تملا الصفحة" : "If the resume is short and you want to fill the page"}
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ATS Trust Guard badge */}
            <div 
              className="absolute top-[68px] start-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-sm text-emerald-800 text-[10px] sm:text-xs font-black select-none pointer-events-auto"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 animate-pulse" />
              <span>
                {language === "ar" 
                  ? "متوافقة ومكتوبة للفرز (ATS-Friendly 100%)" 
                  : "ATS Text-Extractable Guard Active (100% Readable)"}
              </span>
            </div>
            <div className="h-14 bg-white/95 backdrop-blur-sm border-b border-neutral-200/80 flex items-center justify-between px-6 shrink-0 absolute top-0 start-0 end-0 z-10 transition-colors duration-200 transform-gpu shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-slate-800 bg-slate-100/80 rounded-xl px-3 py-1.5 border border-slate-200/60 shadow-inner">
                  <LayoutTemplate size={14} className="text-brand-500 animate-pulse" />
                  <span className="text-xs font-black tracking-wide font-sans">
                    {language === "ar" ? "المعاينة التفاعلية" : "Live Preview"}
                  </span>
                </div>

                {/* ATS Live Icon/Pill Block */}
                <div className="relative">
                  <div
                    onClick={() => setShowAtsAestheticPanel(!showAtsAestheticPanel)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] sm:text-xs font-extrabold cursor-pointer transition-all hover:scale-103 select-none",
                      atsScore >= 80 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-xs shadow-emerald-100/50" 
                        : atsScore >= 50
                        ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 shadow-xs shadow-amber-100/50"
                        : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 shadow-xs shadow-rose-100/50"
                    )}
                    title={language === "ar" ? "تدقيق الـ ATS المباشر" : "ATS Live Audit"}
                  >
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full z-10 shrink-0",
                      atsScore >= 80 ? "bg-emerald-500 animate-pulse" : atsScore >= 50 ? "bg-amber-500 animate-pulse" : "bg-rose-500"
                    )} />
                    <span className="font-semibold text-[10px] sm:text-xs hidden mini:inline">{language === "ar" ? "تطابق ATS:" : "ATS Match:"}</span>
                    <span className="font-extrabold font-mono text-[11px] sm:text-xs z-10 shrink-0">{atsScore}%</span>
                  </div>

                  {showAtsAestheticPanel && (
                    <div 
                      className={cn(
                        "absolute z-30 top-11 mt-1 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 text-slate-800 font-sans",
                        language === "ar" ? "start-0" : "left-0"
                      )}
                      dir={language === "ar" ? "rtl" : "ltr"}
                    >
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                        <span className="text-xs font-black text-slate-900">⚡ {language === "ar" ? "تحليل نقاط التطابق المباشر الـ ATS" : "ATS Live Extraction Audit"}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowAtsAestheticPanel(false); }}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>

                      <div className="mt-3 space-y-3 font-normal">
                        {/* Interactive progress bar */}
                        <div>
                          <div className="flex justify-between text-[11px] mb-1 font-bold">
                            <span className="text-slate-500">{language === "ar" ? "مؤشر تطابق المستخرجات" : "Overall Compatibility"}</span>
                            <span className={atsScore >= 80 ? "text-emerald-600 font-black" : atsScore >= 50 ? "text-amber-600 font-black" : "text-rose-600 font-black"}>{atsScore}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                atsScore >= 80 ? "bg-emerald-500" : atsScore >= 50 ? "bg-amber-500" : "bg-rose-500"
                              )}
                              style={{ width: `${atsScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Summary rating */}
                        <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
                          {language === "ar"
                            ? atsScore >= 80
                              ? "تهانينا! سيرتك الذاتية ممتازة ومبنية بأقوى معايير التوظيف والفرز."
                              : atsScore >= 50
                              ? "سيرتك جيدة، لكن ننصح بإضافة بضعة أرقام لنتائج عملك وتفاصيل مهاراتك الفنية للارتقاء بها."
                              : "تحتاج سيرتك لإضافة معلومات اتصال كاملة وخبرة مفصلة لتمكين مراجعتها وجذب المستخرج الآلي."
                            : atsScore >= 80
                            ? "Splendid work! Your resume matches industry-standard ATS extraction norms beautifully."
                            : atsScore >= 50
                            ? "Good start. We recommend adding quantitative metrics and professional social links to boost extraction score."
                            : "Provide contact details, summary sentences, and experience items to activate extraction."}
                        </p>

                        {/* Section Breakdown Mini */}
                        <div className="border-t border-slate-100 pt-3 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {calculateATSScore(data).sections.map((sect, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[10px] py-0.5">
                              <span className="text-slate-500 font-medium">
                                {sect.title === "Contact Info" 
                                  ? (language === "ar" ? "بيانات التواصل" : "Contact Details") 
                                  : sect.title === "Experience Bullet Points" 
                                  ? (language === "ar" ? "صياغة نقاط وبروتوكولات الخبرة" : "Experience Verbs & Metrics") 
                                  : sect.title === "Experience Formatting" 
                                  ? (language === "ar" ? "تنسيق عناصر الخبرة" : "Experience Bullets") 
                                  : sect.title === "Summary" 
                                  ? (language === "ar" ? "الملخص المهني" : "Professional Summary") 
                                  : sect.title === "Skills Section" 
                                  ? (language === "ar" ? "قسم المهارات الفنية" : "Skills Range") 
                                  : sect.title}
                              </span>
                              <span className="font-black font-mono text-slate-800">{sect.score} / {sect.maxScore}</span>
                            </div>
                          ))}
                        </div>

                        {calculateATSScore(data).tips.length > 0 && (
                          <div className="border-t border-slate-100 pt-2.5">
                            <span className="text-[10px] font-black block mb-1 text-slate-800">💡 {language === "ar" ? "توصيات فورية لتحسين النسبة والبروز:" : "Key Recommendation:"}</span>
                            <p className="text-[10px] text-slate-700 bg-slate-50/80 p-2 rounded-xl border border-slate-100 leading-normal font-sans">
                              {calculateATSScore(data).tips[0]}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {!data.isLocked && (
                  <div className="hidden sm:flex items-center gap-2 border-s border-slate-200/80 ps-3">
                    <button
                      onClick={() => setIsSettingsModalOpen(true)}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-brand-50 to-orange-50 border border-brand-200/60 text-brand-650 hover:shadow hover:-translate-y-px transition-all cursor-pointer"
                    >
                      <Sparkles size={13} className="animate-pulse text-orange-500" />
                      {language === "ar" ? "السمات والقوالب" : "Theme Station"}
                    </button>
                    <button
                      onClick={() => setShowMicroSpacingPanel(!showMicroSpacingPanel)}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border cursor-pointer",
                        showMicroSpacingPanel 
                          ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                      )}
                    >
                      <SlidersHorizontal size={13} className={showMicroSpacingPanel ? "text-brand-400" : "text-slate-400"} />
                      {language === "ar" ? "الهوامش والأبعاد" : "Micro-Spacing"}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile specific settings button if hidden above */}
                {!data.isLocked && (
                  <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="sm:hidden p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-200/50"
                  >
                    <Sparkles size={16} />
                  </button>
                )}
                {/* Mobile specific micro spacing button */}
                <button
                  onClick={() => setShowMicroSpacingPanel(!showMicroSpacingPanel)}
                  className={cn(
                    "sm:hidden p-2 rounded-lg transition-colors border",
                    showMicroSpacingPanel 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <SlidersHorizontal size={16} />
                </button>
                <button
                  onClick={() => setShowFullPreview(true)}
                  className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm"
                  title={String(t.fullPreview || "")}
                >
                  <Maximize2 size={14} />
                  <span className="hidden sm:inline text-xs font-bold">{language === "ar" ? "تكبير" : "Expand"}</span>
                </button>
              </div>
            </div>

            {/* Page Overflow Indicator Alert banner */}
            <AnimatePresence>
              {overflowLines > 0 && (
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

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-12 pt-24 md:pt-24 flex flex-col items-center justify-start bg-[#F3F4F6] relative">
              <div
                className="origin-top transition-all duration-500 flex justify-center scale-[0.4] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.8] xl:scale-[0.9] h-[calc(297mm*0.4)] sm:h-[calc(297mm*0.6)] md:h-[calc(297mm*0.75)] lg:h-[calc(297mm*0.8)] xl:h-[calc(297mm*0.9)]"
              >
                <div
                  className="bg-white shadow-premium rounded-md overflow-hidden w-[210mm] min-h-[297mm] shrink-0"
                >
                  <Suspense fallback={<FormLoader />}>
                    <ResumePreview ref={componentRef} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </Panel>
        </>
        )}
      </PanelGroup>
      </>
      )}

      {/* Mobile Live Preview Overlay */}
      <AnimatePresence>
        {showMobilePreview && (
          <div key="mobile-preview-container" className="md:hidden fixed inset-0 z-[100] flex flex-col">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobilePreview(false)}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-neutral-100 shadow-premium z-[110] flex flex-col overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 shrink-0"
                style={{ background: '#fff', borderBottom: '1px solid var(--color-neutral-100)' }}
              >
                <div className="flex items-center gap-2">
                  <LayoutTemplate size={18} className="text-brand-500" />
                  <span className="text-sm font-black text-neutral-900">
                    {language === "ar" ? "معاينة السيرة الذاتية" : "Resume Preview"}
                  </span>
                </div>
              
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors active:scale-95 bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-x-hidden overflow-y-auto w-full p-2 sm:p-4 flex flex-col items-center bg-slate-200/50">
                <div
                  className="origin-top transition-all flex justify-center scale-[0.4] sm:scale-[0.45] origin-top opacity-100"
                  style={{ 
                    width: "210mm",
                    height: "297mm",
                    marginBottom: "-170mm" // roughly 297 * 0.6
                  }}
                >
                  <div
                    className="bg-white shadow-premium rounded-sm overflow-hidden shrink-0 w-[210mm] min-h-[297mm]"
                  >
                    <Suspense fallback={<FormLoader />}>
                      <ResumePreview ref={componentRef} />
                    </Suspense>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile ATS Info Panel Overlay */}
      <AnimatePresence>
        {showMobileAtsPanel && (
          <div key="mobile-ats-container" className="md:hidden fixed inset-0 z-[100] flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileAtsPanel(false)}
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-[2rem] shadow-premium z-[110] flex flex-col overflow-hidden max-h-[85vh] relative"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1" />
              <div
                className="flex items-center justify-between p-4 shrink-0 border-b border-neutral-100"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${atsScore >= 80 ? "bg-emerald-500 animate-pulse" : atsScore >= 50 ? "bg-amber-500 animate-pulse" : "bg-rose-500"}`} />
                  <span className="text-sm font-black text-neutral-900">
                    {language === "ar" ? "تحليل تطابق ATS المباشر" : "Live ATS Sync Details"}
                  </span>
                </div>
                <button
                  onClick={() => setShowMobileAtsPanel(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors active:scale-95 bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-x-hidden overflow-y-auto w-full p-6 text-slate-800">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-500">{language === "ar" ? "مؤشر التوافق الكلي" : "Overall Compatibility"}</span>
                    <span className={`text-4xl font-black ${atsScore >= 80 ? "text-emerald-500" : atsScore >= 50 ? "text-amber-500" : "text-rose-500"}`}>{atsScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${atsScore >= 80 ? "bg-emerald-500" : atsScore >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                      style={{ width: `${atsScore}%` }}
                    />
                  </div>
                  
                  <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl">
                    {language === "ar"
                      ? atsScore >= 80
                        ? "تهانينا! سيرتك الذاتية ممتازة ومبنية بأقوى معايير التوظيف والفرز."
                        : atsScore >= 50
                        ? "سيرتك جيدة، لكن ننصح بإضافة بضعة أرقام لنتائج عملك وتفاصيل مهاراتك الفنية للارتقاء بها."
                        : "تحتاج سيرتك لإضافة معلومات اتصال كاملة وخبرة مفصلة لتمكين مراجعتها وجذب المستخرج الآلي."
                      : atsScore >= 80
                      ? "Splendid work! Your resume matches industry-standard ATS extraction norms beautifully."
                      : atsScore >= 50
                      ? "Good start. We recommend adding quantitative metrics and professional social links to boost extraction score."
                      : "Provide contact details, summary sentences, and experience items to activate extraction."}
                  </p>

                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">{language === "ar" ? "تفصيل أقسام السيرة" : "Section Breakdown"}</h4>
                  <div className="space-y-3 mb-8">
                    {calculateATSScore(data).sections.map((sect, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-lg">
                        <span className="text-slate-600 font-medium">
                          {sect.title === "Contact Info" ? (language === "ar" ? "بيانات التواصل" : "Contact Details") 
                            : sect.title === "Experience Bullet Points" ? (language === "ar" ? "صياغة نقاط وبروتوكولات الخبرة" : "Experience Verbs") 
                            : sect.title === "Experience Formatting" ? (language === "ar" ? "تنسيق عناصر الخبرة" : "Experience Details") 
                            : sect.title === "Summary" ? (language === "ar" ? "الملخص المهني" : "Summary") 
                            : sect.title === "Skills Section" ? (language === "ar" ? "المهارات الفنية" : "Skills Range") 
                            : sect.title}
                        </span>
                        <span className="font-black text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md">{sect.score} / {sect.maxScore}</span>
                      </div>
                    ))}
                  </div>

                  {calculateATSScore(data).tips.length > 0 && (
                    <div className="bg-[#FF4D2D]/5 border border-[#FF4D2D]/20 rounded-2xl p-4 mb-4">
                      <span className="text-xs font-black block mb-2 text-[#FF4D2D] uppercase tracking-wide">💡 {language === "ar" ? "توصيات فورية" : "Recommendation"}</span>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {calculateATSScore(data).tips[0]}
                      </p>
                    </div>
                  )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modals */}
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
        <LinkedInImportModal
          isOpen={isLinkedInModalOpen}
          onClose={() => setIsLinkedInModalOpen(false)}
        />

        {/* Mobile Quick Toggle FAB */}
        {isMobile && (
          <div className="fixed bottom-24 right-4 z-[90]">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFullPreview(!showFullPreview)}
              className="bg-slate-900 text-white w-14 h-14 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center border border-slate-700"
            >
              {showFullPreview ? <FileEdit size={24} /> : <Eye size={24} />}
            </motion.button>
          </div>
        )}

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
                      className="bg-white hover:bg-neutral-100 text-neutral-950 px-6 py-4 rounded-full flex items-center gap-2 font-black transition-all text-xs shadow-premium hover:scale-105 active:scale-95 uppercase tracking-widest cursor-pointer"
                    >
                      <Download size={18} className="text-[#FF4D2D] stroke-[2.5]" />
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

                <div className="w-full max-w-[210mm] bg-neutral-50 shadow-premium rounded-sm overflow-hidden shrink-0 mb-20 ring-1 ring-white/20">
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
                className="bg-white rounded-3xl shadow-premium w-full max-w-sm overflow-hidden border border-slate-100 p-8 text-center space-y-6"
              >
                {/* Visual loader matching premium look */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-[#FF4D2D] border-t-transparent"
                  />
                  <span className="text-xl font-black text-slate-900">
                    {Math.min(100, exportStatus.step * 20)}%
                  </span>
                </div>

                {/* Premium Step-by-Step Linear Progress Track */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden relative border border-slate-200/40 p-0.5">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(100, exportStatus.step * 20)}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    className="h-full bg-gradient-to-r from-[#FF4D2D] to-orange-500 rounded-full"
                  />
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



        {/* Exit Intent Modal */}
        <AnimatePresence>
          {showExitModal && (
            <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center border border-slate-100"
              >
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {language === "ar" ? "سيرتك محفوظة — متنساش تكملها!" : "Your progress is saved!"}
                </h3>
                <p className="text-slate-500 mb-8 font-medium">
                  {language === "ar" 
                    ? "بياناتك متسجلة على المتصفح ده، تقدر ترجع في أي وقت وتكمل بناء وتنزيل سيرتك، متقلقش." 
                    : "Your data is safely stored in this browser. You can return anytime to finish and export your resume."}
                </p>
                <div className="flex gap-3 flex-col-reverse sm:flex-row">
                  <button
                    onClick={() => {
                      setShowExitModal(false);
                      // Let them leave natively if they click multiple times?
                      // We'll just hide the modal, they can figure out closing the tab it again.
                    }}
                    className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    {language === "ar" ? "فهمت، هقفل" : "Got it, close"}
                  </button>
                  <button
                    onClick={() => setShowExitModal(false)}
                    className="flex-1 py-3 px-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 shadow-md shadow-brand-500/20 transition-all"
                  >
                    {language === "ar" ? "خليني أكمل" : "Keep editing"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {showConfetti && <FrictionlessConfetti />}
    </div>
  );
}
