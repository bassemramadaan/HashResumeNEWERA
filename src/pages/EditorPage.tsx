import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from 'zustand';
import { 
  User, Briefcase, GraduationCap, Wrench, FolderGit2, Award, 
  Settings, Download, ChevronLeft, Eye, LayoutTemplate, Target,
  Undo2, Redo2, CheckCircle2, Maximize2, X, Moon, Sun
} from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { useThemeStore } from '../store/useThemeStore';
import { useOnboardingStore } from '../store/useOnboardingStore';
import PersonalInfoForm from '../components/editor/PersonalInfoForm';
import ExperienceForm from '../components/editor/ExperienceForm';
import EducationForm from '../components/editor/EducationForm';
import SkillsForm from '../components/editor/SkillsForm';
import ProjectsForm from '../components/editor/ProjectsForm';
import CertificationsForm from '../components/editor/CertificationsForm';
import SettingsForm from '../components/editor/SettingsForm';
import ATSAudit from '../components/editor/ATSAudit';
import ResumePreview from '../components/preview/ResumePreview';
import Logo from '../components/Logo';
import PaymentModal from '../components/payment/PaymentModal';
import PostDownloadModal from '../components/payment/PostDownloadModal';
import OnboardingTour from '../components/OnboardingTour';
import ResumeCheckerModal from '../components/editor/ResumeCheckerModal';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { cn } from '../lib/utils';

type Tab = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'ats-audit' | 'settings';

interface TabItem {
  id: Tab;
  label: string;
  icon: React.ElementType;
  tourId?: string;
}

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPostDownloadModal, setShowPostDownloadModal] = useState(false);
  const [showResumeChecker, setShowResumeChecker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { data, loadExampleData, resetData } = useResumeStore();
  const { theme, toggleTheme } = useThemeStore();
  const { hasSeenOnboarding, startOnboarding } = useOnboardingStore();
  
  // Zundo hooks for undo/redo
  const { undo, redo, pastStates, futureStates } = useStore(useResumeStore.temporal);

  // Start onboarding if not seen
  useEffect(() => {
    if (!hasSeenOnboarding) {
      // Small delay to ensure UI is rendered
      const timer = setTimeout(() => startOnboarding(), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenOnboarding, startOnboarding]);

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
    onAfterPrint: () => setShowPostDownloadModal(true),
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
    { id: 'personal', label: 'Personal', icon: User, tourId: 'personal-info' },
    { id: 'experience', label: 'Experience', icon: Briefcase, tourId: 'experience-section' },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Wrench, tourId: 'skills-section' },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'ats-audit', label: 'ATS Audit', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const calculateATSScore = () => {
    // Return 0 if completely empty
    const isEmpty = !data.personalInfo.fullName && !data.personalInfo.email && data.experience.length === 0 && data.education.length === 0 && data.skills.length === 0;
    if (isEmpty) return 0;

    let score = 0;
    if (data.personalInfo.fullName) score += 5;
    if (data.personalInfo.email && data.personalInfo.phone) score += 10;
    if (data.personalInfo.linkedin) score += 5;
    if (data.personalInfo.summary && data.personalInfo.summary.length > 50) score += 10;
    else if (data.personalInfo.summary) score += 5;

    if (data.experience.length > 0) {
      score += 20;
      let hasBulletPoints = false;
      let hasGoodLength = true;
      data.experience.forEach(exp => {
        if (exp.description.includes('•') || exp.description.includes('-')) hasBulletPoints = true;
        if (exp.description.length < 50) hasGoodLength = false;
      });
      if (hasBulletPoints) score += 10;
      if (hasGoodLength) score += 10;
    }

    if (data.education.length > 0) score += 15;
    if (data.skills.length >= 5) score += 15;
    else if (data.skills.length > 0) score += 5;

    return Math.min(100, score);
  };

  const atsScore = calculateATSScore();

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans transition-colors duration-200">
      <OnboardingTour />
      
      {/* Top Navbar */}
      <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 relative transition-colors duration-200">
        {/* Left Actions */}
        <div className="flex items-center justify-start w-1/3">
          <Link to="/" className="flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ChevronLeft size={20} />
            <span className="hidden sm:block ml-1 text-sm font-medium">Home</span>
          </Link>
        </div>

        {/* Centered Logo */}
        <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="flex items-center text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <Logo className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 w-1/3">
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <AnimatePresence mode="wait">
              {isSaving ? (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-400"
                >
                  <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                  Saving...
                </motion.div>
              ) : (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-500"
                >
                  <CheckCircle2 size={14} />
                  Saved
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
            <LanguageSwitcher className="hover:bg-white dark:hover:bg-slate-700" />
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
            <button
              onClick={() => undo()}
              disabled={pastStates.length === 0}
              className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={() => redo()}
              disabled={futureStates.length === 0}
              className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={16} />
            </button>
          </div>

          <button 
            onClick={() => setActiveTab('ats-audit')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ATS</span>
            <span className={cn("text-sm font-black", atsScore >= 80 ? "text-emerald-500" : atsScore >= 50 ? "text-amber-500" : "text-rose-500")}>
              {atsScore}%
            </span>
          </button>
          <button 
            onClick={() => setShowFullPreview(true)}
            className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-full font-medium transition-colors text-sm border border-slate-200 dark:border-slate-700"
            title="Full Page Preview"
          >
            <Maximize2 size={16} />
            <span className="hidden xl:block">Preview</span>
          </button>
          <button 
            onClick={handleExportClick}
            data-tour="export-button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full flex items-center gap-2 font-medium transition-colors text-sm shadow-md shadow-indigo-600/20"
          >
            <Download size={16} />
            <span className="hidden sm:block">Export</span>
          </button>
          <button 
            onClick={() => setShowMobilePreview(true)}
            className="md:hidden flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            <Eye size={16} />
          </button>
        </div>
      </header>

      {/* Floating Compact Navbar (Bottom) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-indigo-900/10 transition-colors duration-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-tour={tab.tourId}
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-full transition-colors group",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBottom"
                  className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-full shadow-sm border border-indigo-100/50 dark:border-indigo-800/50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">
                <Icon size={18} className={isActive ? "text-indigo-600 dark:text-indigo-400" : ""} />
              </span>
              
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                {tab.label}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile/Tablet Tabs Scrollable Row */}
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-hide shrink-0 transition-colors duration-200">
        <div className="flex p-2 gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-tour={tab.tourId}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent"
                )}
              >
                <Icon size={16} className={isActive ? "text-indigo-600 dark:text-indigo-400" : ""} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden relative editor-form">
        {/* Editor Area */}
        <div className={cn(
          "flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 bg-slate-50/50 dark:bg-slate-900/50",
          showMobilePreview ? "hidden md:flex" : "flex"
        )}>
          <div className="h-14 bg-transparent flex items-center justify-between px-6 shrink-0 mt-2">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <div className="flex items-center gap-3">
              <button onClick={loadExampleData} className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Load Example
              </button>
              <button onClick={resetData} className="text-xs font-medium text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-3 py-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors">
                Clear All
              </button>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto p-6 pt-2">
            <div className="max-w-3xl mx-auto pb-20">
              {activeTab === 'personal' && <PersonalInfoForm />}
              {activeTab === 'experience' && <ExperienceForm />}
              {activeTab === 'education' && <EducationForm />}
              {activeTab === 'skills' && <SkillsForm />}
              {activeTab === 'projects' && <ProjectsForm />}
              {activeTab === 'certifications' && <CertificationsForm />}
              {activeTab === 'ats-audit' && <ATSAudit />}
              {activeTab === 'settings' && <SettingsForm />}
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
              <LayoutTemplate size={18} className="text-slate-400 dark:text-slate-500" />
              <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Live Preview</h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 flex justify-center items-start">
            <div className="w-full max-w-[210mm] bg-white shadow-xl rounded-sm overflow-hidden scale-[0.85] sm:scale-95 md:scale-100 origin-top transition-transform">
              <ResumePreview ref={componentRef} />
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full flex items-center gap-2 font-medium transition-colors text-sm shadow-md"
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
    </div>
  );
}
