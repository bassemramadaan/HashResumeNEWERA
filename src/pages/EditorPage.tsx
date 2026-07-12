import React, { useState, useRef, useEffect, Suspense, lazy, useCallback } from "react";
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
  ExternalLink,
  Info,
} from "lucide-react";
import { useResumeStore, flushResumeStorage } from "../store/useResumeStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { useActiveSectionStore } from "../store/useActiveSectionStore";
import { Link } from "react-router-dom";
import { translations } from "../i18n/translations";
import SettingsModal from "../components/SettingsModal";
import KeyboardShortcutsModal from "../components/KeyboardShortcutsModal";
import { cn } from "@/lib/utils";
import { calculateATSScore } from "../utils/ats";
import EmptyState from "../components/editor/EmptyState";
import EditorNavbar from "../components/editor/EditorNavbar";
import MobileEditorLayout from "../components/editor/MobileEditorLayout";
import LiveAtsScoreWidget from "../components/editor/LiveAtsScoreWidget";
import ResumePreview from "../components/preview/ResumePreview";
import { JobMatchAdvisor } from "../components/editor/JobMatchAdvisor";
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
const OneClickMagicModal = lazy(
  () => import("../components/editor/OneClickMagicModal"),
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

import { Tab, TabItem } from "../types/editor.types";
import { ATS_SECTION_TIPS } from "../constants/editor.constants";
import { ProgressTrackerModal } from "../components/editor/ProgressTrackerModal";


import { useResumeEditorState } from "../hooks/editor/useResumeEditorState";
import { useResumeValidation } from "../hooks/editor/useResumeValidation";
import { useAutoSave } from "../hooks/editor/useAutoSave";
import { useFocusMode } from "../hooks/editor/useFocusMode";
import { useDeviceState } from "../hooks/useDeviceState";


const LockedOverlay = ({ lang }: { lang: string }) => {
  const isAr = lang === "ar";
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/70">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-5">
        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto text-brand-500 mb-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
        <h3 className="font-black text-xl text-slate-800">
          {isAr ? "السيرة الذاتية مقفلة" : "Resume Locked"}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          {isAr 
            ? "لقد قمت بتحميل النسخة النهائية. لا يمكنك تعديل هذه النسخة مجدداً."
            : "You have downloaded the final version. You cannot edit this version again."}
        </p>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mt-2">
          <p className="text-xs text-amber-800 font-bold leading-relaxed mb-3">
            {isAr
              ? "إذا كنت ترغب في إجراء تعديل بسيط، يمكنك التواصل معنا عبر الواتساب."
              : "If you need to make a simple edit, you can contact us via WhatsApp."}
          </p>
          <a
            href="https://wa.me/201101007965?text=Hello,%20I%20need%20a%20quick%20edit%20to%20my%20Hash%20Resume."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs text-white transition-all active:scale-[0.98] shadow-md shadow-emerald-500/10 cursor-pointer"
            style={{ backgroundColor: '#128C7E' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            {isAr ? "طلب تعديل عبر الواتساب" : "Request Edit via WhatsApp"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default function EditorPage() {
  const { language, dir, setLanguage } = useLanguageStore();
  const t = (translations[language as keyof typeof translations] || translations.en).editor;

  const {
    activeTab,
    setActiveTab,
    formRef,
    handleTouchStart,
    handleTouchEnd,
    scrollToFormTop,
    hasNextTab,
    hasPrevTab,
    handleNextTab,
    handlePrevTab,
  } = useResumeEditorState();

  const [isTipsOpen, setIsTipsOpen] = useState(true);
  const [showAIBanner, setShowAIBanner] = useState(true);
  const [showMicroSpacingPanel, setShowMicroSpacingPanel] = useState(false);
  const [aiNotice, setAiNotice] = useState<{ code: string; message: string } | null>(null);

  useEffect(() => {
    const handleAIErrorEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ code: string; message: string }>;
      if (customEvent && customEvent.detail) {
        setAiNotice({
          code: customEvent.detail.code,
          message: customEvent.detail.message,
        });
        
        // Auto-dismiss after 8 seconds
        setTimeout(() => {
          setAiNotice(prev => prev?.code === customEvent.detail.code ? null : prev);
        }, 8000);
      }
    };
    
    window.addEventListener("ai:error", handleAIErrorEvent);
    return () => {
      window.removeEventListener("ai:error", handleAIErrorEvent);
    };
  }, []);

  const { focusMode, setFocusMode } = useFocusMode();

  const { isMobile, isDesktop } = useDeviceState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTipsOpen(isDesktop);
    }
  }, [isDesktop]);

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
  }, [activeTab, formRef]);
  
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

    const handleOpenMagicModal = () => {
      setIsMagicModalOpen(true);
    };

    const handleBeforeUnload = () => {
      flushResumeStorage();
    };

    window.addEventListener("preview-section-clicked", handlePreviewSectionClick);
    window.addEventListener("open-import-modal", handleOpenImportModal);
    window.addEventListener("open-magic-modal", handleOpenMagicModal);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("preview-section-clicked", handlePreviewSectionClick);
      window.removeEventListener("open-import-modal", handleOpenImportModal);
      window.removeEventListener("open-magic-modal", handleOpenMagicModal);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [setActiveTab]);
  


  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [mobileZoom, setMobileZoom] = useState(0.45);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleFormScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 300);
  };
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasExported, setHasExported] = useState(false); // Track if user exported session
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPostDownloadModal, setShowPostDownloadModal] = useState(false);
  const [currentPurchasedCodes, setCurrentPurchasedCodes] = useState<string[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showResumeChecker, setShowResumeChecker] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [previewFocusMode, setPreviewFocusMode] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    show: boolean;
    step: number;
    format: "pdf" | "docx" | "txt";
  } | null>(null);
  const [overflowLines, setOverflowLines] = useState(0);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [isMagicModalOpen, setIsMagicModalOpen] = useState(false);
  const [showAtsAestheticPanel, setShowAtsAestheticPanel] = useState(false);
  const [showMobileAtsPanel, setShowMobileAtsPanel] = useState(false);
  const [rightPanelMode, setRightPanelMode] = useState<"preview" | "ats">("preview");
  const [mobileAtsTab, setMobileAtsTab] = useState<"audit" | "match">("audit");
  const [confirmAction, setConfirmAction] = useState<{
    type: "load" | "clear";
    message: string;
  } | null>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  const [showIframeBanner, setShowIframeBanner] = useState(true);

  useEffect(() => {
    try {
      setIsIframe(window.self !== window.top);
    } catch {
      setIsIframe(true);
    }
  }, []);

  const fullName = useResumeStore((state) => state.data.personalInfo.fullName);
  const data = useResumeStore((state) => state.data);
  const isStarted = useResumeStore((state) => state.isStarted);
  const setIsStarted = useResumeStore((state) => state.setIsStarted);
  
  const { isPremium, isEmpty, atsScore, breakdown } = useResumeValidation(data);
  const { saveStatus } = useAutoSave(data);

  const loadExampleData = useResumeStore((state) => state.loadExampleData);
  const resetData = useResumeStore((state) => state.resetData);
  const settings = useResumeStore((state) => state.data.settings);
  const updateSettings = useResumeStore((state) => state.updateSettings);

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
    if (activeTab === "finish" && !isPremium) {
      setShowPaymentModal(true);
    }
  }, [activeTab, isPremium]);

  useEffect(() => {
    if (data.settings?.template) {
      trackEvent(FUNNEL_EVENTS.TEMPLATE_CHOSEN, {
        templateId: data.settings.template,
      });
    }
  }, [data.settings?.template]);

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
      if (e.key === "Escape") {
        if (previewFocusMode) {
          setPreviewFocusMode(false);
        }
      }
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
  }, [temporalState.canUndo, temporalState.canRedo, previewFocusMode]);

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
  const isLocked = data.isLocked || false;

  const generateFingerprint = useCallback((cvData: typeof data): string => {
    const str = JSON.stringify({
      personalInfo: cvData.personalInfo,
      workExperience: cvData.experience,
      education: cvData.education,
      skills: cvData.skills,
    });
    // Simple hash
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }, []);

  // بعد كل Download ناجح
  const onSuccessfulDownload = () => {
    const fingerprint = generateFingerprint(data);
    const snapshot = JSON.stringify(data);
    localStorage.setItem('cv-last-download-fingerprint', fingerprint);
    localStorage.setItem('cv-last-download-snapshot', snapshot);
  };

  // قبل كل Download
  const checkCanDownload = (): 'free' | 'needs-code' | 'first-time' => {
    const savedFingerprint = localStorage.getItem('cv-last-download-fingerprint');
    if (!savedFingerprint) return 'first-time';
    
    const currentFingerprint = generateFingerprint(data);
    if (currentFingerprint === savedFingerprint) return 'free';
    
    return 'needs-code';
  };

  const handlePrint = () => {
    try {
      const resumeElement = document.getElementById("resume-capture-area");
      if (!resumeElement) {
        console.error("Resume capture area not found for print");
        window.print();
        return;
      }

      // Check if already exists
      let printContainer = document.getElementById("resume-print-container");
      if (!printContainer) {
        printContainer = document.createElement("div");
        printContainer.id = "resume-print-container";
        const clone = resumeElement.cloneNode(true) as HTMLElement;
        clone.id = "resume-print-capture-area";
        printContainer.appendChild(clone);
        document.body.appendChild(printContainer);
      }
      
      document.body.classList.add("printing-resume-active");

      setTimeout(() => {
        window.print();
        
        // Clean up
        const pc = document.getElementById("resume-print-container");
        if (pc) pc.remove();
        document.body.classList.remove("printing-resume-active");
      }, 50);
    } catch (err) {
      console.error("Print failed:", err);
      window.print();
    }
  };

  // في الـ useEffect عند load الصفحة
  useEffect(() => {
    localStorage.removeItem('cv-locked');
    localStorage.removeItem('cv-is-locked');
    useResumeStore.getState().unlockResume();

    const handleBeforePrint = () => {
      if (!document.getElementById("resume-print-container")) {
        const resumeElement = document.getElementById("resume-capture-area");
        if (resumeElement) {
          const printContainer = document.createElement("div");
          printContainer.id = "resume-print-container";
          const clone = resumeElement.cloneNode(true) as HTMLElement;
          clone.id = "resume-print-capture-area";
          printContainer.appendChild(clone);
          document.body.appendChild(printContainer);
          document.body.classList.add("printing-resume-active");
        }
      }
    };

    const handleAfterPrint = () => {
      const printContainer = document.getElementById("resume-print-container");
      if (printContainer) {
        printContainer.remove();
      }
      document.body.classList.remove("printing-resume-active");
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  const handleExportClick = () => {
    setShowResumeChecker(true);
  };

  const handleProceedToExport = async (
    formatInput: "pdf" | "docx" | "txt" | any = "pdf",
    forceAllow = false,
  ) => {
    const format: "pdf" | "docx" | "txt" = (typeof formatInput === "string" && ["pdf", "docx", "txt"].includes(formatInput))
      ? formatInput
      : "pdf";

    setShowResumeChecker(false);

    const canDownloadState = checkCanDownload();
    const isFreeDownload = canDownloadState === "free";

    const allowed = forceAllow || isPremium || isFreeDownload;

    if (!allowed) {
      setShowPaymentModal(true);
      return;
    }

    setExportStatus({ show: true, step: 0, format });
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    if (format === "pdf") {
      try {
        setExportStatus({ show: true, step: 1, format }); 
        await sleep(1000);
        setExportStatus({ show: true, step: 2, format }); 
        await sleep(1000);
        setExportStatus({ show: true, step: 3, format }); 
        
        setExportStatus(null);
        await handlePrint();
        
        setHasExported(true);
        onSuccessfulDownload();
        
        setTimeout(() => setShowPostDownloadModal(true), 300);
      } catch (err: any) {
        console.error("Export failed:", err);
        alert(language === "ar" ? "حدث خطأ أثناء التصدير. يرجى المحاولة مرة أخرى." : "Export failed. Please try again.");
        setExportStatus(null);
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

        onSuccessfulDownload();
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
          .map((exp) => `${exp.role} at ${exp.company}\n${exp.description}`)
          .join("\n\n")}`;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${data.personalInfo.fullName || "resume"}.txt`;
        link.click();
        onSuccessfulDownload();
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
    projects: data.projects && data.projects.length > 0 ? 100 : 0,
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
      {!isStarted ? (
        <div className="h-[60vh] flex items-center justify-center">
            <EmptyState 
                title={language === 'ar' ? 'ابدأ سيرتك الذاتية' : 'Start your Resume'}
                description={language === 'ar' ? 'ابدأ ببناء سيرتك الذاتية بإدخال بياناتك' : 'Begin building your resume by entering your data'}
                buttonText={language === 'ar' ? 'ابدأ الآن' : 'Start Now'}
                onAdd={() => setIsStarted(true)}
            />
        </div>
      ) : (
        <>
      {isLocked && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-amber-500/30 bg-amber-50 shadow-xs">
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  {language === 'ar' ? '🔒 السيرة محمية بعد التحميل' : '🔒 Resume Locked After Download'}
                </h3>
                <p className="text-xs text-amber-700 mt-1">
                  {language === 'ar' 
                    ? 'لا يمكن تعديل السيرة الذاتية مرة أخرى بعد تحميلها.' 
                    : 'The resume cannot be edited again after downloading.'}
                </p>
                <p className="text-[11px] text-amber-600/80 mt-0.5 font-medium">
                  {language === 'ar' 
                    ? 'إذا أردت تعديل بسيط، أرسل لنا رسالة عبر واتساب.' 
                    : 'If you want a minor edit, send us a WhatsApp message.'}
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/201101007965?text=${encodeURIComponent(language === 'ar' ? 'أهلاً، أحتاج إلى إجراء تعديل بسيط على سيرتي الذاتية التي قمت بتحميلها من Hash Resume.' : 'Hello, I need to make a minor edit to my resume downloaded from Hash Resume.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-2 shadow-sm shadow-[#25D366]/20"
            >
              <span>💬</span>
              {language === 'ar' ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
            </a>
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

            {/* Intelligent AI Connection/Fallback Notification Banner */}
            {aiNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 rounded-2xl bg-orange-50 border border-orange-200/70 flex items-start gap-3 shadow-xs text-start"
              >
                <div className="p-2 bg-orange-100 rounded-xl text-[#FF4D2D] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-[#FF4D2D] uppercase tracking-wider">
                    {language === "ar" ? "تنبيه مساعد الذكاء الاصطناعي" : "AI Assistant Update"}
                  </h4>
                  <p className="text-[11px] text-slate-700 font-semibold leading-relaxed mt-0.5">
                    {aiNotice.message}
                  </p>
                </div>
                <button
                  onClick={() => setAiNotice(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
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

                  <div className={cn(data.isLocked && "pointer-events-none opacity-50 select-none")}>
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
                            <motion.button
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.985 }}
                              onClick={() => setActiveTab("finish")}
                              className="group flex items-center gap-3 bg-[#FF4D2D] hover:bg-[#E03C1E] text-white px-8 py-4 rounded-2xl font-bold border border-transparent shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition-all cursor-pointer"
                            >
                              {language === "ar"
                                ? "الذهاب للمراجعة والتحميل"
                                : "Go to Review & Download"}
                              <ArrowRight
                                size={20}
                                className="group-hover:translate-x-1 transition-transform rtl:rotate-180 group-hover:rtl:-translate-x-1"
                              />
                            </motion.button>
                          </div>
                        </section>
                      )}
                      {activeTab === "finish" && (
                        <FinishStep
                          onPrint={() => handleProceedToExport("pdf")}
                          onExportWord={() => handleProceedToExport("docx")}
                          onJumpToStep={(step) => setActiveTab(step as Tab)}
                        />
                      )}
                      </Suspense>
                    </div>
        </>
      )}
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
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onReset={async () => {
            if (confirm(language === "ar" ? "هل أنت متأكد من مسح جميع البيانات؟" : "Are you sure you want to start over? All data will be deleted.")) {
                await useResumeStore.getState().resetData();
                useResumeStore.getState().unlockResume();
                window.location.reload();
            }
          }}
        >
          <main ref={formRef} onScroll={handleFormScroll} className="w-full h-full overflow-y-auto pb-6 relative scrollbar-none editor-form-scrollable">
            {data.isLocked && <LockedOverlay lang={language} />}
            <div className="min-h-full flex flex-col">
              <div className="flex-1 px-1">
                {/* Banner removed */}
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
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      const allTabs = Object.keys(sidebarCompletionMap);
                      const currentIndex = allTabs.indexOf(activeTab as any);
                      setActiveTab(allTabs[currentIndex - 1] as any);
                    }}
                    className="flex-1 py-3.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white font-bold text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <ArrowRight size={16} className="rtl:-scale-x-100 ltr:rotate-180" />
                    {language === "ar" ? "السابق" : language === "fr" ? "Précédent" : "Previous"}
                  </motion.button>
                ) : (
                  <div className="flex-1" />
                )}
                {Object.keys(sidebarCompletionMap).indexOf(activeTab as any) < Object.keys(sidebarCompletionMap).length - 1 ? (
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      const allTabs = Object.keys(sidebarCompletionMap);
                      const currentIndex = allTabs.indexOf(activeTab as any);
                      setActiveTab(allTabs[currentIndex + 1] as any);
                    }}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-slate-900/10 cursor-pointer"
                  >
                    {language === "ar" ? "التالي" : language === "fr" ? "Suivant" : "Next"}
                    <ArrowRight size={16} className="rtl:-scale-x-100" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleProceedToExport("pdf")}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-orange-600 border border-orange-500 text-white font-bold text-sm hover:bg-orange-700 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {language === "ar" ? "تصدير" : language === "fr" ? "Exporter" : "Export"}
                    <ArrowRight size={16} className="rtl:-scale-x-100" />
                  </motion.button>
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
        saveStatus={saveStatus}
        onUndo={handleUndo}
        onExportPDF={handleExportClick}
        onExportWord={() => handleProceedToExport("docx")}
        onShareLink={handleShareLink}
        onTogglePreview={() => setShowFullPreview(!showFullPreview)}
        previewOpen={showFullPreview}
        isLocked={data.isLocked}
        onBackToHome={() => { window.location.href = "/"; }}
        onReset={async () => {
            if (confirm(language === "ar" ? "هل أنت متأكد من مسح جميع البيانات والبدء من جديد؟" : "Are you sure you want to start over? All data will be deleted.")) {
                await useResumeStore.getState().resetData();
                useResumeStore.getState().unlockResume();
                window.location.reload();
            }
        }}
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
        {!previewFocusMode && (
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
              <AnimatePresence>
                {isIframe && showIframeBanner && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 bg-indigo-50/95 backdrop-blur-md border border-indigo-200/80 text-indigo-950 rounded-2xl p-4.5 shadow-[0_4px_20px_rgba(99,102,241,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 shrink-0">
                        <Info className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black tracking-tight">
                          {language === "ar"
                            ? "💡 الحل الموصى به لتصدير بأعلى جودة"
                            : "💡 Recommended for Best PDF Quality"}
                        </h4>
                        <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                          {language === "ar"
                            ? "لتجنب أي قيود برمجية للمتصفح عند توليد ملف الـ PDF بأعلى جودة واحترافية، يُفضل دائماً فتح المحرر في نافذة مستقلة جديدة (عبر زر 'فتح في نافذة مستقلة' المتوفر في المتصفح). سيقوم نظام المزامنة التلقائية بعرض كافة بياناتك فوراً ويتيح لك تحميل السيرة بنقرة واحدة وبدون أي قيود طباعية."
                            : "To avoid browser restrictions and ensure the absolute highest print quality, we highly recommend opening this editor in an independent window. Your work will auto-sync instantly, and you can download your PDF with a single click."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          window.open(window.location.href, '_blank');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
                      >
                        <span>{language === "ar" ? "فتح في نافذة جديدة" : "Open in New Window"}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setShowIframeBanner(false)}
                        className="p-2 hover:bg-indigo-100 rounded-xl text-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
        )}

        {!isMobile && !focusMode && !previewFocusMode && (
          <>
            <PanelResizeHandle className="w-1.5 focus:outline-none bg-neutral-200 hover:bg-brand-500 active:bg-brand-600 transition-colors group z-50">
              <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-12 w-1 bg-white rounded-full" />
              </div>
            </PanelResizeHandle>
          </>
        )}

        {!isMobile && !focusMode && (
          <Panel
            defaultSize={previewFocusMode ? 100 : 35}
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
            <div className="h-14 bg-white/95 backdrop-blur-sm border-b border-neutral-200/80 flex items-center justify-between px-4 sm:px-6 shrink-0 absolute top-0 start-0 end-0 z-10 transition-colors duration-200 transform-gpu shadow-xs">
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                <button
                  onClick={() => setRightPanelMode("preview")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer",
                    rightPanelMode === "preview"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <LayoutTemplate size={13} className={rightPanelMode === "preview" ? "text-brand-500" : ""} />
                  <span>{language === "ar" ? "المعاينة التفاعلية" : "Live Preview"}</span>
                </button>
                <button
                  onClick={() => setRightPanelMode("ats")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer relative",
                    rightPanelMode === "ats"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <Sparkles size={13} className={cn(rightPanelMode === "ats" ? "text-[#FF4D2D]" : "text-slate-400")} />
                  <span>{language === "ar" ? "فاحص الوصف الوظيفي (ATS)" : "Job Match (ATS)"}</span>
                  {data.jobDescription && (
                    <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                    </span>
                  )}
                </button>

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
                  onClick={() => setPreviewFocusMode(!previewFocusMode)}
                  className={cn(
                    "flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 hover:text-slate-900 border transition-all rounded-xl shadow-sm",
                    previewFocusMode 
                      ? "bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100 shadow-brand-100/50" 
                      : "bg-white text-slate-500 hover:bg-slate-50 border-slate-200"
                  )}
                  title={String(t.fullPreview || "")}
                >
                  <Maximize2 size={14} className={previewFocusMode ? "text-brand-500" : ""} />
                  <span className="hidden sm:inline text-xs font-bold">{previewFocusMode ? (language === "ar" ? "تصغير" : "Shrink") : (language === "ar" ? "تكبير" : "Expand")}</span>
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

            <div className="flex-1 overflow-x-hidden overflow-y-auto pt-14 flex flex-col bg-slate-50/60 backdrop-blur-xs relative border-l border-slate-200/40 h-full">
              {rightPanelMode === "preview" ? (
                <div className="flex-1 p-4 md:p-12 flex flex-col items-center justify-start h-full">
                  <div
                    className="origin-top transition-all duration-500 flex justify-center scale-[0.4] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.8] xl:scale-[0.9] h-[calc(297mm*0.4)] sm:h-[calc(297mm*0.6)] md:h-[calc(297mm*0.75)] lg:h-[calc(297mm*0.8)] xl:h-[calc(297mm*0.9)]"
                  >
                    <div
                      className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 rounded-md overflow-hidden w-[210mm] min-h-[297mm] shrink-0"
                    >
                      <Suspense fallback={<FormLoader />}>
                        <ResumePreview ref={componentRef} />
                      </Suspense>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-white h-full overflow-y-auto">
                  <JobMatchAdvisor language={language} />
                </div>
              )}
            </div>
          </div>
        </Panel>
        )}
      </PanelGroup>
      </>
      )}

      {/* Mobile Live Preview Overlay */}
      <AnimatePresence>
        {showMobilePreview && (
          <div key="mobile-preview-container" className="md:hidden fixed inset-0 z-[100] flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobilePreview(false)}
              className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0.1, bottom: 0.8 }}
              onDragEnd={(event, info) => {
                if (info.offset.y > 150 || info.velocity.y > 600) {
                  setShowMobilePreview(false);
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="fixed inset-x-0 bottom-0 h-[88dvh] bg-white rounded-t-[2rem] shadow-[0_-12px_40px_rgba(0,0,0,0.18)] z-[110] flex flex-col overflow-hidden"
            >
              {/* iOS Drag Handle */}
              <div className="w-14 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-2 shrink-0 cursor-grab active:cursor-grabbing" />
              
              <div
                className="flex items-center justify-between px-5 pb-3 pt-1 shrink-0 border-b border-slate-100"
              >
                <div className="flex items-center gap-2">
                  <LayoutTemplate size={18} className="text-[#FF4D2D]" />
                  <span className="text-sm font-black text-slate-900">
                    {language === "ar" ? "درج المعاينة التفاعلي" : "Interactive Resume Preview"}
                  </span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-semibold">
                    {language === "ar" ? "اسحب لأسفل للإغلاق" : "Swipe down to close"}
                  </span>
                </div>
              
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-colors active:scale-95 bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Dynamic Quick Template & Theme Switcher on Mobile Preview */}
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5 shrink-0 flex flex-col gap-2 select-none">
                {/* Horizontal scroll for templates */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    {language === "ar" ? "القالب:" : "Template:"}
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {[
                      { id: "classic", name: language === "ar" ? "🏛️ كلاسيكي" : "🏛️ Classic" },
                      { id: "modern", name: language === "ar" ? "💼 حديث" : "💼 Modern" },
                      { id: "executive", name: language === "ar" ? "👑 تنفيذي" : "👑 Executive" },
                      { id: "minimal", name: language === "ar" ? "✨ بسيط" : "✨ Minimal" },
                      { id: "timeline", name: language === "ar" ? "⏱️ زمني" : "⏱️ Timeline" },
                      { id: "two-column", name: language === "ar" ? "📑 عمودين" : "📑 Two-Col" },
                    ].map((temp) => {
                      const isSelected = settings.template === temp.id;
                      return (
                        <button
                          key={temp.id}
                          onClick={() => updateSettings({ template: temp.id as any })}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer",
                            isSelected
                              ? "bg-slate-900 border-slate-900 text-white shadow-xs font-black"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {temp.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Horizontal row for Theme Colors */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    {language === "ar" ? "اللون المهني:" : "Color Theme:"}
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {[
                      { hex: "#475569", name: language === "ar" ? "رمادي" : "Slate" },
                      { hex: "#2563EB", name: language === "ar" ? "أزرق" : "Blue" },
                      { hex: "#10B981", name: language === "ar" ? "أخضر" : "Emerald" },
                      { hex: "#EF4444", name: language === "ar" ? "أحمر" : "Coral" },
                      { hex: "#8B5CF6", name: language === "ar" ? "بنفسجي" : "Purple" },
                      { hex: "#F97316", name: language === "ar" ? "برتقالي" : "Orange" },
                      { hex: "#1E293B", name: language === "ar" ? "فحمي" : "Charcoal" },
                    ].map((col) => {
                      const isSelected = settings.themeColor === col.hex;
                      return (
                        <button
                          key={col.hex}
                          onClick={() => updateSettings({ themeColor: col.hex })}
                          className={cn(
                            "w-5.5 h-5.5 rounded-full border flex items-center justify-center transition-all relative cursor-pointer",
                            isSelected
                              ? "scale-110 border-slate-400 ring-2 ring-offset-1 ring-[#FF4D2D]"
                              : "border-slate-200 hover:scale-105"
                          )}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        >
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Elegant Zoom Toolbar */}
              <div className="bg-slate-100/60 border-b border-slate-200/50 px-4 py-2 flex items-center justify-between shrink-0 select-none">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  🔍 {language === "ar" ? "حجم المعاينة والتكبير:" : "PREVIEW ZOOM & SCALE:"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMobileZoom(prev => Math.max(0.3, prev - 0.05))}
                    disabled={mobileZoom <= 0.3}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-40 cursor-pointer font-black text-sm"
                  >
                    -
                  </button>
                  <span className="text-xs font-black text-slate-800 min-w-[36px] text-center font-mono">
                    {Math.round(mobileZoom * 200)}%
                  </span>
                  <button
                    onClick={() => setMobileZoom(prev => Math.min(0.9, prev + 0.05))}
                    disabled={mobileZoom >= 0.9}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-40 cursor-pointer font-black text-sm"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setMobileZoom(0.45)}
                    className="text-[9px] font-black uppercase text-[#FF4D2D] bg-orange-50 border border-orange-200/45 px-2 py-1 rounded-md active:scale-95 cursor-pointer ml-1"
                  >
                    {language === "ar" ? "إعادة تعيين" : "Reset"}
                  </button>
                </div>
              </div>
 
              <div className="flex-1 overflow-x-hidden overflow-y-auto w-full p-2 sm:p-4 flex flex-col items-center bg-slate-50/60 scrollbar-none pb-12">
                <div
                  className="origin-top transition-all flex justify-center opacity-100"
                  style={{ 
                    width: "210mm",
                    height: "297mm",
                    transform: `scale(${mobileZoom})`,
                    marginBottom: `-${297 * (1 - mobileZoom)}mm`
                  }}
                >
                  <div
                    className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 rounded-sm overflow-hidden shrink-0 w-[210mm] min-h-[297mm]"
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
              className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0.1, bottom: 0.8 }}
              onDragEnd={(event, info) => {
                if (info.offset.y > 150 || info.velocity.y > 600) {
                  setShowMobileAtsPanel(false);
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="bg-white rounded-t-[2rem] shadow-[0_-12px_40px_rgba(0,0,0,0.18)] z-[110] flex flex-col overflow-hidden max-h-[85vh] relative"
            >
              <div className="w-14 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0 cursor-grab active:cursor-grabbing" />
              <div
                className="flex items-center justify-between px-5 py-3 shrink-0 border-b border-slate-100"
              >
                <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200/55">
                  <button
                    onClick={() => setMobileAtsTab("audit")}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-black transition-all",
                      mobileAtsTab === "audit"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {language === "ar" ? "تحليل ATS" : "ATS Audit"}
                  </button>
                  <button
                    onClick={() => setMobileAtsTab("match")}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-black transition-all",
                      mobileAtsTab === "match"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {language === "ar" ? "الوصف الوظيفي" : "Job Match"}
                  </button>
                </div>
                <button
                  onClick={() => setShowMobileAtsPanel(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-colors active:scale-95 bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-x-hidden overflow-y-auto w-full p-4 sm:p-6 text-slate-800">
                {mobileAtsTab === "audit" ? (
                  <>
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
                  </>
                ) : (
                  <div className="bg-white">
                    <JobMatchAdvisor language={language} />
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
        <Suspense fallback={null}>
          <LinkedInImportModal
            isOpen={isLinkedInModalOpen}
            onClose={() => setIsLinkedInModalOpen(false)}
          />
          <OneClickMagicModal
            isOpen={isMagicModalOpen}
            onClose={() => setIsMagicModalOpen(false)}
          />
        </Suspense>
        <LiveAtsScoreWidget />



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

        <Suspense fallback={null}>
          <ResumeCheckerModal
            isOpen={showResumeChecker}
            onClose={() => setShowResumeChecker(false)}
            onProceed={handleProceedToExport}
          />

          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={(codes) => {
              if (codes && codes.length > 0) {
                setCurrentPurchasedCodes(codes);
              } else {
                setCurrentPurchasedCodes([]);
              }
              trackEvent(FUNNEL_EVENTS.PAID_DOWNLOAD, { language });
              setShowPaymentModal(false);
              handleProceedToExport("pdf", true);
            }}
          />
          <PostDownloadModal
            isOpen={showPostDownloadModal}
            onClose={() => {
              setShowPostDownloadModal(false);
              setCurrentPurchasedCodes([]);
            }}
            purchasedCodes={currentPurchasedCodes}
          />
          <FeedbackModal
            isOpen={showFeedbackModal}
            onClose={() => setShowFeedbackModal(false)}
          />
        </Suspense>

        {/* Hidden resume container to guarantee DOM availability of #resume-capture-area for PDF/DOCX export and Printing fallback on all viewports */}
        <div className="absolute pointer-events-none opacity-0 select-none overflow-hidden h-0 w-0 -top-[9999px] -left-[9999px] invisible" aria-hidden="true">
          <ResumePreview />
        </div>

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
        <div className="text-center text-xs text-slate-400 pb-4">version 2.0.8</div>
    </div>
  );
}
