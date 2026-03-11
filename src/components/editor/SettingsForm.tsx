import { useResumeStore } from '../../store/useResumeStore';
import { Settings, Palette, LayoutTemplate, Globe, GraduationCap, Download, Upload, Save } from 'lucide-react';
import { cn } from '../../utils';
import { useRef } from 'react';

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

export default function SettingsForm() {
  const { data, updateSettings, updateData } = useResumeStore();
  const { settings } = data;
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-8 transition-colors">
        
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
          </div>
        </div>

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
                  "p-4 rounded-xl border-2 text-left transition-all",
                  settings.template === template.id
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-500"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <div className="font-bold text-slate-900 dark:text-white mb-1">{template.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{template.description}</div>
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
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
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
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
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
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
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
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                checked={settings.isFreshGrad}
                onChange={(e) => updateSettings({ isFreshGrad: e.target.checked })}
                className="sr-only"
              />
              <div className={cn(
                "w-5 h-5 rounded border transition-colors flex items-center justify-center",
                settings.isFreshGrad 
                  ? "bg-indigo-500 border-indigo-500" 
                  : "border-slate-300 dark:border-slate-600 group-hover:border-indigo-400 dark:group-hover:border-indigo-500 bg-white dark:bg-slate-800"
              )}>
                {settings.isFreshGrad && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-white">Enable Fresh Graduate Mode</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                This will automatically reorder your resume to show Education before Experience, which is recommended for recent graduates.
              </div>
            </div>
          </label>
        </div>

      </div>
    </div>
  );
}
