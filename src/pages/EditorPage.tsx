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
  
  ExternalLink,
  Info, ZoomIn, Globe,
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
import EditorSidebar from "../components/editor/EditorSidebar";

import ResumePreview from "../components/preview/ResumePreview";
import { JobMatchAdvisor } from "../components/editor/JobMatchAdvisor";
import { FrictionlessConfetti } from "../components/FrictionlessConfetti";
import { useResumeExport } from "../hooks/useResumeExport";

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

import { Tab } from "../types/editor.types";
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
            className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl font-bold text-[11px] text-white transition-all active:scale-[0.98] shadow-xs cursor-pointer bg-[#128C7E] hover:bg-[#0a5249] shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span>{isAr ? "طلب تعديل عبر واتساب" : "Request Edit via WhatsApp"}</span>
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

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4000);
  };

  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [showAutofill, setShowAutofill] = useState(false);
  const [showAIBanner, setShowAIBanner] = useState(true);
  const [showMicroSpacingPanel, setShowMicroSpacingPanel] = useState(false);
  const [aiNotice, setAiNotice] = useState<{ code: string; message: string } | null>(null);

  useEffect(() => {
    let aiTimeout: any;
    const handleAIErrorEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ code: string; message: string }>;
      if (customEvent && customEvent.detail) {
        setAiNotice({
          code: customEvent.detail.code,
          message: customEvent.detail.message,
        });
        
        // Auto-dismiss after 8 seconds
        if (aiTimeout) clearTimeout(aiTimeout);
        aiTimeout = setTimeout(() => {
          setAiNotice(prev => prev?.code === customEvent.detail.code ? null : prev);
        }, 8000);
      }
    };
    
    window.addEventListener("ai:error", handleAIErrorEvent);
    return () => {
      window.removeEventListener("ai:error", handleAIErrorEvent);
      if (aiTimeout) clearTimeout(aiTimeout);
    };
  }, []);

  const { focusMode, setFocusMode } = useFocusMode();

  const { isMobile, isDesktop } = useDeviceState();



  // Keyboard-Aware dynamic focus auto-scrolling for mobile devices
  useEffect(() => {
    let focusTimeout: any;
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        if (focusTimeout) clearTimeout(focusTimeout);
        focusTimeout = setTimeout(() => {
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
      if (focusTimeout) clearTimeout(focusTimeout);
    };
  }, []);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: "instant" as any });
    }
  }, [activeTab, formRef]);
  
  useEffect(() => {
    let clickTimeout: any;
    let ringTimeout: any;
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
        if (clickTimeout) clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
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
            element.classList.add("ring-2", "ring-brand-600", "ring-offset-4");
            if (ringTimeout) clearTimeout(ringTimeout);
            ringTimeout = setTimeout(() => {
              element?.classList.remove("ring-2", "ring-brand-600", "ring-offset-4");
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
      if (clickTimeout) clearTimeout(clickTimeout);
      if (ringTimeout) clearTimeout(ringTimeout);
    };
  }, [setActiveTab]);
  


  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [mobileZoom, setMobileZoom] = useState(0.45);

  useEffect(() => {
    if (showMobilePreview) {
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 375;
      const fitZoom = Math.min(Math.max((screenWidth - 32) / 794, 0.3), 1.0);
      setMobileZoom(fitZoom);
    }
  }, [showMobilePreview]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleFormScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 300);
  };
  const [showExitModal, setShowExitModal] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [currentPurchasedCodes, setCurrentPurchasedCodes] = useState<string[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [previewFocusMode, setPreviewFocusMode] = useState(false);
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

  const data = useResumeStore((state) => state.data);
  const isStarted = useResumeStore((state) => state.isStarted);
  const setIsStarted = useResumeStore((state) => state.setIsStarted);
  
  const { isPremium, isEmpty, atsScore, breakdown } = useResumeValidation(data);
  const { saveStatus } = useAutoSave(data);

  const {
    exportStatus,
    hasExported,
    showPostDownloadModal,
    setShowPostDownloadModal,
    showPaymentModal,
    setShowPaymentModal,
    showResumeChecker,
    setShowResumeChecker,
    handleExportClick,
    handleProceedToExport
  } = useResumeExport({
    language,
    data,
    isPremium,
    showToast
  });

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

  // Auto-download resume when redirected from payment success page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("download") === "pdf") {
      // Set tab to finish so the preview and finish UI is loaded
      setActiveTab("finish");
      
      // Delay slightly to allow the DOM/component to prepare
      const timeout = setTimeout(() => {
        handleProceedToExport("pdf", true); // forceAllow = true to bypass standard check if we just paid!
        
        // Clean up URL parameter
        params.delete("download");
        const newRelativePathQuery = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState(null, "", newRelativePathQuery);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [setActiveTab]);

  const sidebarCompletionMap: Record<string, number> = {
    basics: data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.jobTitle ? 100 : (data.personalInfo.fullName || data.personalInfo.email ? 50 : 0),
    experience: (data.experience && data.experience.length > 0) || (data.education && data.education.length > 0) ? 100 : 0,
    skills: (data.skills && data.skills.length > 0) || (data.projects && data.projects.length > 0) || (data.certifications && data.certifications.length > 0) ? 100 : 0,
    finish: atsScore,
  };

  const progressPercent = Math.round((sidebarCompletionMap.basics + sidebarCompletionMap.experience + sidebarCompletionMap.skills) / 3);

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
              className="bg-[#128C7E] hover:bg-[#0a5249] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-sm shadow-[#128C7E]/10"
            >
              <span>💬</span>
              <span>{language === 'ar' ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}</span>
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
                <div className="p-2 bg-orange-100 rounded-xl text-brand-600 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-brand-600 uppercase tracking-wider">
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
                  <div className="p-2 bg-brand-600/10 rounded-xl text-brand-600 shrink-0 mt-0.5">
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
                    className="flex-1 sm:flex-none text-center text-[10px] font-black bg-brand-600 hover:bg-[#E64528] text-white py-2.5 px-3.5 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
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
              <h1 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                {language === "ar" ? "منشئ السيرة الذاتية (Editor)" : "Resume Builder Editor"}
              </h1>
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

                            {/* Premium Quick Auto-Fill Roles / Smart Templates */}
                            <div className="mb-6 bg-white border border-slate-200/95 rounded-2xl overflow-hidden shadow-3xs transition-all duration-300">
                              <button
                                type="button"
                                onClick={() => setShowAutofill(!showAutofill)}
                                className="w-full px-5 py-4 flex items-center justify-between text-start cursor-pointer hover:bg-slate-50/50 transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg">
                                    <Sparkles size={14} className="animate-pulse" />
                                  </div>
                                  <div>
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                                      {language === "ar" ? "قوالب وتعبئة تلقائية ذكية" : "AI Role Templates & Smart Auto-Fill"}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                      {language === "ar" ? "ابدأ بسرعة باستخدام عينة منسقة لمهنتك بنقرة واحدة" : "Instantly populate sample HR-vetted data for your profession"}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-black transition-colors">
                                  {showAutofill ? (language === "ar" ? "إغلاق" : "Collapse") : (language === "ar" ? "عرض الخيارات" : "Expand")}
                                </span>
                              </button>

                              {showAutofill && (
                                <div className="px-5 pb-5 border-t border-slate-100 pt-4 bg-slate-50/30">
                                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3.5">
                                    {language === "ar"
                                      ? "اختر مهنتك ليتم تعبئة السيرة الذاتية كاملة ببيانات نموذجية صاغها خبراء الموارد البشرية لتجتاز فحص الـ ATS وتفهم كيفية التعبير عن خبراتك:"
                                      : "Select a professional template crafted by recruiting experts to instantly pass ATS scans and learn optimal experience phrasing:"}
                                  </p>
                                  <div className="grid grid-cols-3 gap-2.5">
                                    {[
                                      { id: "developer", label: language === "ar" ? "💻 مبرمج" : "💻 Developer" },
                                      { id: "accountant", label: language === "ar" ? "📊 محاسب" : "📊 Accountant" },
                                      { id: "designer", label: language === "ar" ? "🎨 مصمم" : "🎨 Designer" }
                                    ].map((role) => (
                                      <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => {
                                          const confirmMsg = language === "ar"
                                            ? "تنبيه: هذا الإجراء سيقوم باستبدال جميع البيانات الحالية ببيانات هذا النموذج النموذجي بالكامل. هل تريد الاستمرار؟"
                                            : "Warning: This action will replace all your current resume entries with this template's data. Do you want to proceed?";
                                          if (window.confirm(confirmMsg)) {
                                            const loadRoleTemplate = useResumeStore.getState().loadRoleTemplate;
                                            loadRoleTemplate(role.id as any, language === "ar" ? "ar" : "en");
                                            setShowAutofill(false);
                                          }
                                        }}
                                        className="py-2.5 px-2 text-center rounded-xl bg-white hover:bg-slate-900 border border-slate-200/90 text-slate-700 hover:text-white font-black text-[11px] transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
                                      >
                                        {role.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <PersonalInfoForm />


                          </section>
                        </div>
                      )}
                      {activeTab === "experience" && (
                        <div className="space-y-16">
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
                          
                          <div className="space-y-12 pt-8 border-t border-slate-200/50" data-form-section="education">
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
                        </div>
                      )}
                      {activeTab === "skills" && (
                        <div className="space-y-16">
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
                          
                          <section data-form-section="projects" className="pt-8 border-t border-slate-200/50">
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

                          <section data-form-section="certifications" className="pt-8 border-t border-slate-200/50">
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
                                onClick={() => setActiveTab("experience")}
                                className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                              >
                                {language === "ar" ? "السابق" : "Previous"}
                              </button>
                              <motion.button
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.985 }}
                                onClick={() => {
                                  scrollToFormTop();
                                  setActiveTab("finish");
                                }}
                                className="group flex items-center gap-3 bg-brand-600 hover:bg-[#E03C1E] text-white px-8 py-4 rounded-2xl font-bold border border-transparent shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition-all cursor-pointer"
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
                        </div>
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
    showToast(language === 'ar' ? 'تم نسخ الرابط! (يجب ترقية الحساب للتفعيل)' : 'Link copied to clipboard! (Premium feature)', "success");
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
              <div className="mt-8 px-4 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                {Object.keys(sidebarCompletionMap).indexOf(activeTab as any) === Object.keys(sidebarCompletionMap).length - 1 && (
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      scrollToFormTop();
                      handleProceedToExport("pdf");
                    }}
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

      <div className="flex-1 w-full h-full flex overflow-hidden relative bg-[#F9FAFB]">
        {!isMobile && !focusMode && (
           <EditorSidebar 
             activeTab={activeTab} 
             onTabChange={(id) => setActiveTab(id as any)} 
             completionMap={sidebarCompletionMap} 
           />
        )}

        <PanelGroup
          orientation={isMobile ? "vertical" : "horizontal"}
          className="flex-1 h-full overflow-hidden relative editor-form"
          dir="ltr"
        >
          {/* Editor Area */}
          {!previewFocusMode && (
          <Panel defaultSize={68} minSize={30} className="block">
          <div className={cn("flex flex-col h-full overflow-hidden relative transition-all duration-300", focusMode ? "bg-white" : "bg-[#F9FAFB]")} dir={dir}>
            
            {/* Real-time Progress Bar */}
            <div className="bg-white border-b border-slate-200/85 px-6 py-3 flex items-center justify-between gap-4 select-none shrink-0" style={{ direction: dir }}>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-xs font-black text-slate-700">
                  {language === "ar" ? "نسبة اكتمال السيرة الذاتية:" : "Resume Completion Progress:"}
                </span>
                <span className="text-xs font-black text-brand-600 bg-brand-600/5 px-2 py-0.5 rounded-lg font-mono">
                  {progressPercent}%
                </span>
              </div>
              <div className="flex-1 max-w-md h-2 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/20">
                <motion.div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-brand-500 to-amber-500 rounded-full"
                  style={{ left: dir === "rtl" ? "auto" : 0, right: dir === "rtl" ? 0 : "auto" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <div className="hidden md:block text-[11px] text-slate-400 font-bold shrink-0">
                {progressPercent === 100 
                  ? (language === "ar" ? "أداء ممتاز! جاهز للتحميل 🏆" : "Excellent performance! Ready to download 🏆")
                  : (language === "ar" ? "أكمل بياناتك للحصول على سيرة قوية" : "Complete your details for a powerful resume")}
              </div>
            </div>

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
                    className="mb-6 bg-brand-50/95 backdrop-blur-md border border-brand-200/80 text-brand-950 rounded-2xl p-4.5 shadow-[0_4px_20px_rgba(99,102,241,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-brand-100 p-2 rounded-xl text-brand-600 shrink-0">
                        <Info className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black tracking-tight">
                          {language === "ar"
                            ? "💡 الحل الموصى به لتصدير بأعلى جودة"
                            : "💡 Recommended for Best PDF Quality"}
                        </h4>
                        <p className="text-xs text-brand-800 leading-relaxed font-medium">
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
                        className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
                      >
                        <span>{language === "ar" ? "فتح في نافذة جديدة" : "Open in New Window"}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setShowIframeBanner(false)}
                        className="p-2 hover:bg-brand-100 rounded-xl text-brand-400 hover:text-brand-600 transition-colors cursor-pointer"
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
{/* Mobile Scroll to Top */}
                <AnimatePresence>
                  {showScrollTop && (
                    <motion.button
                      onClick={scrollToFormTop}
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 20 }}
                      className="md:hidden fixed bottom-[90px] sm:bottom-28 end-6 w-12 h-12 bg-neutral-50 text-neutral-900 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-200 flex items-center justify-center z-40 active:scale-90 transition-transform"
                    >
                      <ArrowUp size={24} />
                    </motion.button>
                  )}
                </AnimatePresence>
            </main>
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
            defaultSize={previewFocusMode ? 100 : 32}
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
                    <SlidersHorizontal size={13} className="text-brand-600" />
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <LayoutTemplate size={14} />
                  <span>{language === "ar" ? "القالب" : "Template"}</span>
                </button>
                <button
                  onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Globe size={14} />
                  <span>{language === "ar" ? "EN" : "عربي"}</span>
                </button>
                <button
                  onClick={() => setMobileZoom(prev => Math.min(prev + 0.1, 1.5))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ZoomIn size={14} />
                  <span className="hidden sm:inline">Zoom</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRightPanelMode(rightPanelMode === "preview" ? "ats" : "preview")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer relative",
                    rightPanelMode === "ats"
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <Sparkles size={13} className={cn(rightPanelMode === "ats" ? "text-brand-600" : "text-slate-400")} />
                  <span>{language === "ar" ? "فاحص ATS" : "ATS Checker"}</span>
                </button>
                <button
                  onClick={handleExportClick}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Download size={14} />
                  <span>{language === "ar" ? "تصدير" : "Export"}</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-x-hidden overflow-y-auto pt-14 flex flex-col bg-[#f4f4f3] relative border-l border-slate-200/50 h-full">
              {rightPanelMode === "preview" ? (
                <div className="flex-1 p-4 md:p-10 flex flex-col items-center justify-start min-h-full">
                  <div
                    className="origin-top transition-all duration-500 flex justify-center scale-[0.4] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.8] xl:scale-[0.9] h-[calc(297mm*0.4)] sm:h-[calc(297mm*0.6)] md:h-[calc(297mm*0.75)] lg:h-[calc(297mm*0.8)] xl:h-[calc(297mm*0.9)]"
                  >
                    <div className="bg-white shadow-[0_24px_60px_rgba(0,0,0,0.12)] border border-stone-200/60 overflow-hidden shrink-0 w-[210mm] min-h-[297mm] rounded-xs">
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
      </div>

</>
      )}

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
                      <span className={`text-4xl font-black ${isEmpty ? "text-slate-400" : atsScore >= 80 ? "text-emerald-500" : atsScore >= 50 ? "text-amber-500" : "text-rose-500"}`}>{isEmpty ? "--%" : `${atsScore}%`}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isEmpty ? "bg-slate-300" : atsScore >= 80 ? "bg-emerald-500" : atsScore >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                        style={{ width: `${isEmpty ? 0 : atsScore}%` }}
                      />
                    </div>
                    
                    <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl">
                      {isEmpty
                        ? (language === "ar"
                          ? "ابدأ بإدخال بياناتك ومعلومات التواصل وخبراتك لتنشيط مؤشر الـ ATS ورؤية تقييم التوافق المباشر."
                          : "Start building your resume by entering contact info and experience to see your ATS score.")
                        : language === "ar"
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
                      <div className="bg-brand-600/5 border border-brand-600/20 rounded-2xl p-4 mb-4">
                        <span className="text-xs font-black block mb-2 text-brand-600 uppercase tracking-wide">💡 {language === "ar" ? "توصيات فورية" : "Recommendation"}</span>
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
                      <Download size={18} className="text-brand-600 stroke-[2.5]" />
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

        {/* Full Page Mobile Preview Sheet */}
        <AnimatePresence>
          {showMobilePreview && (
            <div className="fixed inset-0 z-[120] flex flex-col bg-[#FAF9F7]" style={{ direction: language === "ar" ? "rtl" : "ltr" }}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                    <FileText size={18} />
                  </div>
                  <div className="text-right ltr:text-left">
                    <h3 className="text-sm font-black text-slate-800 leading-tight">
                      {language === "ar" ? "معاينة السيرة الذاتية" : "Live Resume Preview"}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold leading-none mt-0.5">
                      {language === "ar" ? "اسحب للتصفح، أو استخدم شريط التكبير" : "Drag to view or use the zoom bar"}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Interactive Zoom Control Bar */}
              <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2 flex items-center justify-between gap-4 shrink-0 select-none">
                <span className="text-[11px] font-bold text-slate-500">
                  {language === "ar" ? "تكبير/تصغير:" : "Zoom Level:"} {Math.round(mobileZoom * 100)}%
                </span>
                <div className="flex-1 flex items-center gap-2 max-w-xs">
                  <button
                    onClick={() => setMobileZoom(prev => Math.max(prev - 0.05, 0.3))}
                    className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 active:scale-95 transition-all text-xs font-black"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="0.30"
                    max="1.20"
                    step="0.05"
                    value={mobileZoom}
                    onChange={(e) => setMobileZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-brand-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <button
                    onClick={() => setMobileZoom(prev => Math.min(prev + 0.05, 1.2))}
                    className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 active:scale-95 transition-all text-xs font-black"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-auto bg-[#F4F3EF] p-4 flex flex-col items-center justify-start min-h-0 relative scrollbar-none">
                <div
                  className="origin-top transition-all duration-150 shadow-2xl"
                  style={{
                    width: "210mm",
                    height: "297mm",
                    transform: `scale(${mobileZoom})`,
                    marginBottom: `-${297 * (1 - mobileZoom)}mm`,
                  }}
                >
                  <div className="bg-white border border-slate-300 rounded-sm overflow-hidden shrink-0 w-[210mm] min-h-[297mm]">
                    <Suspense fallback={<FormLoader />}>
                      <ResumePreview />
                    </Suspense>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action CTAs */}
              <div className="bg-white border-t border-slate-200 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] flex items-center gap-3 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] select-none">
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center flex items-center justify-center"
                >
                  {language === "ar" ? "الرجوع للتعديل" : "Back to Edit"}
                </button>
                
                <button
                  onClick={() => {
                    setShowMobilePreview(false);
                    handleExportClick();
                  }}
                  className="flex-[1.5] h-12 bg-brand-600 hover:bg-slate-900 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-premium cursor-pointer"
                >
                  <Download size={14} className="stroke-[2.5]" />
                  <span>{language === "ar" ? "تحميل السيرة الذاتية (PDF)" : "Download PDF"}</span>
                </button>
              </div>
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
                    className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent"
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
                    className="h-full bg-gradient-to-r from-brand-600 to-orange-500 rounded-full"
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

        <AnimatePresence>
          {toast && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] max-w-sm w-full px-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className={cn(
                  "p-4 rounded-2xl shadow-xl border flex items-center gap-3 pointer-events-auto",
                  toast.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-800" :
                  toast.type === "error" ? "bg-rose-50 border-rose-100 text-rose-800" :
                  "bg-slate-900 border-slate-800 text-white"
                )}
              >
                <span className="text-lg">
                  {toast.type === "success" ? "✅" : toast.type === "error" ? "⚠️" : "ℹ️"}
                </span>
                <p className="text-xs font-bold leading-normal">{toast.message}</p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {showConfetti && <FrictionlessConfetti />}
        <div className="text-center text-xs text-slate-400 pb-4">version 2.7.19</div>
    </div>
  );
}
