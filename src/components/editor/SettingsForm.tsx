import { useResumeStore } from '../../store/useResumeStore';
import { Palette, LayoutTemplate, Globe, GraduationCap, Download, Upload, Save, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils';
import React, { useRef, useState } from 'react';

const COLORS = [
  { name: 'Navy', value: '#1e3a8a' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Cyan', value: '#0891b2' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Purple', value: '#9333ea' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Slate', value: '#475569' },
  { name: 'Black', value: '#000000' },
];

const TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean lines and clear hierarchy' },
  { id: 'classic', name: 'Classic', description: 'Traditional and professional' },
  { id: 'creative', name: 'Creative', description: 'Stand out with bold typography' },
  { id: 'minimal', name: 'Minimal', description: 'Simple, elegant, and focused' },
  { id: 'tech', name: 'Tech', description: 'Optimized for developers and IT' },
  { id: 'executive', name: 'Executive', description: 'Sophisticated for leadership roles' },
  { id: 'medical', name: 'Medical', description: 'Clean and clinical layout' },
  { id: 'legal', name: 'Legal', description: 'Formal and authoritative' },
  { id: 'academic', name: 'Academic', description: 'Detailed and comprehensive' },
] as const;

export default React.memo(function SettingsForm() {
  const { data, updateSettings, updateData, resetData } = useResumeStore();
  const { settings } = data;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 font-sans relative">
      {/* Alert Modal */}
      {alertMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center space-y-4">
              <p className="text-slate-700 dark:text-slate-300 font-medium">{alertMessage}</p>
              <button
                onClick={() => setAlertMessage(null)}
                className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white">Reset All Data?</h3>
              <p className="text-center text-slate-600 dark:text-slate-400">
                Are you sure you want to reset all your resume data? This action cannot be undone.
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetData();
                    setShowResetConfirm(false);
                    setAlertMessage('All data has been reset.');
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-8 transition-colors">
        
        {/* Template Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <LayoutTemplate size={20} className="text-slate-400 dark:text-slate-500" />
            Template Style
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => updateSettings({ template: template.id })}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group",
                  settings.template === template.id
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-sm"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                {settings.template === template.id && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 dark:bg-orange-500/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                )}
                <div className={cn(
                  "font-bold mb-1 transition-colors relative z-10",
                  settings.template === template.id ? "text-orange-700 dark:text-orange-400" : "text-slate-900 dark:text-white"
                )}>{template.name}</div>
                <div className={cn(
                  "text-xs transition-colors relative z-10",
                  settings.template === template.id ? "text-orange-600/80 dark:text-orange-300/80" : "text-slate-500 dark:text-slate-400"
                )}>{template.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Color */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Palette size={20} className="text-slate-400 dark:text-slate-500" />
            Theme Color
          </h3>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => updateSettings({ themeColor: color.value })}
                className={cn(
                  "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center",
                  settings.themeColor === color.value
                    ? "border-slate-900 dark:border-white scale-110"
                    : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {settings.themeColor === color.value && (
                  <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Globe size={20} className="text-slate-400 dark:text-slate-500" />
            Language
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => updateSettings({ language: 'en' })}
              className={cn(
                "px-6 py-2.5 rounded-xl border-2 font-medium transition-all",
                settings.language === 'en'
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              English
            </button>
            <button
              onClick={() => updateSettings({ language: 'ar' })}
              className={cn(
                "px-6 py-2.5 rounded-xl border-2 font-medium transition-all",
                settings.language === 'ar'
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              العربية
            </button>
            <button
              onClick={() => updateSettings({ language: 'fr' })}
              className={cn(
                "px-6 py-2.5 rounded-xl border-2 font-medium transition-all",
                settings.language === 'fr'
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              Français
            </button>
          </div>
        </div>

        {/* Fresh Graduate Mode */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <GraduationCap size={20} className="text-slate-400 dark:text-slate-500" />
            Fresh Graduate Mode
          </h3>
          <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                checked={settings.isFreshGrad}
                onChange={(e) => {
                  const isFreshGrad = e.target.checked;
                  const currentOrder = settings.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'custom'];
                  const newOrder = [...currentOrder];
                  const eduIdx = newOrder.indexOf('education');
                  const expIdx = newOrder.indexOf('experience');
                  
                  if (isFreshGrad && eduIdx > expIdx) {
                    // Swap to put education before experience
                    newOrder[eduIdx] = 'experience';
                    newOrder[expIdx] = 'education';
                  } else if (!isFreshGrad && expIdx > eduIdx) {
                    // Swap to put experience before education
                    newOrder[eduIdx] = 'experience';
                    newOrder[expIdx] = 'education';
                  }
                  
                  updateSettings({ isFreshGrad, sectionOrder: newOrder });
                }}
                className="sr-only"
              />
              <div className={cn(
                "w-11 h-6 rounded-full transition-colors relative",
                settings.isFreshGrad 
                  ? "bg-orange-500" 
                  : "bg-slate-300 dark:bg-slate-600"
              )}>
                <div className={cn(
                  "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm",
                  settings.isFreshGrad ? "translate-x-5" : "translate-x-0"
                )} />
              </div>
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Enable Fresh Graduate Mode</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                This will automatically reorder your resume to show Education before Experience, which is recommended for recent graduates.
              </div>
            </div>
          </label>
        </div>

        {/* Data Backup & Restore */}
        <div className="space-y-4 p-6 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-800/30">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Save size={20} className="text-orange-500" />
            Data Backup & Portability
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your data is stored locally in your browser. Export it to a file to move it to another device or keep a safe backup.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-bold shadow-sm"
            >
              <Download size={16} />
              Export Data (.json)
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-bold shadow-sm cursor-pointer">
              <Upload size={16} />
              Import Data (.json)
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                onChange={handleImportJson}
                ref={fileInputRef}
              />
            </label>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-bold shadow-sm ml-auto"
            >
              Reset All Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
});
