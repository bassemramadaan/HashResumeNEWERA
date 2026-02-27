import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { motion } from 'motion/react';
import { 
  User, Briefcase, GraduationCap, Wrench, FolderGit2, Award, 
  Settings, Download, ChevronLeft, Eye, LayoutTemplate, Target
} from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
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
import { cn } from '../lib/utils';

type Tab = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'ats-audit' | 'settings';

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const { data, loadExampleData, resetData } = useResumeStore();
  
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.personalInfo.fullName || 'Resume'}_CV`,
  });

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'ats-audit', label: 'ATS Audit', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const calculateATSScore = () => {
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
    <div className="flex flex-col h-screen bg-zinc-50 overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="h-20 bg-white border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 relative">
        {/* Logo */}
        <div className="flex items-center gap-4 w-1/4">
          <Link to="/" className="flex items-center gap-2 text-zinc-900 hover:text-indigo-600 transition-colors">
            <Logo className="w-8 h-8 text-indigo-600 shrink-0" />
            <span className="font-bold text-lg hidden xl:block tracking-tight">Hash Resume</span>
          </Link>
        </div>

        {/* Centered Tabs (Floating Pill) */}
        <nav className="hidden lg:flex items-center bg-zinc-100/80 backdrop-blur-md p-1.5 rounded-full border border-zinc-200/50 shadow-sm absolute left-1/2 -translate-x-1/2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive ? "text-indigo-700" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50"
                )}
                title={tab.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-full shadow-sm border border-zinc-200/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={16} className={isActive ? "text-indigo-600" : ""} />
                  <span className="hidden xl:block">{tab.label}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-3 w-1/4">
          <button 
            onClick={() => setActiveTab('ats-audit')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors border border-zinc-200"
          >
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">ATS</span>
            <span className={cn("text-sm font-black", atsScore >= 80 ? "text-emerald-500" : atsScore >= 50 ? "text-amber-500" : "text-rose-500")}>
              {atsScore}%
            </span>
          </button>
          <button 
            onClick={() => handlePrint()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-medium transition-colors text-sm shadow-md shadow-indigo-600/20"
          >
            <Download size={16} />
            <span className="hidden sm:block">Export</span>
          </button>
          <button 
            onClick={() => setShowMobilePreview(true)}
            className="md:hidden flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            <Eye size={16} />
          </button>
        </div>
      </header>

      {/* Mobile/Tablet Tabs Scrollable Row */}
      <div className="lg:hidden bg-white border-b border-zinc-200 overflow-x-auto scrollbar-hide shrink-0">
        <div className="flex p-2 gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "text-zinc-500 hover:bg-zinc-100 border border-transparent"
                )}
              >
                <Icon size={16} className={isActive ? "text-indigo-600" : ""} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Editor Area */}
        <div className={cn(
          "flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 bg-zinc-50/50",
          showMobilePreview ? "hidden md:flex" : "flex"
        )}>
          <div className="h-14 bg-transparent flex items-center justify-between px-6 shrink-0 mt-2">
            <h1 className="text-xl font-bold text-zinc-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <div className="flex items-center gap-3">
              <button onClick={loadExampleData} className="text-xs font-medium text-zinc-500 hover:text-zinc-800 px-3 py-1.5 rounded-full hover:bg-zinc-200 transition-colors">
                Load Example
              </button>
              <button onClick={resetData} className="text-xs font-medium text-rose-500 hover:text-rose-700 px-3 py-1.5 rounded-full hover:bg-rose-50 transition-colors">
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
        <div className={cn(
          "bg-zinc-200/50 border-l border-zinc-200 flex-col h-full overflow-hidden relative",
          showMobilePreview ? "flex w-full absolute inset-0 z-50 bg-zinc-100" : "hidden md:flex md:w-[45%] lg:w-[50%]"
        )}>
          <div className="h-14 bg-white/80 backdrop-blur-sm border-b border-zinc-200 flex items-center justify-between px-6 shrink-0 absolute top-0 left-0 right-0 z-10">
            <div className="flex items-center gap-2">
              {showMobilePreview && (
                <button onClick={() => setShowMobilePreview(false)} className="mr-2 p-2 -ml-2 hover:bg-zinc-100 rounded-lg md:hidden">
                  <ChevronLeft size={20} />
                </button>
              )}
              <LayoutTemplate size={18} className="text-zinc-400" />
              <h2 className="font-semibold text-zinc-700 text-sm">Live Preview</h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 flex justify-center items-start">
            <div className="w-full max-w-[210mm] bg-white shadow-xl rounded-sm overflow-hidden scale-[0.85] sm:scale-95 md:scale-100 origin-top transition-transform">
              <ResumePreview ref={componentRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
