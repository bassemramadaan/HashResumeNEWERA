import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useStore } from 'zustand';
import { 
  User, Briefcase, GraduationCap, Wrench, FolderGit2, Award, 
  Settings, Download, ChevronLeft, Eye, LayoutTemplate, Target,
  Undo2, Redo2, CheckCircle2, Maximize2, X, MessageCircle, ArrowRight, FileText, CheckCircle, Sparkles
} from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { useOnboardingStore } from '../store/useOnboardingStore';
import Stepper from '../components/editor/Stepper';
import PersonalInfoForm from '../components/editor/PersonalInfoForm';
import ExperienceForm from '../components/editor/ExperienceForm';
import EducationForm from '../components/editor/EducationForm';
import SkillsForm from '../components/editor/SkillsForm';
import ProjectsForm from '../components/editor/ProjectsForm';
import CertificationsForm from '../components/editor/CertificationsForm';
import SettingsForm from '../components/editor/SettingsForm';
import ATSAudit from '../components/editor/ATSAudit';
import CoverLetterForm from '../components/editor/CoverLetterForm';
import FinishStep from '../components/editor/FinishStep';
import ResumePreview from '../components/preview/ResumePreview';
import CoverLetterPreview from '../components/preview/CoverLetterPreview';
import Logo from '../components/Logo';
import PaymentModal from '../components/payment/PaymentModal';
import PostDownloadModal from '../components/payment/PostDownloadModal';
import FeedbackModal from '../components/FeedbackModal';
import OnboardingTour from '../components/OnboardingTour';
import WelcomeModal from '../components/editor/WelcomeModal';
import ResumeCheckerModal from '../components/editor/ResumeCheckerModal';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { cn } from '../lib/utils';
import { calculateATSScore } from '../lib/ats';

type Tab = 'basics' | 'experience' | 'education' | 'skills' | 'cover-letter' | 'finish';

interface TabItem {
  id: Tab;
  label: string;
  icon: React.ElementType;
  tourId?: string;
}

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<Tab>('basics');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPostDownloadModal, setShowPostDownloadModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showResumeChecker, setShowResumeChecker] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'resume' | 'cover-letter'>('resume');
  const { data, loadExampleData, resetData } = useResumeStore();
  const { hasSeenOnboarding, startOnboarding, skipOnboarding } = useOnboardingStore();
  
  // Zundo hooks for undo/redo
  const { undo, redo, pastStates, futureStates } = useStore(useResumeStore.temporal);

  // Show welcome modal if not seen
  /* useEffect(() => {
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setShowWelcomeModal(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenOnboarding]); */

  const handleStartTour = () => {
    setShowWelcomeModal(false);
    startOnboarding();
  };

  const handleSkipTour = () => {
    setShowWelcomeModal(false);
    skipOnboarding();
  };

  // Auto-save indicator effect
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => setIsSaving(false), 800);
    return () => clearTimeout(timer);
  }, [data]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (futureStates.length > 0) redo();
        } else {
          if (pastStates.length > 0) undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (futureStates.length > 0) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, pastStates.length, futureStates.length]);
  
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.personalInfo.fullName || 'Resume'}_CV`,
    onAfterPrint: () => {
      setShowPostDownloadModal(true);
      setTimeout(() => setShowFeedbackModal(true), 2000);
    },
  });

  const handleExportClick = () => {
    setShowResumeChecker(true);
  };

  const handleProceedToExport = () => {
    setShowResumeChecker(false);
    if (data.isPremium) {
      handlePrint();
    } else {
      setShowPaymentModal(true);
    }
  };

  const tabs: TabItem[] = [
    { id: 'basics', label: 'Profile', icon: User, tourId: 'personal-info' },
    { id: 'experience', label: 'Experience', icon: Briefcase, tourId: 'experience-section' },
    { id: 'education', label: 'Education', icon: GraduationCap, tourId: 'education-section' },
    { id: 'skills', label: 'Skills', icon: Wrench, tourId: 'skills-section' },
    { id: 'cover-letter', label: 'Cover Letter', icon: FileText, tourId: 'cover-letter-section' },
    { id: 'finish', label: 'Review', icon: Target, tourId: 'review-section' },
  ];

  const atsScore = calculateATSScore(data).score;
  const activeTabIndex = tabs.findIndex(t => t.id === activeTab) + 1;
  const progressPercentage = (activeTabIndex / tabs.length) * 100;

  const tabDescriptions: Record<Tab, string> = {
    basics: 'Your basic information and resume settings.',
    experience: 'Your professional work history and projects.',
    education: 'Your academic background and certifications.',
    skills: 'Your technical and soft skills.',
    'cover-letter': 'Generate a professional cover letter.',
    finish: 'Optimize for ATS and download your resume.',
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans transition-colors duration-200">
      <Helmet>
        <title>Resume Editor - Hash Resume</title>
        <meta name="description" content="Build your professional resume with our easy-to-use editor. Real-time preview and ATS optimization." />
        <link rel="canonical" href="https://hashresume.com/editor" />
      </Helmet>
      <OnboardingTour />
      
      {/* Floating Dock Navbar (Top) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 flex justify-center z-50 px-4 pointer-events-none">
        <nav className="pointer-events-auto inline-flex items-center gap-2 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/40 dark:border-slate-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01]">
          
          {/* Home / Logo */}
          <Link to="/" className="flex items-center justify-center w-9 h-9 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#f16529] hover:scale-105 transition-transform shrink-0" title="Back to Home">
            <Logo className="w-5 h-5" />
          </Link>

          {/* Separator */}
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block"></div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5">
            <button onClick={() => undo()} disabled={pastStates.length === 0} className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 disabled:opacity-30 transition-colors" title="Undo (Ctrl+Z)">
              <Undo2 size={16} />
            </button>
            <button onClick={() => redo()} disabled={futureStates.length === 0} className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 disabled:opacity-30 transition-colors" title="Redo (Ctrl+Y)">
              <Redo2 size={16} />
            </button>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block"></div>

          {/* Theme/Lang/Feedback */}
          <div className="flex items-center gap-0.5">
            <button onClick={() => setShowWelcomeModal(true)} className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-[#f16529] dark:hover:text-orange-400 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors" title="Show me around">
              <Sparkles size={16} />
            </button>
            <LanguageSwitcher className="[&>span]:hidden sm:[&>span]:inline" />
            <button onClick={() => setShowFeedbackModal(true)} className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-[#f16529] dark:hover:text-orange-400 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors" title="Feedback">
              <MessageCircle size={16} />
            </button>
          </div>

          {/* Saving Indicator */}
          <div className="hidden lg:flex items-center px-2 min-w-[70px] justify-center">
            <AnimatePresence mode="wait">
              {isSaving ? (
                <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <div className="w-1.5 h-1.5 border border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                  Saving
                </motion.div>
              ) : (
                <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 size={10} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Saved</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ATS Score */}
          <button onClick={() => setActiveTab('finish')} className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">ATS</span>
            <span className={cn("text-xs font-black", atsScore >= 80 ? "text-emerald-600 dark:text-emerald-400" : atsScore >= 50 ? "text-amber-500" : "text-rose-500")}>
              {atsScore}%
            </span>
          </button>

          {/* Export Buttons (Topbar) */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button 
              onClick={handleExportClick}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f16529] hover:bg-[#e44d26] text-white transition-all shadow-md hover:shadow-lg active:scale-95 font-bold text-xs"
            >
              <Download size={14} />
              Export PDF
            </button>
          </div>

          {/* Preview (Desktop) */}
          <button onClick={() => setShowFullPreview(true)} className="hidden lg:flex items-center justify-center w-9 h-9 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-colors" title="Full Preview">
            <Maximize2 size={18} />
          </button>

          {/* Mobile Preview Toggle */}
           <button onClick={() => setShowMobilePreview(true)} className="md:hidden flex items-center justify-center w-9 h-9 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-colors">
            <Eye size={18} />
          </button>
        </nav>
      </div>

      {/* Spacer for fixed dock */}
      <div className="h-24 shrink-0" />

      {/* Floating Compact Navbar (Bottom) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 inline-flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-full border border-white/40 dark:border-slate-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 mb-safe">
        
        <div className="flex items-center gap-0.5 px-1.5 py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-tour={tab.tourId}
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shrink-0",
                  isActive 
                    ? "bg-black text-white shadow-lg" 
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="sr-only">{tab.label}</span>
              </button>
            );
          })}

          {/* Separator */}
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

          {/* Start / Export Button */}
          <button 
            onClick={handleExportClick}
            className="flex items-center gap-2 bg-[#f16529] hover:bg-[#e44d26] text-white font-bold py-1.5 px-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all group shrink-0"
          >
            <span className="text-xs tracking-tight">Export</span>
            <ArrowRight size={16} className="text-white" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden relative editor-form">
        {/* Editor Area */}
        <div className={cn(
          "flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 bg-slate-50/50 dark:bg-slate-900/50",
          showMobilePreview ? "hidden md:flex" : "flex"
        )}>
          <div className="flex flex-col items-center text-center px-6 pt-12 pb-8 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 font-medium mb-6 border border-slate-100 dark:border-slate-700">
              {activeTabIndex}
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium max-w-xs leading-relaxed">
              {tabDescriptions[activeTab]}
            </p>
            
            <div className="flex items-center gap-3 mt-8">
              <button 
                onClick={() => {
                  if (window.confirm('This will overwrite your current data with example data. Are you sure?')) {
                    loadExampleData();
                  }
                }} 
                className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-4 py-2 rounded-full transition-all border border-indigo-100 dark:border-indigo-800/50 shadow-sm"
              >
                Load Example
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('This will clear all your data. This action cannot be undone. Are you sure?')) {
                    resetData();
                  }
                }} 
                className="text-xs font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-4 py-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all"
              >
                Clear All
              </button>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto p-6 pt-2">
            <div className="max-w-3xl mx-auto pb-20">
              {activeTab === 'basics' && (
                <div className="space-y-12">
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Personal Information</h2>
                    <PersonalInfoForm />
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Resume Settings</h2>
                    <SettingsForm />
                  </div>
                </div>
              )}
              {activeTab === 'experience' && (
                <div className="space-y-12">
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Work Experience</h2>
                    <ExperienceForm />
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Projects</h2>
                    <ProjectsForm />
                  </div>
                </div>
              )}
              {activeTab === 'education' && (
                <div className="space-y-12">
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Education</h2>
                    <EducationForm />
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Certifications</h2>
                    <CertificationsForm />
                  </div>
                </div>
              )}
              {activeTab === 'skills' && (
                <div className="space-y-12">
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Skills</h2>
                    <SkillsForm />
                  </div>
                </div>
              )}
              {activeTab === 'cover-letter' && (
                <div className="space-y-12">
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Cover Letter</h2>
                    <CoverLetterForm />
                  </div>
                </div>
              )}
              {activeTab === 'finish' && (
                <div className="space-y-12">
                  <ATSAudit />
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
                    <FinishStep onPrint={handleProceedToExport} />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Preview Area */}
        <div 
          data-tour="preview-pane"
          className={cn(
            "bg-slate-200/50 dark:bg-slate-900/80 border-l border-slate-200 dark:border-slate-700 flex-col h-full overflow-hidden relative transition-colors duration-200",
            showMobilePreview ? "flex w-full absolute inset-0 z-50 bg-slate-100 dark:bg-slate-900" : "hidden md:flex md:w-[45%] lg:w-[50%]"
          )}
        >
          <div className="h-14 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0 absolute top-0 left-0 right-0 z-10 transition-colors duration-200">
            <div className="flex items-center gap-2">
              {showMobilePreview && (
                <button onClick={() => setShowMobilePreview(false)} className="mr-2 p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg md:hidden text-slate-700 dark:text-slate-300">
                  <ChevronLeft size={20} />
                </button>
              )}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('resume')}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    previewMode === 'resume' 
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  )}
                >
                  <LayoutTemplate size={16} />
                  Resume
                </button>
                <button
                  onClick={() => setPreviewMode('cover-letter')}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    previewMode === 'cover-letter' 
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  )}
                >
                  <FileText size={16} />
                  Cover Letter
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 flex justify-center items-start">
            <div className={cn(
              "w-full max-w-[210mm] bg-white shadow-xl dark:shadow-indigo-900/20 rounded-sm overflow-hidden origin-top transition-transform ring-1 ring-slate-900/5 dark:ring-slate-100/10",
              previewMode !== 'cover-letter' && "scale-[0.85] sm:scale-95 md:scale-100"
            )}>
              {previewMode === 'cover-letter' ? (
                <CoverLetterPreview />
              ) : (
                <ResumePreview ref={componentRef} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Full Page Preview Modal */}
      <AnimatePresence>
        {showFullPreview && (
          <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center"
            >
              <div className="w-full max-w-5xl flex justify-between items-center mb-6 shrink-0">
                <h2 className="text-white text-xl font-bold">Resume Preview</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleExportClick}
                    className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white px-5 py-2 rounded-full flex items-center gap-2 font-bold transition-all text-sm shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95"
                  >
                    <Download size={16} />
                    Export PDF
                  </button>
                  <button 
                    onClick={() => setShowFullPreview(false)}
                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="w-full max-w-[210mm] bg-white shadow-2xl rounded-sm overflow-hidden shrink-0 mb-12">
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
    </div>
  );
}
