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
    } catch (err: any) {
      console.error(err);
      setError(language === 'ar' ? 'حدث خطأ أثناء التوليد' : 'Error generating resume');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Wand2 size={28} />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
            {language === 'ar' ? 'السحر بكلمة واحدة 🪄' : 'One-Click Magic 🪄'}
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
            {language === 'ar' 
              ? 'أدخل المسمى الوظيفي فقط، وسيقوم الذكاء الاصطناعي بتوليد سيرة ذاتية وهمية كاملة لتعديلها بدلاً من البدء من الصفر.' 
              : 'Just enter a job title, and AI will generate a full mock resume for you to edit instead of starting from scratch.'}
          </p>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {language === 'ar' ? 'المسمى الوظيفي المستهدف' : 'Target Job Title'}
              </label>
              <input dir="auto"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: Senior Frontend Developer' : 'e.g., Senior Frontend Developer'}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400"
                disabled={isGenerating}
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-600 text-xs font-medium rounded-xl border border-rose-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating || !jobTitle.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-6 py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {language === 'ar' ? 'جاري السحر...' : 'Doing Magic...'}
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {language === 'ar' ? 'توليد السيرة الذاتية' : 'Generate Mock Resume'}
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
