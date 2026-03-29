import { useRef, useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { translations } from '../../i18n/translations';
import { Download, FileText, Save, Upload, CheckCircle2, ArrowRight, Target, PenTool, Search } from 'lucide-react';
import { generateWord } from '../../utils/generateWord';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface FinishStepProps {
  onPrint: () => void;
  onExportWord: () => void;
  onJumpToStep: (step: string) => void;
}

export default function FinishStep({ onPrint, onExportWord, onJumpToStep }: FinishStepProps) {
  const { data, updateData } = useResumeStore();
  const { language } = useLanguageStore();
  const t = translations[language].landing.finish;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleExportJson = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${data.personalInfo.fullName || 'resume'}_backup.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        // Basic validation
        if (importedData && importedData.personalInfo && importedData.experience) {
          updateData(importedData);
          setAlertMessage('Resume data imported successfully!');
        } else {
          setAlertMessage('Invalid resume data format.');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setAlertMessage('Failed to parse the file. Please ensure it is a valid JSON backup.');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const nextSteps = [
    {
      title: t.checkAts,
      desc: t.checkAtsDesc,
      icon: <Target className="w-6 h-6 text-slate-500" />,
      action: () => onJumpToStep('review'),
      type: 'button'
    },
    {
      title: t.findJobs,
      desc: t.findJobsDesc,
      icon: <Search className="w-6 h-6 text-emerald-500" />,
      path: '/hash-hunt',
      type: 'link'
    },
    {
      title: t.createCover,
      desc: t.createCoverDesc,
      icon: <PenTool className="w-6 h-6 text-orange-500" />,
      path: '/cover-letter',
      type: 'link'
    }
  ];

  const handleProceedToExportWord = () => {
    if (data.isPremium) {
      generateWord(data);
    } else {
      onExportWord(); // This will trigger the payment modal in EditorPage
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 max-w-4xl mx-auto relative">
      <AnimatePresence>
        {alertMessage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 text-center space-y-4">
                <p className="text-slate-700 dark:text-slate-300 font-medium">{alertMessage}</p>
                <button
                  onClick={() => setAlertMessage(null)}
                  className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Celebratory Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-2"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </motion.div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.readyTitle}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">{t.readySubtitle}</p>
      </div>

      {/* Backup Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />
        
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Save className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              {t.backupTitle}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.backupDesc}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-4 w-full lg:w-auto">
            <button
              onClick={onPrint}
              data-tour="download-button"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-bold shadow-sm hover:shadow-md active:scale-95"
            >
              <FileText size={18} className="text-red-500" />
              Export PDF
            </button>
            <button
              onClick={handleProceedToExportWord}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-bold shadow-sm hover:shadow-md active:scale-95"
            >
              <FileText size={18} className="text-blue-500" />
              {t.exportWord}
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-bold shadow-sm hover:shadow-md active:scale-95"
            >
              <Download size={18} className="text-emerald-500" />
              {t.backupData}
            </button>
            <label className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-bold shadow-sm hover:shadow-md active:scale-95 cursor-pointer">
              <Upload size={18} className="text-orange-500" />
              {t.restoreData}
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                onChange={handleImportJson}
                ref={fileInputRef}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white px-2 text-start">{t.nextStepsTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nextSteps.map((step, idx) => (
            step.type === 'link' ? (
              <Link
                key={idx}
                to={step.path!}
                className="group p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-3xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300 text-start"
              >
                <div className="mb-4 p-4 bg-white dark:bg-slate-900 rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  {step.title}
                  <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-180" />
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </Link>
            ) : (
              <button
                key={idx}
                onClick={step.action}
                className="group p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-3xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300 text-start"
              >
                <div className="mb-4 p-4 bg-white dark:bg-slate-900 rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  {step.title}
                  <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-180" />
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
