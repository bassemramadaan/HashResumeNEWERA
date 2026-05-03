import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { trackEvent, FUNNEL_EVENTS } from "../utils/analytics";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "framer-motion";
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
import { useStore } from "zustand";
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
} from "lucide-react";
import { useResumeStore, ResumeData } from "../store/useResumeStore";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";
import Logo from "../components/Logo";
import LanguageSwitcher from "../components/LanguageSwitcher";
import SettingsModal from "../components/SettingsModal";
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
const CertificationsForm = lazy(
  () => import("../components/editor/CertificationsForm"),
);
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
import Sidebar from "../components/editor/Sidebar";

const FormLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <Loader2 className="w-10 h-10 text-[#ff4d2d] animate-spin" />
    <p className="text-white0 font-medium">Loading section...</p>
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
  | "finish";

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
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500"
          >
            <div className="w-4 h-4 border-2 border-slate-300 border-t-[#ff4d2d] rounded-full animate-spin" />
            {t.saving}
          </motion.div>
        ) : (
          <motion.div
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-slate-500"
          >
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span className="hidden sm:inline">
              {t.savedLocally} {lastSavedTime && `${t.at} ${lastSavedTime}`}
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
  const atsScore = React.useMemo(() => calculateATSScore(data).score, [data]);

  return (
    <button
      onClick={() => setActiveTab("finish")}
      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-white/90 hover:bg-slate-100 transition-all border border-slate-200 group shrink-0"
    >
      <div className="flex flex-col items-start">
        <span className="text-[7px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-tighter sm:tracking-widest leading-none mb-0.5">
          {language === "ar" ? "النتيجة" : "Score"}
        </span>
        <span
          className={cn(
            "text-[10px] sm:text-sm font-black leading-none",
            atsScore >= 80
              ? "text-emerald-600"
              : atsScore >= 50
                ? "text-amber-500"
                : "text-rose-500",
          )}
        >
          {atsScore}%
        </span>
      </div>
      <div className="hidden sm:block w-12 h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${atsScore}%` }}
          className={cn(
            "h-full",
            atsScore >= 80
              ? "bg-emerald-500"
              : atsScore >= 50
                ? "bg-amber-500"
                : "bg-rose-500",
          )}
        />
      </div>
    </button>
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
      label: t.steps.basics,
      icon: User,
      done: !!(data.personalInfo.fullName && data.personalInfo.email),
    },
    {
      id: "experience",
      label: t.steps.experience,
      icon: Briefcase,
      done: data.experience.length > 0,
    },
    {
      id: "education",
      label: t.steps.education,
      icon: GraduationCap,
      done: data.education.length > 0,
    },
    {
      id: "skills",
      label: t.steps.skills,
      icon: Wrench,
      done: data.skills.length > 0,
    },
    {
      id: "finish",
      label: t.steps.polish,
      icon: Target,
      done: false,
    },
  ];

  const filledCount = steps.filter((s) => s.done).length;
  const progressPercent = Math.round((filledCount / (steps.length - 1)) * 100);
  const estimatedTime =
    progressPercent === 100 ? 0 : progressPercent > 50 ? 2 : 5;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-slate-50 rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
                <Target size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                {t.title}
              </h2>
              <p className="text-slate-500 text-sm">{t.subtitle}</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                <span>{progressPercent}% Complete</span>
                <span>
                  {estimatedTime > 0
                    ? t.estimatedTime.replace(
                        "{time}",
                        estimatedTime.toString(),
                      )
                    : t.ready}
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-[#ff4d2d]"
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
                          ? "bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50"
                          : "bg-transparent border-slate-100 hover:bg-slate-50 hover:border-slate-200",
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          step.done
                            ? "bg-emerald-50 text-emerald-600"
                            : isActive
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-400 group-hover:bg-slate-200",
                        )}
                      >
                        {step.done ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <Icon size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                          {step.id}
                        </div>
                        <div
                          className={cn(
                            "text-sm font-semibold",
                            isActive ? "text-slate-900" : "text-slate-600",
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
    </AnimatePresence>
  );
};

export default function EditorPage() {
  const { language, dir } = useLanguageStore();
  const t = translations[language].editor;

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
    if (data.experience.length > 0) filled++;
    if (data.education.length > 0) filled++;
    if (data.skills.length > 0) filled++;

    return Math.round((filled / total) * 100);
  };

  const progressPercent = calculateProgress();
  const estimatedTime =
    progressPercent === 100 ? 0 : progressPercent > 50 ? 2 : 5;

  // Zundo hooks for undo/redo
  const { undo, redo, pastStates, futureStates } = useStore(
    useResumeStore.temporal,
  );

  // Show welcome modal if not seen
  useEffect(() => {
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setShowWelcomeModal(true), 1000);
      return () => clearTimeout(timer);
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
          if (futureStates.length > 0) redo();
        } else {
          if (pastStates.length > 0) undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        if (futureStates.length > 0) redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, pastStates.length, futureStates.length]);

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
      label: t.personalInfo,
      shortLabel: language === "ar" ? "البيانات" : "Basics",
      icon: User,
      tourId: "personal-info",
    },
    {
      id: "experience",
      label: t.experience.title,
      shortLabel: language === "ar" ? "الخبرة" : "Exp",
      icon: Briefcase,
      tourId: "experience-section",
    },
    {
      id: "education",
      label: t.education.title,
      shortLabel: language === "ar" ? "التعليم" : "Edu",
      icon: GraduationCap,
      tourId: "education-section",
    },
    {
      id: "skills",
      label: t.skills.title,
      shortLabel: language === "ar" ? "المهارات" : "Skills",
      icon: Wrench,
      tourId: "skills-section",
    },
    {
      id: "projects",
      label: t.projects.title,
      shortLabel: language === "ar" ? "المشاريع" : "Projects",
      icon: LayoutTemplate,
      tourId: "projects-section",
    },
    {
      id: "certifications",
      label: t.certifications.title,
      shortLabel: language === "ar" ? "الشهادات" : "Certs",
      icon: Award,
      tourId: "certifications-section",
    },
    {
      id: "custom",
      label: t.custom.title,
      shortLabel: language === "ar" ? "أقسام إضافية" : "Custom",
      icon: PlusIcon,
      tourId: "custom-section",
    },
    {
      id: "cover-letter",
      label: t.coverLetter.title,
      shortLabel: language === "ar" ? "الخطاب" : "Cover",
      icon: FileText,
      tourId: "cover-letter-section",
    },
    {
      id: "finish",
      label: language === "ar" ? "التحميل والتدقيق" : "Audit & Download",
      shortLabel: language === "ar" ? "تحميل" : "Finish",
      icon: Download,
      tourId: "review-section",
    },
  ];

  const activeTabIndex = tabs.findIndex((t) => t.id === activeTab) + 1;

  const tabDescriptions: Record<Tab, string> = {
    basics: t.basicsDesc,
    experience: t.experienceDesc,
    education: t.educationDesc,
    skills: t.skillsDesc,
    projects:
      language === "ar"
        ? "أرنا أفضل أعمالك ومشاريعك."
        : "Showcase your best work and projects.",
    certifications:
      language === "ar"
        ? "أضف الشهادات والإنجازات المهنية."
        : "Add professional certifications and achievements.",
    custom:
      language === "ar"
        ? "أضف أي أقسام إضافية تراها مهمة."
        : "Add any additional sections you find important.",
    "cover-letter": t.coverLetterDesc,
    finish: t.finishDesc,
  };

  return (
    <div
      className={cn(
        "flex flex-col h-[100dvh] bg-slate-50 overflow-hidden transition-colors duration-200",
        language === "ar" ? "font-editor-ar" : "font-editor-en",
      )}
      dir={dir}
    >
      <Helmet>
        <title>{t.editor?.title || "Resume Editor"} | Hash Resume</title>
        <meta
          name="description"
          content="Build your professional resume with our AI-powered editor."
        />
      </Helmet>
      <OnboardingTour />

      {/* Floating Dock Navbar (Top) */}
      <div className="fixed top-2 sm:top-4 start-1/2 -translate-x-1/2 flex justify-center z-50 px-2 sm:px-4 pointer-events-none w-full max-w-5xl text-start">
        <nav className="pointer-events-auto flex items-center gap-1 sm:gap-2 p-1 rounded-full bg-white/95 border border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 w-full justify-between sm:justify-start ring-1 ring-black/5">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Home / Logo */}
            <Link
              to="/"
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-sm text-[#ff4d2d] hover:scale-105 transition-transform shrink-0 border border-slate-100"
              title={t.backToHome}
            >
              <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>

            {/* Separator */}
            <div className="w-px h-6 bg-slate-200 mx-0.5 hidden sm:block"></div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => undo()}
                disabled={pastStates.length === 0}
                className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-20 transition-colors"
                title={t.undo}
              >
                <Undo2 size={18} className="sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => redo()}
                disabled={futureStates.length === 0}
                className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-20 transition-colors"
                title={t.redo}
              >
                <Redo2 size={18} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Center Section: Saving & ATS */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center">
            {/* Saving Indicator */}
            <div>
              <AutoSaveIndicator />
            </div>

            {/* Offline Indicator */}
            {!isOnline && (
              <div
                className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse border border-rose-200"
                title="Offline mode - changes will be saved locally"
              >
                <div className="w-2 h-2 bg-rose-500 rounded-full" />
                <span className="hidden sm:inline">
                  {language === "ar" ? "غير متصل" : "Offline"}
                </span>
              </div>
            )}

            {/* ATS Score */}
            <ATSScoreIndicator setActiveTab={setActiveTab} />
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setShowProgressTracker(true)}
              className="w-11 h-11 sm:w-auto sm:h-auto sm:p-2.5 flex items-center justify-center rounded-full text-indigo-500 hover:bg-slate-50/50 hover:text-indigo-600 transition-colors"
              title={language === "ar" ? "عرض التقدم" : "View Progress"}
            >
              <Target size={18} className="sm:w-4 sm:h-4" />
            </button>

            <div className="hidden md:flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowWelcomeModal(true)}
                className="w-11 h-11 sm:w-auto sm:h-auto sm:p-2 flex items-center justify-center rounded-full text-[#ff4d2d] bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-200"
                title={t.showMeAround}
              >
                <Sparkles size={18} className="animate-pulse sm:w-4 sm:h-4" />
              </button>
              <LanguageSwitcher className="[&>span]:hidden lg:[&>span]:inline" />
            </div>

            {/* Separator on Desktop */}
            <div className="hidden lg:block w-px h-6 bg-slate-200 mx-1"></div>

            {/* Persistent Preview Button */}
            <button
              onClick={() => setShowFullPreview(true)}
              className="w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center gap-2 sm:px-4 sm:py-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200/50 active:scale-95 font-bold text-[10px] sm:text-xs uppercase tracking-wider"
              title={language === "ar" ? "معاينة كاملة" : "Full Preview"}
            >
              <Eye size={18} className="text-slate-500 sm:w-3.5 sm:h-3.5" />
              <span className="hidden lg:inline">
                {language === "ar" ? "معاينة كاملة" : "Full Preview"}
              </span>
            </button>

            <button
              onClick={handleExportClick}
              disabled={isExporting}
              data-tour="export-button"
              className={cn(
                "flex items-center gap-2 h-11 sm:h-auto px-4 sm:py-2 rounded-full text-white transition-all shadow-md hover:shadow-lg active:scale-95 font-black text-[10px] sm:text-xs uppercase tracking-widest",
                isExporting
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-[#ff4d2d] hover:bg-[#e63e1d]",
              )}
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
              <span className="sm:hidden">
                {isExporting
                  ? language === "ar"
                    ? "الرجاء الانتظار"
                    : "Wait"
                  : language === "ar"
                    ? "تحميل"
                    : "Export"}
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Spacer for fixed dock */}
      <div className="h-20 shrink-0" />

      {/* Real-time Progress Bar */}
      <div className="hidden sm:flex bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 sm:py-3 items-center gap-2 sm:gap-4 z-40 relative shadow-sm overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-black whitespace-nowrap">
            <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-indigo-100 text-indigo-600">
              1
            </span>
            <span
              className={
                progressPercent < 100 ? "text-slate-900" : "text-slate-500"
              }
            >
              {language === "ar" ? "أدخل البيانات" : "Fill Data"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-black whitespace-nowrap">
            <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-orange-100 text-[#ff4d2d]">
              2
            </span>
            <span
              className={
                progressPercent === 100 ? "text-slate-900" : "text-slate-500"
              }
            >
              {language === "ar" ? "راجع الـ ATS" : "Check ATS"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-black whitespace-nowrap hidden sm:flex">
            <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-100 text-emerald-600">
              3
            </span>
            <span className="text-slate-500">
              {language === "ar" ? "نزّل السيرة" : "Download"}
            </span>
          </div>
        </div>

        <div className="w-px h-5 sm:h-6 bg-slate-200 mx-1 sm:mx-2 shrink-0"></div>

        <div className="text-[10px] sm:text-xs font-black text-slate-500 whitespace-nowrap">
          {progressPercent}%
        </div>
        <div className="flex-1 h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px] sm:max-w-xs shrink-0">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className={`h-full transition-all duration-500 ${progressPercent === 100 ? "bg-emerald-500" : "bg-[#ff4d2d]"}`}
          />
        </div>

        <div className="text-[10px] sm:text-xs font-bold text-slate-500 whitespace-nowrap hidden lg:flex items-center gap-2">
          {estimatedTime > 0 && (
            <span className="text-slate-400 font-medium">
              —{" "}
              {language === "ar"
                ? `حوالي ${estimatedTime} دقائق لإنهاء المسودة الأولى`
                : `Est. ${estimatedTime} mins to finish first draft`}
            </span>
          )}
          {progressPercent === 100 && (
            <span className="text-emerald-500 flex items-center gap-1 inline-flex">
              <CheckCircle2 size={12} />{" "}
              {language === "ar" ? "جاهز للمراجعة" : "Ready to review"}
            </span>
          )}
        </div>

        <button
          onClick={() => setShowProgressTracker(true)}
          className="text-[10px] sm:text-xs font-black px-2 sm:px-3 py-1.5 ms-auto text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex justify-center items-center gap-1 shrink-0 whitespace-nowrap"
        >
          <span className="hidden sm:inline">
            {language === "ar" ? "ما التالي؟" : "What's missing?"}
          </span>{" "}
          <Target size={14} />
        </button>
      </div>

      <PanelGroup
        direction="horizontal"
        className="flex-1 w-full h-full overflow-hidden relative editor-form"
      >
        {/* Sidebar Panel - Desktop Only */}
        <Panel
          defaultSize={20}
          minSize={15}
          maxSize={30}
          className="hidden md:block"
        >
          <Sidebar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id)}
            progressPercent={progressPercent}
          />
        </Panel>

        <PanelResizeHandle className="w-1.5 focus:outline-none bg-slate-900/5 hover:bg-[#ff4d2d]/20 transition-colors hidden md:block group z-50">
          <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-12 w-1 bg-[#ff4d2d] rounded-full shadow-[0_0_10px_rgba(255,77,45,0.5)]" />
          </div>
        </PanelResizeHandle>

        {/* Editor Area */}
        <Panel defaultSize={40} minSize={30} className="block">
          <div className="flex flex-col h-full overflow-hidden transition-all duration-300 bg-slate-50">
            {/* Header for Mobile only or alternative info */}
            <div className="md:hidden bg-slate-50 border-b border-slate-200 py-3 overflow-x-auto hide-scrollbar">
              <div className="flex px-4 gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                        isActive
                          ? "bg-[#ff4d2d] text-white shadow-md relative z-10"
                          : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50",
                      )}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <main
              ref={formRef}
              onScroll={handleFormScroll}
              className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth relative"
            >
              <div className="max-w-4xl mx-auto pb-[120px] sm:pb-32">
                {/* Tab instructions header moved inside scroll area */}
                <div className="pb-6">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-5 sm:p-7 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(255,77,45,0.08)]"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#ff4d2d]/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] bg-[#ff4d2d] flex items-center justify-center shrink-0 shadow-[0_12px_24px_rgba(255,77,45,0.25)] relative z-10 ring-4 ring-orange-50 border border-white/20 group">
                      <Sparkles size={20} className="text-white animate-pulse sm:w-6 sm:h-6" />
                    </div>

                    <div className="flex-1 relative z-10 text-start">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-black text-[#ff4d2d] uppercase tracking-widest mb-1.5 opacity-90">
                        <span className="bg-[#ff4d2d]/10 px-2 py-0.5 rounded-full">
                          {activeTabIndex} / {tabs.length}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#ff4d2d]/30"></span>
                        <span>{tabs.find((t) => t.id === activeTab)?.label}</span>
                      </div>
                      <h1 className="text-sm sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                        {tabDescriptions[activeTab]}
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
                        className="flex-1 sm:flex-none text-[10px] font-black uppercase tracking-widest text-[#ff4d2d] bg-white hover:bg-orange-50 h-12 px-4 rounded-2xl transition-all border border-[#ff4d2d]/10 shadow-sm whitespace-nowrap active:scale-95"
                      >
                        {t.loadExample}
                      </button>
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "clear",
                            message: t.clearConfirm,
                          })
                        }
                        className="flex-1 sm:flex-none text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 h-12 px-4 rounded-2xl hover:bg-rose-50 transition-all border border-transparent whitespace-nowrap active:scale-95"
                      >
                        {t.clearAll}
                      </button>
                    </div>
                  </motion.div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
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
                              <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-[#ff4d2d] to-[#e63e1d] shadow-[0_10px_20px_rgba(255,77,45,0.2)] flex items-center justify-center text-white relative overflow-hidden">
                                <User
                                  size={24}
                                  className="relative z-10 drop-shadow-sm"
                                />
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                  {t.personalInfo}
                                </h2>
                                <p className="text-xs text-slate-500 font-medium">
                                  {language === "ar"
                                    ? "بياناتك الأساسية ومعلومات التواصل"
                                    : "Basic details and contact info"}
                                </p>
                              </div>
                            </div>
                            <PersonalInfoForm />

                            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                              <button
                                onClick={() => setActiveTab("experience")}
                                className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95"
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
                              <div className="w-14 h-14 rounded-3xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-[#ff4d2d] relative overflow-hidden group border border-slate-100/50 shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-rose-50 opacity-50" />
                                <Briefcase
                                  size={28}
                                  className="relative z-10 drop-shadow-sm"
                                />
                              </div>
                              <div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                  {t.experience.title}
                                </h2>
                                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                                  {language === "ar"
                                    ? "تاريخك المهني وإنجازاتك"
                                    : "Work history and achievements"}
                                </p>
                              </div>
                            </div>
                            <div className="px-1">
                              <ExperienceForm />
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between gap-4">
                              <button
                                onClick={() => setActiveTab("basics")}
                                className="text-slate-500 font-bold px-6 py-4 rounded-2xl hover:bg-slate-100 transition-colors"
                              >
                                {language === "ar" ? "السابق" : "Previous"}
                              </button>
                              <button
                                onClick={() => setActiveTab("education")}
                                className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95"
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
                              <div className="w-14 h-14 rounded-3xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-[#ff4d2d] relative overflow-hidden group border border-slate-100/50 shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-rose-50 opacity-50" />
                                <GraduationCap
                                  size={28}
                                  className="relative z-10 drop-shadow-sm"
                                />
                              </div>
                              <div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                  {t.education.title}
                                </h2>
                                <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                                  {language === "ar"
                                    ? "خلفيتك الأكاديمية والتعليمية"
                                    : "Academic background"}
                                </p>
                              </div>
                            </div>
                            <div className="px-1">
                              <EducationForm />
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between gap-4">
                              <button
                                onClick={() => setActiveTab("experience")}
                                className="text-slate-500 font-bold px-6 py-4 rounded-2xl hover:bg-slate-100 transition-colors"
                              >
                                {language === "ar" ? "السابق" : "Previous"}
                              </button>
                              <button
                                onClick={() => setActiveTab("skills")}
                                className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95"
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
                            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-[#ff4d2d] to-[#e63e1d] shadow-[0_10px_20px_rgba(255,77,45,0.2)] flex items-center justify-center text-white relative overflow-hidden">
                              <Wrench
                                size={24}
                                className="relative z-10 drop-shadow-sm"
                              />
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {t.skills.title}
                              </h2>
                              <p className="text-xs text-slate-500 font-medium">
                                {language === "ar"
                                  ? "مهاراتك التقنية والشخصية"
                                  : "Tech & soft skills"}
                              </p>
                            </div>
                          </div>
                          <SkillsForm />

                          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between gap-4">
                            <button
                              onClick={() => setActiveTab("education")}
                              className="text-slate-500 font-bold px-6 py-4 rounded-2xl hover:bg-slate-100 transition-colors"
                            >
                              {language === "ar" ? "السابق" : "Previous"}
                            </button>
                            <button
                              onClick={() => setActiveTab("projects")}
                              className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95"
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
                            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-[#ff4d2d] to-[#e63e1d] shadow-[0_10px_20px_rgba(255,77,45,0.2)] flex items-center justify-center text-white relative overflow-hidden">
                              <LayoutTemplate
                                size={24}
                                className="relative z-10 drop-shadow-sm"
                              />
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {t.projects.title}
                              </h2>
                              <p className="text-xs text-slate-500 font-medium">
                                {language === "ar"
                                  ? "أرنا أفضل أعمالك ومشاريعك"
                                  : "Showcase your best work and projects"}
                              </p>
                            </div>
                          </div>
                          <ProjectsForm />

                          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between gap-4">
                            <button
                              onClick={() => setActiveTab("skills")}
                              className="text-slate-500 font-bold px-6 py-4 rounded-2xl hover:bg-slate-100 transition-colors"
                            >
                              {language === "ar" ? "السابق" : "Previous"}
                            </button>
                            <button
                              onClick={() => setActiveTab("certifications")}
                              className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95"
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
                            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-[#ff4d2d] to-[#e63e1d] shadow-[0_10px_20px_rgba(255,77,45,0.2)] flex items-center justify-center text-white relative overflow-hidden">
                              <Award
                                size={24}
                                className="relative z-10 drop-shadow-sm"
                              />
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {t.certifications.title}
                              </h2>
                              <p className="text-xs text-slate-500 font-medium">
                                {language === "ar"
                                  ? "الشهادات والإنجازات المهنية"
                                  : "Certifications and professional achievements"}
                              </p>
                            </div>
                          </div>
                          <CertificationsForm />

                          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between gap-4">
                            <button
                              onClick={() => setActiveTab("projects")}
                              className="text-slate-500 font-bold px-6 py-4 rounded-2xl hover:bg-slate-100 transition-colors"
                            >
                              {language === "ar" ? "السابق" : "Previous"}
                            </button>
                            <button
                              onClick={() => setActiveTab("custom")}
                              className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95"
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
                            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-[#ff4d2d] to-[#e63e1d] shadow-[0_10px_20px_rgba(255,77,45,0.2)] flex items-center justify-center text-white relative overflow-hidden">
                              <PlusIcon
                                size={24}
                                className="relative z-10 drop-shadow-sm"
                              />
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {t.custom.title}
                              </h2>
                              <p className="text-xs text-slate-500 font-medium">
                                {language === "ar"
                                  ? "أضف أي أقسام إضافية تراها مهمة"
                                  : "Add any additional sections you find important"}
                              </p>
                            </div>
                          </div>
                          <CustomSectionsForm />

                          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between gap-4">
                            <button
                              onClick={() => setActiveTab("certifications")}
                              className="text-slate-500 font-bold px-6 py-4 rounded-2xl hover:bg-slate-100 transition-colors"
                            >
                              {language === "ar" ? "السابق" : "Previous"}
                            </button>
                            <button
                              onClick={() => setActiveTab("cover-letter")}
                              className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95"
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
                            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-[#ff4d2d] to-[#e63e1d] shadow-[0_10px_20px_rgba(255,77,45,0.2)] flex items-center justify-center text-white relative overflow-hidden">
                              <FileText
                                size={24}
                                className="relative z-10 drop-shadow-sm"
                              />
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {t.coverLetter.title}
                              </h2>
                              <p className="text-xs text-slate-500 font-medium">
                                {language === "ar"
                                  ? "خطاب تقديمي مخصص بالذكاء الاصطناعي"
                                  : "AI-powered personalized letter"}
                              </p>
                            </div>
                          </div>
                          <CoverLetterForm />

                          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                            <button
                              onClick={() => setActiveTab("finish")}
                              className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95"
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
                          <div className="pt-12 border-t border-slate-100">
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
                      className="md:hidden fixed bottom-[90px] sm:bottom-28 end-6 w-12 h-12 bg-slate-50 text-slate-900 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 flex items-center justify-center z-40 active:scale-90 transition-transform"
                    >
                      <ArrowUp size={24} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1.5 focus:outline-none bg-slate-200 hover:bg-indigo-500 active:bg-indigo-600 transition-colors hidden md:block group z-50">
          <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-12 w-1 bg-white rounded-full" />
          </div>
        </PanelResizeHandle>

        {/* Preview Area / Bottom Sheet for Mobile */}
        <Panel
          defaultSize={45}
          minSize={30}
          className="hidden md:block w-full h-full"
        >
          <div
            data-tour="preview-pane"
            className="bg-slate-100 border-s border-slate-200 flex-col flex h-full overflow-hidden relative transition-colors duration-200"
          >
            <div className="h-14 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-6 shrink-0 absolute top-0 start-0 end-0 z-10 transition-colors duration-200">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-200">
                  <button
                    onClick={() => setPreviewMode("resume")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all",
                      previewMode === "resume"
                        ? "bg-slate-50 text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    <LayoutTemplate size={14} />
                    Resume
                  </button>
                  <button
                    onClick={() => setPreviewMode("cover-letter")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all",
                      previewMode === "cover-letter"
                        ? "bg-slate-50 text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    <FileText size={14} />
                    Cover Letter
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFullPreview(true)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title={t.fullPreview}
                >
                  <Maximize2 size={18} />
                </button>
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title={t.resumeSettings}
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-2 sm:p-4 md:p-12 pt-24 md:pt-24 flex justify-center items-start bg-slate-100/50">
              <div
                className={cn(
                  "origin-top transition-all duration-500 flex justify-center",
                  previewMode !== "cover-letter"
                    ? "scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 h-[calc(297mm*0.45)] sm:h-[calc(297mm*0.6)] md:h-[calc(297mm*0.8)] lg:h-[calc(297mm*0.9)] xl:h-auto"
                    : "w-full max-w-3xl",
                )}
              >
                <div
                  className={cn(
                    "bg-slate-50 shadow-2xl rounded-sm overflow-hidden ring-1 ring-slate-900/5",
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
      </PanelGroup>

      {/* Mobile Bottom Sheet Preview */}
      <AnimatePresence>
        {showMobilePreview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobilePreview(false)}
              className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-x-0 bottom-0 h-[85vh] bg-slate-100 rounded-t-[2rem] shadow-2xl z-[70] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-200">
                  <button
                    onClick={() => setPreviewMode("resume")}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                      previewMode === "resume"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    <LayoutTemplate size={14} />
                    Resume
                  </button>
                  <button
                    onClick={() => setPreviewMode("cover-letter")}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                      previewMode === "cover-letter"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    <FileText size={14} />
                    Letter
                  </button>
                </div>
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-x-hidden overflow-y-auto w-full p-2 sm:p-4 flex flex-col items-center bg-slate-100">
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
                        <ResumePreview />
                      )}
                    </Suspense>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Compact Navbar (Bottom) */}
      <div className="fixed bottom-4 sm:bottom-6 start-1/2 -translate-x-1/2 z-40 flex items-center bg-white/95 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300 mb-safe p-2 w-[94%] sm:w-auto max-w-[500px] sm:max-w-none">
        <div className="flex items-center justify-between gap-4 w-full px-2 py-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const currentIndex = tabs.findIndex((t) => t.id === activeTab);
                if (currentIndex > 0) {
                  hapticFeedback(30);
                  setActiveTab(tabs[currentIndex - 1].id as Tab);
                }
              }}
              disabled={activeTab === tabs[0].id}
              className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={24} className="rtl:rotate-180" />
            </button>

            <div className="flex flex-col min-w-[100px] text-center px-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ff4d2d]">
                {activeTabIndex} / {tabs.length}
              </span>
              <span className="text-sm font-bold text-slate-900 truncate max-w-[120px]">
                {tabs.find((t) => t.id === activeTab)?.label}
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
              className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full disabled:opacity-30 transition-colors"
            >
              <ArrowRight size={24} className="rtl:rotate-180" />
            </button>
          </div>

          <div className="flex items-center gap-2 ms-auto">
            {/* Mobile Preview Toggle */}
            <button
              onClick={() => {
                hapticFeedback(40);
                setShowMobilePreview(!showMobilePreview);
              }}
              className="md:hidden flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 active:scale-95 shadow-sm"
              title={language === "ar" ? "معاينة" : "Preview"}
            >
              <Eye size={20} />
            </button>

            {/* Action Button: Export */}
            <button
              onClick={handleExportClick}
              className="flex items-center justify-center gap-2 bg-[#ff4d2d] text-white font-black h-12 px-5 sm:px-6 rounded-full hover:bg-orange-600 active:bg-[#e63e1d] active:scale-95 transition-all shadow-lg shadow-orange-500/25 text-xs sm:text-sm uppercase tracking-widest"
            >
              <Download size={18} />
              <span className="hidden sm:inline">{t.exportPdf}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Suspense fallback={null}>
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
        {/* Full Page Preview Modal */}
        <AnimatePresence>
          {showFullPreview && (
            <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col items-center"
              >
                <div className="w-full max-w-5xl flex justify-between items-center mb-8 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-slate-50/10 rounded-2xl">
                      <FileText className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-white text-2xl font-black tracking-tight">
                        {t.resumePreview}
                      </h2>
                      <p className="text-slate-400 text-sm font-medium">
                        Review your masterpiece before exporting
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleExportClick}
                      className="bg-[#ff4d2d] hover:bg-[#e63e1d] text-white px-6 py-4 rounded-full flex items-center gap-2 font-black transition-all text-xs shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest"
                    >
                      <Download size={18} />
                      {t.exportPdf}
                    </button>
                    <button
                      onClick={() => setShowFullPreview(false)}
                      className="bg-slate-50/10 hover:bg-slate-50/20 text-white p-4 rounded-full transition-colors border border-white/10"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="w-full max-w-[210mm] bg-slate-50 shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden shrink-0 mb-20 ring-1 ring-white/20">
                  <ResumePreview />
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

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />

        <ProgressTrackerModal
          isOpen={showProgressTracker}
          onClose={() => setShowProgressTracker(false)}
          data={data}
          activeTab={activeTab}
          onJumpToStep={(id) => setActiveTab(id)}
        />

        {/* Action Confirmation Modal */}
        <AnimatePresence>
          {confirmAction && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-center text-slate-900">
                    {confirmAction.type === "load"
                      ? "Load Example Data?"
                      : "Clear All Data?"}
                  </h3>
                  <p className="text-center text-slate-600">
                    {confirmAction.message}
                  </p>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setConfirmAction(null)}
                      className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
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
      </Suspense>
    </div>
  );
}
