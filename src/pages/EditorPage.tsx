import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
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
  ChevronLeft,
  Eye,
  LayoutTemplate,
  Target,
  Undo2,
  Redo2,
  CheckCircle2,
  Maximize2,
  X,
  FileText,
  Sparkles,
  Loader2,
  ArrowUp,
  Settings,
  ArrowRight,
  Award,
  Plus as PlusIcon,
  HelpCircle,
  Keyboard,
} from "lucide-react";
import { useResumeStore, ResumeData } from "../store/useResumeStore";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";
import { Tooltip } from "../components/ui/Tooltip";
import LanguageSwitcher from "../components/LanguageSwitcher";
import SettingsModal from "../components/SettingsModal";
import ATSTipsModal from "../components/ATSTipsModal";
import KeyboardShortcutsModal from "../components/KeyboardShortcutsModal";
import { hapticFeedback } from "../utils";
import { cn } from "@/lib/utils";
import { calculateATSScore } from "../utils/ats";
import { generateWord } from "../utils/generateWord";

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
const CustomSectionsForm = lazy(
  () => import("../components/editor/CustomSectionsForm"),
);
const ATSAudit = lazy(() => import("../components/editor/ATSAudit"));
const CoverLetterForm = lazy(
  () => import("../components/editor/CoverLetterForm"),
);
const FinishStep = lazy(() => import("../components/editor/FinishStep"));
const ResumePreview = lazy(() => import("../components/preview/ResumePreview"));
const CoverLetterPreview = lazy(
  () => import("../components/preview/CoverLetterPreview"),
);
const PaymentModal = lazy(() => import("../components/payment/PaymentModal"));
const PostDownloadModal = lazy(
  () => import("../components/payment/PostDownloadModal"),
);
const FeedbackModal = lazy(() => import("../components/FeedbackModal"));
const OnboardingTour = lazy(() => import("../components/OnboardingTour"));
const WelcomeModal = lazy(() => import("../components/editor/WelcomeModal"));
const ResumeCheckerModal = lazy(
  () => import("../components/editor/ResumeCheckerModal"),
);

const FormLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
    <p className="text-neutral-500 font-medium">Loading section...</p>
  </div>
);

type Tab =
  | "basics"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "custom"
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

const AutoSaveIndicator = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const data = useResumeStore((state) => state.data);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>("");

  useEffect(() => {
    const startTimer = setTimeout(() => setIsSaving(true), 0);
    const endTimer = setTimeout(() => {
      setIsSaving(false);
      const now = new Date();
      setLastSavedTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    }, 800);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [data]);

  return (
    <div className="flex items-center px-2 min-w-[120px] justify-center">
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500"
          >
            <div className="w-4 h-4 border-2 border-neutral-300 border-t-brand-500 rounded-full animate-spin" />
            {String(t.saving || "")}
          </motion.div>
        ) : (
          <motion.div
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-neutral-500"
          >
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span className="hidden sm:inline">
              {String(t.savedLocally || "")} {lastSavedTime && `${String(t.at || "")} ${lastSavedTime}`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ATSScoreIndicator = ({
  setActiveTab,
}: {
  setActiveTab: (tab: Tab) => void;
}) => {
  const { language } = useLanguageStore();
  const data = useResumeStore((state) => state.data);
  const isEmpty = 
    !data.personalInfo?.fullName && 
    !data.personalInfo?.email &&
    !data.personalInfo?.phone &&
    !data.personalInfo?.professionalSummary &&
    (!data.experience || data.experience.length === 0) && 
    (!data.education || data.education.length === 0) && 
    (!data.skills || data.skills.length === 0);


  const { score: atsScore, tips } = React.useMemo(() => {
    if (isEmpty) return { score: 0, criticalFailures: [], tips: [] };
    try {
      return calculateATSScore(data);
    } catch (e) {
      console.error("ATS Audit failed", e);
      return { score: 0, criticalFailures: [], tips: [] };
    }
  }, [data, isEmpty]);
  const [showTips, setShowTips] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  if (isEmpty) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowKeyboardShortcuts(true)}
        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all border border-slate-200"
        title={language === "ar" ? "اختصارات الكيبورد" : "Keyboard shortcuts"}
      >
        <Keyboard size={14} />
      </button>

      <button
        onClick={() => setActiveTab("finish")}
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-white/90 hover:bg-neutral-100 transition-all border border-neutral-200 group shrink-0"
      >
        <div className="flex flex-col items-start">
          <span className="text-[7px] sm:text-[9px] font-bold text-neutral-500 uppercase tracking-tighter sm:tracking-widest leading-none mb-0.5">
            {language === "ar" ? "النتيجة" : "Score"}
          </span>
          <span
            className={cn(
              "text-[10px] sm:text-sm font-black leading-none",
              isEmpty ? "text-neutral-400" :
              atsScore >= 80
                ? "text-emerald-600"
                : atsScore >= 50
                  ? "text-amber-500"
                  : "text-rose-500",
            )}
          >
            {isEmpty ? "—" : `${atsScore}%`}
          </span>
        </div>
        <div className="hidden sm:block w-12 h-2 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isEmpty ? '0%' : `${atsScore}%` }}
            className="h-full"
            style={{ backgroundColor: isEmpty ? '#d4d4d8' : atsScore >= 80 ? '#10b981' : atsScore >= 50 ? '#f59e0b' : '#ef4444' }}
          />
        </div>
      </button>
      
      <button
        onClick={() => setShowTips(true)}
        className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-all border border-brand-100"
        title={language === "ar" ? "نصائح للتحسين" : "Tips to improve"}
      >
        <HelpCircle size={14} />
      </button>

      <ATSTipsModal 
        isOpen={showTips} 
        onClose={() => setShowTips(false)} 
        tips={tips} 
      />

      <KeyboardShortcutsModal 
        isOpen={showKeyboardShortcuts} 
        onClose={() => setShowKeyboardShortcuts(false)} 
      />
    </div>
  );
};

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
                            ? "bg-white border-brand-200 shadow-md ring-1 ring-brand-50"
                            : "bg-transparent border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200",
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            step.done
                              ? "bg-emerald-50 text-emerald-600"
                              : isActive
                                ? "bg-brand-600 text-white"
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
                          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
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

export default function EditorPage() {
  const { language, dir } = useLanguageStore();
  const t = (translations[language as keyof typeof translations] || translations.en).editor;

  const [activeTab, setActiveTab] = useState<Tab>("basics");
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

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
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "load" | "clear";
    message: string;
  } | null>(null);
  const [previewMode, setPreviewMode] = useState<"resume" | "cover-letter">(
    "resume",
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const fullName = useResumeStore((state) => state.data.personalInfo.fullName);
  const isPremium = useResumeStore((state) => state.data.isPremium);
  const data = useResumeStore((state) => state.data);
  const loadExampleData = useResumeStore((state) => state.loadExampleData);
  const resetData = useResumeStore((state) => state.resetData);

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
    if (data.templateId) {
      trackEvent(FUNNEL_EVENTS.TEMPLATE_CHOSEN, {
        templateId: data.templateId,
      });
    }
  }, [data.templateId]);

  const { hasSeenOnboarding, startOnboarding, skipOnboarding } =
    useOnboardingStore();

  const calculateProgress = () => {
    let filled = 0;
    const total = 4; // basics, experience, education, skills
    if (
      data.personalInfo.fullName &&
      data.personalInfo.email &&
      data.personalInfo.jobTitle
    )
      filled++;
    if (data.experience && data.experience.length > 0) filled++;
    if (data.education && data.education.length > 0) filled++;
    if (data.skills && data.skills.length > 0) filled++;

    return Math.round((filled / total) * 100);
  };

  const overallProgress = calculateProgress();
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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
  }, [data]);

  const handleUndo = () => useResumeStore.temporal?.getState().undo();
  const handleRedo = () => useResumeStore.temporal?.getState().redo();

  // Show welcome modal if not seen
  useEffect(() => {
    if (!hasSeenOnboarding && !showWelcomeModal) {
      setShowWelcomeModal(true);
    }
  }, [hasSeenOnboarding]);

  const handleStartTour = () => {
    setShowWelcomeModal(false);
    startOnboarding();
  };

  const handleSkipTour = () => {
    setShowWelcomeModal(false);
    skipOnboarding();
  };

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

    if (format === "pdf") {
      setIsExporting(true);
      try {
        const htmlContent = componentRef.current?.innerHTML;
        const styles = Array.from(
          document.head.querySelectorAll('style, link[rel="stylesheet"]'),
        )
          .map((el) => el.outerHTML)
          .join("\\n");

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

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fullName || "Resume"}_CV.pdf`;
        link.click();

        setShowPostDownloadModal(true);
        setTimeout(() => setShowFeedbackModal(true), 2000);
      } catch (err) {
        console.error(
          "Server PDF Generation Failed. Falling back to client-side. Error:",
          err,
        );
        handlePrint();
      } finally {
        setIsExporting(false);
      }
    } else if (format === "docx") {
      generateWord(useResumeStore.getState().data);
    } else if (format === "txt") {
      const data = useResumeStore.getState().data;
      const text = `${data.personalInfo.fullName}\\n${data.personalInfo.email}\\n${data.personalInfo.phone}\\n\\nEXPERIENCE\\n${data.experience
        .map((exp) => `${exp.position} at ${exp.company}\\n${exp.description}`)
        .join("\\n\\n")}`;
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.personalInfo.fullName || "resume"}.txt`;
      link.click();
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
      id: "custom",
      label: String(language === "ar" ? "أقسام إضافية" : "Custom Sections"),
      shortLabel: String(language === "ar" ? "أقسام" : "Custom"),
      icon: PlusIcon,
      tourId: "custom-section",
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
    certifications:
      String(language === "ar"
        ? "أضف الشهادات والإنجازات المهنية."
        : "Add professional certifications and achievements."),
    custom:
      String(language === "ar"
        ? "أضف أي أقسام إضافية تراها مهمة."
        : "Add any additional sections you find important."),
    "cover-letter": String(t.coverLetterDesc || "Cover letter info"),
    finish: String(t.finishDesc || "Finish info"),
    review: String(t.finishDesc || "Finish info"),
  };

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
      <OnboardingTour />

      {/* Floating Dock Navbar (Top) */}
      <div className="fixed top-2 start-1/2 -translate-x-1/2 flex justify-center z-50 px-2 pointer-events-none w-full max-w-6xl text-start">
        <nav className="pointer-events-auto flex items-center gap-4 px-6 py-3 rounded-full transition-all duration-300 w-full justify-between min-h-[80px] bg-white/90 backdrop-blur-md border border-neutral-200 shadow-xl">
          <div className="flex items-center gap-4">
            {/* Home / Logo */}
            <Link to="/" title={t.backToHome} className="flex items-center transform origin-left rtl:origin-right hover:scale-105 transition-transform shrink-0">
              <img
                src="https://i.ibb.co/tPN2Wtwd/IN-LOGO-icon-with-tag-3.png"
                alt="Hash Resume"
                className="h-[36px] sm:h-[42px] w-auto object-contain pointer-events-none"
              />
            </Link>

            {/* Separator */}
            <div className="w-px h-8 bg-neutral-200 mx-1 hidden min-[400px]:block"></div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <Tooltip content={String(t.undo || "")}>
                <button
                  onClick={handleUndo}
                  disabled={!temporalState.canUndo}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 disabled:opacity-20 transition-colors"
                  aria-label={String(t.undo || "")}
                >
                  <Undo2 size={18} />
                </button>
              </Tooltip>
              <Tooltip content={String(t.redo || "")}>
                <button
                  onClick={handleRedo}
                  disabled={!temporalState.canRedo}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 disabled:opacity-20 transition-colors"
                  aria-label={String(t.redo || "")}
                >
                  <Redo2 size={18} />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Center Section: Saving & ATS */}
          <div className="hidden sm:flex items-center gap-4 flex-1 justify-center">
            {/* Saving Indicator */}
            <div className="min-w-max">
              <AutoSaveIndicator />
            </div>

            {/* Offline Indicator */}
            {!isOnline && (
              <div
                className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse border border-rose-200"
                title="Offline mode - changes will be saved locally"
              >
                <div className="w-2 h-2 bg-rose-500 rounded-full" />
                <span>
                  {language === "ar" ? "غير متصل" : "Offline"}
                </span>
              </div>
            )}

            {/* ATS Score */}
            <ATSScoreIndicator setActiveTab={setActiveTab} />
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Tooltip content={language === "ar" ? "عرض التقدم (اضغط للتفاصيل)" : "View Progress (Click for details)"}>
              <button
                onClick={() => setShowProgressTracker(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                aria-label={language === "ar" ? "عرض التقدم" : "View Progress"}
              >
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.2"
                      strokeWidth="4"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={`${overallProgress}, 100`}
                      className="transition-all duration-500 ease-in-out"
                    />
                  </svg>
                </div>
                <span className="text-xs font-bold">{overallProgress}%</span>
              </button>
            </Tooltip>

            <div className="hidden min-[500px]:flex items-center gap-2">
              <Tooltip content={String(t.showMeAround || "")}>
                <button
                  onClick={() => setShowWelcomeModal(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-brand-500 bg-brand-50 hover:bg-brand-100 transition-colors border border-brand-200"
                  aria-label={String(t.showMeAround || "")}
                >
                  <Sparkles size={18} className="animate-pulse" />
                </button>
              </Tooltip>
              <LanguageSwitcher className="[&>span]:hidden lg:[&>span]:inline" />
              <Tooltip content={String(t.resumeSettings || "Templates & Settings")}>
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-neutral-600 border border-neutral-200 hover:bg-neutral-100 transition-colors"
                  aria-label={String(t.resumeSettings || "Templates & Settings")}
                >
                  <LayoutTemplate size={18} />
                  <span className="text-xs font-bold hidden sm:inline">
                    {language === "ar" ? "القوالب" : "Templates"}
                  </span>
                </button>
              </Tooltip>
            </div>

            {/* Separator on Desktop */}
            <div className="hidden lg:block w-px h-8 bg-neutral-200 mx-1"></div>

            {/* Persistent Preview Button */}
            <button
              onClick={() => setShowFullPreview(true)}
              className="w-10 h-10 lg:w-auto lg:px-4 lg:py-2 flex items-center justify-center gap-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all border border-neutral-200 active:scale-95 font-bold text-[10px] sm:text-xs uppercase tracking-wider"
              title={language === "ar" ? "معاينة كاملة" : "Full Preview"}
            >
              <Eye size={18} className="text-neutral-500" />
              <span className="hidden lg:inline">
                {language === "ar" ? "معاينة كاملة" : "Full Preview"}
              </span>
            </button>

            <button
              onClick={handleExportClick}
              disabled={isExporting}
              data-tour="export-button"
              style={{
                backgroundColor: isExporting ? 'var(--color-neutral-400)' : 'var(--color-brand-500)',
                color: '#fff',
                cursor: isExporting ? 'not-allowed' : 'pointer',
              }}
              className="flex items-center gap-2 h-10 sm:h-auto px-4 sm:py-2.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 font-black text-[10px] sm:text-xs uppercase tracking-widest shrink-0"
            >
              {isExporting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download size={14} />
              )}
              <span className="hidden sm:inline">
                {isExporting
                  ? language === "ar"
                    ? "جاري التصدير..."
                    : "Exporting..."
                  : t.exportPdf}
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Spacer for fixed dock */}
      <div className="h-24 sm:h-28 shrink-0" />

      {/* Real-time Progress tracker moved to tabs and dock */}

      <PanelGroup
        direction={isMobile ? "vertical" : "horizontal"}
        className="flex-1 w-full h-full overflow-hidden relative editor-form"
      >
        {/* Editor Area */}
        <Panel defaultSize={55} minSize={30} className="block">
          <div className="flex flex-col h-full overflow-hidden transition-all duration-300 bg-neutral-50">
            {/* Horizontal Tabs - Now visible on all screen sizes */}
            <div 
              className="bg-white border-b overflow-x-auto hide-scrollbar z-30 sticky top-0 relative relative-tabs-container"
              style={{ borderColor: 'var(--color-neutral-200)', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
            >
              <div 
                className="absolute bottom-0 left-0 h-[3px] bg-brand-500 transition-all duration-500 z-50 pointer-events-none"
                style={{ width: `${overallProgress}%` }}
              />
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex gap-6 min-w-max">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl font-bold md:text-sm text-xs transition-all relative whitespace-nowrap",
                          isActive ? "text-white shadow-md scale-105" : "text-neutral-500 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 bg-white"
                        )}
                        style={isActive ? { backgroundColor: 'var(--color-neutral-900)' } : {}}
                      >
                        <Icon
                          size={16}
                          style={{ color: isActive ? 'var(--color-brand-500)' : undefined }}
                          className={!isActive ? 'text-neutral-400' : ''}
                        />
                        {tab.label}
                        {isActive && (
                          <motion.div
                            layoutId="activeTabDot"
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                            style={{ backgroundColor: 'var(--color-brand-500)' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <main
              ref={formRef}
              onScroll={handleFormScroll}
              className="flex-1 overflow-y-auto p-4 sm:p-8 sm:pt-10 scroll-smooth relative"
            >
              <div className="max-w-4xl mx-auto pb-[120px] sm:pb-32">
                {/* Tab instructions header moved inside scroll area */}
                <div className="pb-6">
                  <motion.div
                    key={"tab-" + activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-5 sm:p-7 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(255,77,45,0.08)]"
                  >
                    <div className="absolute top-0 end-0 w-40 h-40 rounded-full blur-3xl -me-20 -mt-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,77,45,0.1), transparent)' }}></div>

                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] bg-brand-500 flex items-center justify-center shrink-0 shadow-brand-500/25 relative z-10 ring-4 ring-brand-50 border border-white/20 group">
                      <Sparkles size={20} className="text-white animate-pulse sm:w-6 sm:h-6" />
                    </div>

                    <div className="flex-1 relative z-10 text-start w-full">
                      <div className="flex flex-col gap-1.5 sm:gap-2 w-full max-w-[200px] sm:max-w-xs mb-2">
                        <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-brand-600 uppercase tracking-wider">
                          <span>{String(tabs.find((t) => t.id === activeTab)?.label || "")}</span>
                          <span>{activeTabIndex} / {tabs.length}</span>
                        </div>
                        <div className="w-full bg-brand-100 h-1.5 sm:h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full transition-all duration-500"
                            style={{ width: `${(activeTabIndex / tabs.length) * 100}%` }}
                          />
                        </div>
                      </div>
                      <h1 className="text-sm sm:text-lg font-black text-neutral-900 tracking-tight leading-snug">
                        {String(tabDescriptions[activeTab] || "")}
                      </h1>
                    </div>

                    <div className="flex items-center gap-2 z-10 w-full sm:w-auto mt-4 sm:mt-0">
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "load",
                            message: t.overwriteConfirm,
                          })
                        }
                        className="flex-1 sm:flex-none text-[10px] font-black uppercase tracking-widest text-brand-500 bg-white hover:bg-brand-50 h-12 px-4 rounded-2xl transition-all border border-brand-500/10 shadow-sm whitespace-nowrap active:scale-95"
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
                        className="flex-1 sm:flex-none text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-rose-500 h-12 px-4 rounded-2xl hover:bg-rose-50 transition-all border border-transparent whitespace-nowrap active:scale-95"
                      >
                        {String(t.clearAll || "")}
                      </button>
                    </div>
                  </motion.div>
                </div>

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
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white relative overflow-hidden" style={{ backgroundColor: '#FF4D2D', boxShadow: '0 8px 20px rgba(255, 77, 45, 0.3)' }}>
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

                            <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-end">
                              <button
                                onClick={() => setActiveTab("experience")}
                                className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-neutral-900/10 hover:shadow-neutral-900/20 active:scale-95"
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

                            <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-between gap-4">
                              <button
                                onClick={() => setActiveTab("basics")}
                                className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                              >
                                {language === "ar" ? "السابق" : "Previous"}
                              </button>
                              <button
                                onClick={() => setActiveTab("education")}
                                className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-neutral-900/10 hover:shadow-neutral-900/20 active:scale-95"
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

                            <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-between gap-4">
                              <button
                                onClick={() => setActiveTab("experience")}
                                className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                              >
                                {language === "ar" ? "السابق" : "Previous"}
                              </button>
                              <button
                                onClick={() => setActiveTab("skills")}
                                className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-neutral-900/10 hover:shadow-neutral-900/20 active:scale-95"
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
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white relative overflow-hidden" style={{ backgroundColor: '#FF4D2D', boxShadow: '0 8px 20px rgba(255, 77, 45, 0.3)' }}>
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

                          <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-between gap-4">
                            <button
                              onClick={() => setActiveTab("education")}
                              className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                            >
                              {language === "ar" ? "السابق" : "Previous"}
                            </button>
                            <button
                              onClick={() => setActiveTab("projects")}
                              className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-neutral-900/10 hover:shadow-neutral-900/20 active:scale-95"
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
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white relative overflow-hidden" style={{ backgroundColor: '#FF4D2D', boxShadow: '0 8px 20px rgba(255, 77, 45, 0.3)' }}>
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

                          <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-between gap-4">
                            <button
                              onClick={() => setActiveTab("skills")}
                              className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                            >
                              {language === "ar" ? "السابق" : "Previous"}
                            </button>
                            <button
                              onClick={() => setActiveTab("certifications")}
                              className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-neutral-900/10 hover:shadow-neutral-900/20 active:scale-95"
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
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white relative overflow-hidden" style={{ backgroundColor: '#FF4D2D', boxShadow: '0 8px 20px rgba(255, 77, 45, 0.3)' }}>
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

                          <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-between gap-4">
                            <button
                              onClick={() => setActiveTab("projects")}
                              className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                            >
                              {language === "ar" ? "السابق" : "Previous"}
                            </button>
                            <button
                              onClick={() => setActiveTab("custom")}
                              className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-neutral-900/10 hover:shadow-neutral-900/20 active:scale-95"
                            >
                              {language === "ar"
                                ? "الخطوة التالية: أقسام مخصصة"
                                : "Next: Custom Sections"}
                              <ArrowRight
                                size={20}
                                className="group-hover:translate-x-1 transition-transform rtl:rotate-180 group-hover:rtl:-translate-x-1"
                              />
                            </button>
                          </div>
                        </section>
                      )}
                      {activeTab === "custom" && (
                        <section>
                          <div className="flex items-center gap-4 mb-6 text-start">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white relative overflow-hidden" style={{ backgroundColor: '#FF4D2D', boxShadow: '0 8px 20px rgba(255, 77, 45, 0.3)' }}>
                              <PlusIcon
                                size={24}
                                className="relative z-10 drop-shadow-sm"
                              />
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                                {String(t.custom?.title || "Custom Sections")}
                              </h2>
                              <p className="text-xs text-neutral-500 font-medium">
                                {language === "ar"
                                  ? "أضف أي أقسام إضافية تراها مهمة"
                                  : "Add any additional sections you find important"}
                              </p>
                            </div>
                          </div>
                          <CustomSectionsForm />

                          <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-between gap-4">
                            <button
                              onClick={() => setActiveTab("certifications")}
                              className="text-neutral-500 font-bold px-6 py-4 rounded-2xl hover:bg-neutral-100 transition-colors"
                            >
                              {language === "ar" ? "السابق" : "Previous"}
                            </button>
                            <button
                              onClick={() => setActiveTab("cover-letter")}
                              className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-neutral-900/10 hover:shadow-neutral-900/20 active:scale-95"
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
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white relative overflow-hidden" style={{ backgroundColor: '#FF4D2D', boxShadow: '0 8px 20px rgba(255, 77, 45, 0.3)' }}>
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

                          <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-end">
                            <button
                              onClick={() => setActiveTab("finish")}
                              className="group flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-neutral-900/10 hover:shadow-neutral-900/20 active:scale-95"
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

                {/* Mobile Scroll to Top */}
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
              </div>
            </main>
          </div>
        </Panel>

        {!isMobile && (
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
            <div className="h-14 bg-neutral-50/80 backdrop-blur-sm border-b border-neutral-200 flex items-center justify-between px-6 shrink-0 absolute top-0 start-0 end-0 z-10 transition-colors duration-200">
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
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                  title={String(t.resumeSettings || "")}
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-2 sm:p-4 md:p-12 pt-24 md:pt-24 flex justify-center items-start bg-neutral-100/50">
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
                    "bg-neutral-50 shadow-2xl rounded-sm overflow-hidden ring-1 ring-neutral-900/5",
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

      {/* Floating Compact Navbar (Bottom) */}
      <div className="fixed bottom-4 sm:bottom-6 start-1/2 -translate-x-1/2 z-40 mb-safe w-[94%] sm:w-auto max-w-[480px]">
        <div
          className="flex items-center justify-between gap-2 w-full px-3 py-2 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--color-neutral-200)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const currentIndex = tabs.findIndex((t) => t.id === activeTab);
                if (currentIndex > 0) {
                  hapticFeedback(30);
                  setActiveTab(tabs[currentIndex - 1].id as Tab);
                }
              }}
              disabled={activeTab === tabs[0].id}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors disabled:opacity-30"
              style={{ color: 'var(--color-neutral-500)' }}
            >
              <ChevronLeft size={20} className="rtl:rotate-180" />
            </button>

            <div className="flex flex-col min-w-[90px] text-center px-1">
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--color-brand-500)' }}>
                {activeTabIndex} / {tabs.length}
              </span>
              <span className="text-xs font-bold truncate max-w-[110px]" style={{ color: 'var(--color-neutral-900)' }}>
                {tabs.find((t) => t.id === activeTab)?.shortLabel}
              </span>
            </div>

            <button
              onClick={() => {
                const currentIndex = tabs.findIndex((t) => t.id === activeTab);
                if (currentIndex < tabs.length - 1) {
                  hapticFeedback(30);
                  setActiveTab(tabs[currentIndex + 1].id as Tab);
                }
              }}
              disabled={activeTab === tabs[tabs.length - 1].id}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors disabled:opacity-30"
              style={{ color: 'var(--color-neutral-500)' }}
            >
              <ArrowRight size={20} className="rtl:rotate-180" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { hapticFeedback(40); setShowMobilePreview(!showMobilePreview); }}
              className="md:hidden flex items-center justify-center gap-2 font-black h-10 px-4 rounded-xl transition-all active:scale-95 text-white text-xs uppercase tracking-widest"
              style={{ backgroundColor: 'var(--color-brand-500)', boxShadow: '0 4px 12px color-mix(in srgb, var(--color-brand-500) 35%, transparent)' }}
              title={language === 'ar' ? 'معاينة' : 'Preview'}
            >
              <Eye size={16} />
              <span>{language === 'ar' ? 'معاينة' : 'Preview'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
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

        <WelcomeModal
          isOpen={showWelcomeModal}
          onStartTour={handleStartTour}
          onSkip={handleSkipTour}
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
                          ? "bg-indigo-600 hover:bg-indigo-700"
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
    </div>
  );
}
