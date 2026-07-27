import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wand2, X, Loader2 } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useResumeStore } from '../../store/useResumeStore';
import { aiService } from '../../services/aiService';

export default function OneClickMagicModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { language } = useLanguageStore();
  const updateData = useResumeStore(state => state.updateData);
  const [jobTitle, setJobTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    setIsGenerating(true);
    setError('');

    const prompt = `
أنت خبير توظيف. قم بإنشاء سيرة ذاتية وهمية كاملة ومثالية (Mock Resume) بناءً على المسمى الوظيفي: "${jobTitle}".
السيرة الذاتية يجب أن تكون جاهزة، بحيث يستطيع المستخدم التعديل عليها فقط.
اللغة المفضلة: ${language === 'ar' ? 'العربية' : language === 'fr' ? 'الفرنسية' : 'English'}.
يرجى إرجاع JSON فقط بدون أي نصوص إضافية، بالهيكل التالي:
{
  "personalInfo": {
    "fullName": "John Doe",
    "jobTitle": "${jobTitle}",
    "email": "john.doe@example.com",
    "phone": "+123456789",
    "address": "New York, USA",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "",
    "website": "",
    "summary": "Professional summary reflecting the job title..."
  },
  "workExperience": [
    {
      "id": "1",
      "company": "Tech Corp",
      "position": "${jobTitle}",
      "startDate": "01/2020",
      "endDate": "Present",
      "current": true,
      "description": "Responsibility 1 with metrics\\nResponsibility 2\\nResponsibility 3"
    }
  ],
  "education": [
    {
      "id": "1",
      "institution": "University Name",
      "degree": "Bachelor's Degree",
      "field": "Computer Science or relevant",
      "startDate": "09/2015",
      "endDate": "06/2019",
      "gpa": "3.8"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "certifications": []
}
`;

    try {
      const response = await aiService.generateContent(prompt);
      const text = response.text;
      
      const cleanJson = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
        
      const parsedData = JSON.parse(cleanJson);

      updateData({
        ...useResumeStore.getState().data,
        personalInfo: parsedData.personalInfo || useResumeStore.getState().data.personalInfo,
        experience: parsedData.workExperience || parsedData.experience || [],
        education: parsedData.education || [],
        skills: parsedData.skills || [],
        certifications: parsedData.certifications || []
      });

      onClose();
    } catch (err: unknown) {
      console.error(err);
      setError(language === 'ar' ? 'حدث خطأ أثناء التوليد (يرجى التحقق من الاتصال)' : 'Error generating resume');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-3xl shadow-2xl overflow-y-auto relative flex flex-col justify-between"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors z-20 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-xs">
              <Wand2 size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                {language === 'ar' ? 'المساعد الذكي للسيرة الذاتية' : 'AI Resume Assistant'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {language === 'ar' ? 'توليد سيرة ذاتية بكلمة واحدة 🪄' : 'One-Click AI Generator 🪄'}
              </h2>
            </div>
          </div>

          {isGenerating ? (
            /* ── Skeleton Screen state during AI generation ── */
            <div className="space-y-6 py-4 animate-in fade-in duration-300">
              <div className="p-4 bg-purple-50/80 border border-purple-100 rounded-2xl flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-purple-900">
                    {language === 'ar' ? 'جاري تحليل المسمى الوظيفي وصياغة الأقسام...' : 'Analyzing job title and drafting resume sections...'}
                  </h4>
                  <p className="text-[11px] text-purple-700 font-medium">
                    {language === 'ar' ? 'يتولى الذكاء الاصطناعي اختيار المهارات والخبرات المناسبة معايير ATS' : 'AI is selecting optimized skills and experiences matching ATS standard'}
                  </p>
                </div>
              </div>

              {/* Animated multi-line Skeleton cards */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="h-4 bg-slate-200 rounded-md w-1/3" />
                    <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }} className="h-4 bg-slate-200 rounded-full w-12" />
                  </div>
                  <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="h-3 bg-slate-200 rounded-md w-full" />
                  <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }} className="h-3 bg-slate-200 rounded-md w-4/5" />
                </div>

                <div className="p-4 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="h-4 bg-slate-200 rounded-md w-1/4" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map(i => (
                      <motion.div key={i} animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }} className="h-7 bg-slate-200 rounded-xl w-20" />
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-2">
                  <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="h-3.5 bg-slate-200 rounded-md w-full" />
                  <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.5 }} className="h-3.5 bg-slate-200 rounded-md w-2/3" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
                {language === 'ar' 
                  ? 'أدخل المسمى الوظيفي فقط، وسيقوم الذكاء الاصطناعي بتوليد سيرة ذاتية كاملة جاهزة للتعديل المباشر.' 
                  : 'Enter target job title, and AI will generate a complete, ready-to-edit resume for you.'}
              </p>

              <form onSubmit={handleGenerate} className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {language === 'ar' ? 'المسمى الوظيفي المستهدف' : 'Target Job Title'}
                    </label>
                    <input dir="auto"
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: مهندس برمجيات Frontend' : 'e.g., Senior Frontend Developer'}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400 min-h-[48px]"
                      disabled={isGenerating}
                      autoFocus
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      {language === 'ar' ? 'أمثلة سريعة للتجربة:' : 'Popular Quick Roles:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Software Engineer', 'Data Analyst', 'Marketing Specialist', 'Project Manager'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setJobTitle(role)}
                          className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 text-[11px] font-bold text-slate-700 transition-all cursor-pointer"
                        >
                          + {role}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 text-rose-600 text-xs font-medium rounded-xl border border-rose-100 my-2">
                    {error}
                  </div>
                )}

                <div className="pt-4 mt-auto">
                  <button
                    type="submit"
                    disabled={isGenerating || !jobTitle.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-sm px-6 py-4 rounded-2xl transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 min-h-[48px] cursor-pointer"
                  >
                    <Wand2 className="w-5 h-5" />
                    <span>{language === 'ar' ? 'توليد السيرة الذاتية الآن' : 'Generate Full Resume Now'}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

