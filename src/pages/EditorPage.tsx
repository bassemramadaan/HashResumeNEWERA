import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { 
  User, Briefcase, GraduationCap, Wrench, FolderGit2, Award, 
  Settings, Download, ChevronLeft, Eye, LayoutTemplate, Moon, Sun
} from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import PersonalInfoForm from '../components/editor/PersonalInfoForm';
import ExperienceForm from '../components/editor/ExperienceForm';
import EducationForm from '../components/editor/EducationForm';
import SkillsForm from '../components/editor/SkillsForm';
import ProjectsForm from '../components/editor/ProjectsForm';
import CertificationsForm from '../components/editor/CertificationsForm';
import SettingsForm from '../components/editor/SettingsForm';
import ResumePreview from '../components/preview/ResumePreview';
import Logo from '../components/Logo';
import { cn } from '../lib/utils';

type Tab = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'settings';

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
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  // Simple ATS Score calculation mock
  const calculateATSScore = () => {
    let score = 0;
    if (data.personalInfo.fullName) score += 10;
    if (data.personalInfo.email) score += 10;
    if (data.personalInfo.phone) score += 10;
    if (data.personalInfo.summary) score += 15;
    if (data.experience.length > 0) score += 25;
    if (data.education.length > 0) score += 15;
    if (data.skills.length > 0) score += 15;
    return Math.min(100, score);
  };

  const atsScore = calculateATSScore();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <div className="w-20 lg:w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 z-20">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-green-400 transition-colors">
            <Logo className="w-8 h-8 text-green-500 shrink-0" />
            <span className="font-bold text-lg hidden lg:block tracking-tight">Hash Resume</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all w-full text-left",
                  activeTab === tab.id 
                    ? "bg-green-500/10 text-green-400 font-medium" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
                title={tab.label}
              >
                <Icon size={20} className={cn("shrink-0", activeTab === tab.id ? "text-green-400" : "text-slate-400")} />
                <span className="hidden lg:block text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="hidden lg:block mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-400">ATS Score</span>
              <span className={cn("font-bold", atsScore > 70 ? "text-green-400" : atsScore > 40 ? "text-yellow-400" : "text-red-400")}>
                {atsScore}%
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-500", atsScore > 70 ? "bg-green-500" : atsScore > 40 ? "bg-yellow-500" : "bg-red-500")}
                style={{ width: `${atsScore}%` }}
              />
            </div>
          </div>
          <button 
            onClick={() => handlePrint()}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors text-sm"
          >
            <Download size={18} />
            <span className="hidden lg:block">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className={cn(
        "flex-1 flex flex-col h-full overflow-hidden transition-all duration-300",
        showMobilePreview ? "hidden md:flex" : "flex"
      )}>
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-xl font-bold text-slate-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={loadExampleData} className="text-sm font-medium text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              Load Example
            </button>
            <button onClick={resetData} className="text-sm font-medium text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              Clear All
            </button>
            <button 
              onClick={() => setShowMobilePreview(true)}
              className="md:hidden flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <Eye size={16} /> Preview
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            {activeTab === 'personal' && <PersonalInfoForm />}
            {activeTab === 'experience' && <ExperienceForm />}
            {activeTab === 'education' && <EducationForm />}
            {activeTab === 'skills' && <SkillsForm />}
            {activeTab === 'projects' && <ProjectsForm />}
            {activeTab === 'certifications' && <CertificationsForm />}
            {activeTab === 'settings' && <SettingsForm />}
          </div>
        </main>
      </div>

      {/* Preview Area (Desktop) & Mobile Modal */}
      <div className={cn(
        "bg-slate-200/50 border-l border-slate-200 flex-col h-full overflow-hidden relative",
        showMobilePreview ? "flex w-full absolute inset-0 z-50 bg-slate-100" : "hidden md:flex md:w-[45%] lg:w-[50%]"
      )}>
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            {showMobilePreview && (
              <button onClick={() => setShowMobilePreview(false)} className="mr-2 p-2 -ml-2 hover:bg-slate-100 rounded-lg md:hidden">
                <ChevronLeft size={20} />
              </button>
            )}
            <LayoutTemplate size={20} className="text-slate-400" />
            <h2 className="font-semibold text-slate-700">Live Preview</h2>
          </div>
          <div className="flex gap-2">
            {/* Template selector could go here */}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
          <div className="w-full max-w-[210mm] bg-white shadow-xl rounded-sm overflow-hidden scale-[0.85] sm:scale-95 md:scale-100 origin-top transition-transform">
            <ResumePreview ref={componentRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
