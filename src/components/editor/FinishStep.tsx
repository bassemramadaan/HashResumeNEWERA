import { useState, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Download, Share2, FileText, Check, Copy, Loader2, Save, Upload } from 'lucide-react';
import { generateWord } from '../../lib/generateWord';

interface FinishStepProps {
  onPrint: () => void;
}

export default function FinishStep({ onPrint }: FinishStepProps) {
  const { data, updateData } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          alert('Resume data imported successfully!');
        } else {
          alert('Invalid resume data format.');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Failed to parse the file. Please ensure it is a valid JSON backup.');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your CV is Ready!</h2>
        <p className="text-slate-500 dark:text-slate-400">Your progress is saved locally. You can backup your data below.</p>
      </div>

      {/* Backup Section */}
      <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Save className="w-5 h-5 text-orange-500" />
              Data Backup & Privacy
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Your data is 100% private and stored only in your browser's local storage. 
              <strong className="font-semibold text-slate-800 dark:text-slate-200"> If you clear your browser cache, your data will be lost.</strong> 
              Download a backup file to keep your resume safe.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => generateWord(data)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium shadow-sm"
            >
              <FileText size={16} />
              Export Word
            </button>
            <button
              onClick={handleExportJson}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium shadow-sm"
            >
              <Download size={16} />
              Backup Data
            </button>
            <label className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium shadow-sm cursor-pointer">
              <Upload size={16} />
              Restore Data
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
    </div>
  );
}
