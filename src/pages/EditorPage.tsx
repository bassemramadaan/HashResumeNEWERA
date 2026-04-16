import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowRight,
  FileText,
  Sparkles,
  Loader2,
  ArrowUp,
  Settings,
} from "lucide-react";
import { useResumeStore } from "../store/useResumeStore";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";
import Stepper from "../components/editor/Stepper";
import Logo from "../components/Logo";
import LanguageSwitcher from "../components/LanguageSwitcher";
import AuthButton from "../components/AuthButton";
import SettingsModal from "../components/SettingsModal";
import { cn } from "../utils";
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
    <Loader2 className="w-10 h-10 text-[#ff4d2d] animate-spin" />
    <p className="text-white0 font-medium">Loading section...</p>
  </div>
);

type Tab =
  | "basics"
  | "experience"
  | "education"
  | "skills"
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
            <span>
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
      className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200 group"
    >
      <div className="flex flex-col items-start">
        <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-0.5">
          {language === "ar" ? "النتيجة" : "Score"}
        </span>
        <span
          className={cn(
            "text-xs sm:text-sm font-black leading-none",
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
      <div className="w-6 sm:w-12 h-1.5 sm:h-2 bg-slate-200 rounded-full overflow-hidden">
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
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "load" | "clear";
    message: string;
  } | null>(null);
  const [previewMode, setPreviewMode] = useState<"resume" | "cover-letter">(
    "resume",
  );
  const fullName = useResumeStore((state) => state.data.personalInfo.fullName);
  const isPremium = useResumeStore((state) => state.data.isPremium);
  const loadExampleData = useResumeStore((state) => state.loadExampleData);
  const resetData = useResumeStore((state) => state.resetData);
  const { hasSeenOnboarding, startOnboarding, skipOnboarding } =
    useOnboardingStore();

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

  const handleProceedToExport = (format: "pdf" | "docx" | "txt" = "pdf") => {
    setShowResumeChecker(false);
    if (isPremium) {
      if (format === "pdf") {
        handlePrint();
      } else if (format === "docx") {
        generateWord(useResumeStore.getState().data);
      } else if (format === "txt") {
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
      }
    } else {
      setShowPaymentModal(true);
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
      id: "cover-letter",
      label: t.coverLetter.title,
      shortLabel: language === "ar" ? "الخطاب" : "Cover",
      icon: FileText,
      tourId: "cover-letter-section",
    },
    {
      id: "finish",
      label: t.review,
      shortLabel: language === "ar" ? "مراجعة" : "Review",
      icon: Target,
      tourId: "review-section",
    },
  ];

  const activeTabIndex = tabs.findIndex((t) => t.id === activeTab) + 1;

  const tabDescriptions: Record<Tab, string> = {
    basics: t.basicsDesc,
    experience: t.experienceDesc,
    education: t.educationDesc,
    skills: t.skillsDesc,
    "cover-letter": t.coverLetterDesc,
    finish: t.finishDesc,
  };

  return (
    <div
      className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans transition-colors duration-200"
      dir={dir}
    >
      <Helmet>
        <title>{t.editor?.title || "Resume Editor"} | Hash Resume</title>
        <meta name="description" content="Build your professional resume with our AI-powered editor." />
      </Helmet>
      <OnboardingTour />

      {/* Floating Dock Navbar (Top) */}
      <div className="fixed top-4 start-1/2 -translate-x-1/2 flex justify-center z-50 px-4 pointer-events-none w-full max-w-5xl">
        <nav className="pointer-events-auto flex items-center gap-2 p-2 rounded-full bg-slate-50/80 backdrop-blur-xl border border-slate-200/20 shadow-2xl transition-all duration-300 hover:scale-[1.01] w-full justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            {/* Home / Logo */}
            <Link
              to="/"
              className="flex items-center justify-center w-10 h-10 bg-slate-50 rounded-full shadow-sm text-[#ff4d2d] hover:scale-105 transition-transform shrink-0"
              title={t.backToHome}
            >
              <Logo className="w-6 h-6" />
            </Link>

            {/* Separator */}
            <div className="w-px h-6 bg-slate-200 mx-0.5 hidden sm:block"></div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => undo()}
                disabled={pastStates.length === 0}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-50/50 disabled:opacity-30 transition-colors"
                title={t.undo}
              >
                <Undo2 size={16} />
              </button>
              <button
                onClick={() => redo()}
                disabled={futureStates.length === 0}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-50/50 disabled:opacity-30 transition-colors"
                title={t.redo}
              >
                <Redo2 size={16} />
              </button>
            </div>
          </div>

          {/* Center Section: Saving & ATS */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center">
            {/* Saving Indicator */}
            <div className="hidden sm:block">
              <AutoSaveIndicator />
            </div>

            {/* ATS Score */}
            <ATSScoreIndicator setActiveTab={setActiveTab} />
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <AuthButton />
              <button
                onClick={() => setShowWelcomeModal(true)}
                className="p-2 rounded-full text-[#ff4d2d] bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-200"
                title={t.showMeAround}
              >
                <Sparkles size={16} className="animate-pulse" />
              </button>
              <LanguageSwitcher className="[&>span]:hidden lg:[&>span]:inline" />
            </div>

            <button
              onClick={handleExportClick}
              data-tour="export-button"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff4d2d] hover:bg-[#e63e1d] text-white transition-all shadow-md hover:shadow-lg active:scale-95 font-bold text-xs"
            >
              <Download size={14} />
              <span className="hidden sm:inline">{t.exportPdf}</span>
            </button>

            {/* Mobile Preview Toggle */}
            <button
              onClick={() => setShowMobilePreview(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 text-slate-600 hover:bg-slate-50/50 rounded-full transition-colors"
            >
              <Eye size={18} />
            </button>

            {/* Full Preview (Desktop) */}
            <button
              onClick={() => setShowFullPreview(true)}
              className="hidden lg:flex items-center justify-center w-10 h-10 text-slate-600 hover:bg-slate-50/50 rounded-full transition-colors"
              title={t.fullPreview}
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </nav>
      </div>

      {/* Spacer for fixed dock */}
      <div className="h-20 shrink-0" />

      <div className="flex-1 flex overflow-hidden relative editor-form">
        {/* Editor Area */}
        <div
          className={cn(
            "flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 bg-slate-50",
            showMobilePreview ? "hidden md:flex" : "flex",
          )}
        >
          {/* Stepper Integration */}
          <div className="bg-slate-50/50 border-b border-slate-200 pt-4 pb-2">
            <Stepper
              tabs={tabs.map((t) => ({ id: t.id, label: t.label }))}
              activeTab={activeTab}
              onTabChange={(id) => setActiveTab(id as Tab)}
            />
          </div>

          <div className="flex flex-col items-center text-center px-6 pt-6 pb-4 shrink-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-100 shadow-sm flex items-center justify-center text-slate-500 text-sm font-bold mb-4 border border-slate-200">
                {activeTabIndex}
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight capitalize">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h1>
              <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
                {tabDescriptions[activeTab]}
              </p>
            </motion.div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() =>
                  setConfirmAction({
                    type: "load",
                    message: t.overwriteConfirm,
                  })
                }
                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-6 py-2 rounded-full transition-all border border-indigo-100 shadow-sm"
              >
                {t.loadExample}
              </button>
              <button
                onClick={() =>
                  setConfirmAction({ type: "clear", message: t.clearConfirm })
                }
                className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-700 px-6 py-2 rounded-full hover:bg-rose-50 transition-all"
              >
                {t.clearAll}
              </button>
            </div>
          </div>

          <main
            ref={formRef}
            onScroll={handleFormScroll}
            className="flex-1 overflow-y-auto p-6 pt-4 scroll-smooth relative"
          >
            <div className="max-w-4xl mx-auto pb-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Suspense fallback={<FormLoader />}>
                    {/* ... existing conditions ... */}
                    {activeTab === "basics" && (
                      <div className="space-y-12">
                        <section>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <User size={18} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                              {t.personalInfo}
                            </h2>
                          </div>
                          <PersonalInfoForm />
                        </section>
                      </div>
                    )}
                    {activeTab === "experience" && (
                      <div className="space-y-12">
                        <section>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <Briefcase size={18} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                              {t.experience.title}
                            </h2>
                          </div>
                          <ExperienceForm />
                        </section>
                        <section className="pt-12 border-t border-slate-100">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                              <Target size={18} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                              {t.projects.title}
                            </h2>
                          </div>
                          <ProjectsForm />
                        </section>
                      </div>
                    )}
                    {activeTab === "education" && (
                      <div className="space-y-12">
                        <section>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <GraduationCap size={18} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                              {t.education.title}
                            </h2>
                          </div>
                          <EducationForm />
                        </section>
                        <section className="pt-12 border-t border-slate-100">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                              <CheckCircle2 size={18} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                              {t.certifications.title}
                            </h2>
                          </div>
                          <CertificationsForm />
                        </section>
                      </div>
                    )}
                    {activeTab === "skills" && (
                      <section>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Wrench size={18} />
                          </div>
                          <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            {t.skills.title}
                          </h2>
                        </div>
                        <SkillsForm />
                      </section>
                    )}
                    {activeTab === "cover-letter" && (
                      <section>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <FileText size={18} />
                          </div>
                          <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            {t.coverLetter.title}
                          </h2>
                        </div>
                        <CoverLetterForm />
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
                    className="md:hidden fixed bottom-24 end-6 w-10 h-10 bg-slate-50 text-slate-900 rounded-full shadow-xl border border-slate-200 flex items-center justify-center z-40 active:scale-90 transition-transform"
                  >
                    <ArrowUp size={20} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* Preview Area */}
        <div
          data-tour="preview-pane"
          className={cn(
            "bg-slate-100 border-s border-slate-200 flex-col h-full overflow-hidden relative transition-colors duration-200",
            showMobilePreview
              ? "flex w-full absolute inset-0 z-50 bg-slate-50"
              : "hidden md:flex md:w-[45%] lg:w-[50%]",
          )}
        >
          <div className="h-14 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-6 shrink-0 absolute top-0 start-0 end-0 z-10 transition-colors duration-200">
            <div className="flex items-center gap-2">
              {showMobilePreview && (
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="me-2 p-2 -ms-2 hover:bg-slate-100 rounded-lg md:hidden text-slate-700"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
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

          <div className="flex-1 overflow-y-auto p-4 md:p-12 pt-24 flex justify-center items-start bg-slate-100/50">
            <div
              className={cn(
                "w-full max-w-[210mm] bg-slate-50 shadow-2xl rounded-sm overflow-hidden origin-top transition-all duration-500 ring-1 ring-slate-900/5",
                previewMode !== "cover-letter" &&
                  "scale-[0.85] sm:scale-95 md:scale-100",
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

      {/* Floating Compact Navbar (Bottom) */}
      <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-40 inline-flex items-center bg-slate-50/90 backdrop-blur-2xl rounded-full border border-white/20 shadow-2xl transition-all duration-300 mb-safe p-2">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-tour={tab.tourId}
                className={cn(
                  "relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-500 group",
                  isActive
                    ? "bg-zinc-900 text-white shadow-xl scale-110 z-10"
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-100",
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -top-10 px-4 py-2 bg-zinc-900 text-slate-50 text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl pointer-events-none whitespace-nowrap"
                    >
                      {tab.shortLabel}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}

          {/* Separator */}
          <div className="w-px h-8 bg-slate-200 mx-1"></div>

          {/* Start / Export Button */}
          <button
            onClick={handleExportClick}
            className="flex items-center gap-2 bg-[#ff4d2d] hover:bg-[#e63e1d] text-white font-black py-2 px-4 sm:px-6 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all group shrink-0"
          >
            <span className="text-[10px] uppercase tracking-widest">
              <span className="hidden sm:inline">{t.exportPdf}</span>
              <span className="sm:hidden">{language === "ar" ? "تصدير" : "Export"}</span>
            </span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
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
