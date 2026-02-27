import { useResumeStore } from '../../store/useResumeStore';
import { Settings, Palette, LayoutTemplate, Globe, GraduationCap } from 'lucide-react';
import { cn } from '../../lib/utils';

const COLORS = [
  { name: 'Green', value: '#4F46E5' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Slate', value: '#475569' },
  { name: 'Black', value: '#0F172A' },
];

const TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean lines and clear hierarchy' },
  { id: 'classic', name: 'Classic', description: 'Traditional and professional' },
  { id: 'creative', name: 'Creative', description: 'Stand out with bold typography' },
] as const;

export default function SettingsForm() {
  const { data, updateSettings } = useResumeStore();
  const { settings } = data;

  return (
    <div className="space-y-6 font-sans">
      <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
        <Settings className="text-indigo-500" size={24} />
        Resume Settings
      </h2>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-100 space-y-8">
        
        {/* Template Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
            <LayoutTemplate size={20} className="text-zinc-400" />
            Template Style
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => updateSettings({ template: template.id })}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  settings.template === template.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                )}
              >
                <div className="font-bold text-zinc-900 mb-1">{template.name}</div>
                <div className="text-xs text-zinc-500">{template.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Color */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
            <Palette size={20} className="text-zinc-400" />
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
                    ? "border-zinc-900 scale-110"
                    : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {settings.themeColor === color.value && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
            <Globe size={20} className="text-zinc-400" />
            Language
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => updateSettings({ language: 'en' })}
              className={cn(
                "px-6 py-2.5 rounded-xl border-2 font-medium transition-all",
                settings.language === 'en'
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
              )}
            >
              English
            </button>
            <button
              onClick={() => updateSettings({ language: 'ar' })}
              className={cn(
                "px-6 py-2.5 rounded-xl border-2 font-medium transition-all",
                settings.language === 'ar'
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
              )}
            >
              العربية
            </button>
          </div>
        </div>

        {/* Fresh Graduate Mode */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
            <GraduationCap size={20} className="text-zinc-400" />
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
                  : "border-zinc-300 group-hover:border-indigo-400"
              )}>
                {settings.isFreshGrad && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <div className="font-medium text-zinc-900">Enable Fresh Graduate Mode</div>
              <div className="text-sm text-zinc-500">
                This will automatically reorder your resume to show Education before Experience, which is recommended for recent graduates.
              </div>
            </div>
          </label>
        </div>

      </div>
    </div>
  );
}
