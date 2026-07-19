import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useResumeStore } from "../../store/useResumeStore";
import { aiService } from "../../services/aiService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LinkedInImportModal({ isOpen, onClose }: Props) {
  const { language } = useLanguageStore();
  const {
    updatePersonalInfo,
    addExperience,
    addEducation,
    clearExperience,
    clearEducation,
    addSkill,
  } = useResumeStore();
  
  const [pastedText, setPastedText] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<{ title: string; description: string } | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const fillFormWithData = (parsedData: any) => {
    if (parsedData.personalInfo) {
      updatePersonalInfo({
        ...useResumeStore.getState().data.personalInfo,
        fullName: parsedData.personalInfo.fullName || '',
        jobTitle: parsedData.personalInfo.jobTitle || '',
        email: parsedData.personalInfo.email || '',
        phone: parsedData.personalInfo.phone || '',
        location: parsedData.personalInfo.address || '',
        linkedin: parsedData.personalInfo.linkedin || '',
        github: parsedData.personalInfo.github || '',
        website: parsedData.personalInfo.website || '',
        summary: parsedData.personalInfo.summary || '',
      });
    }

    if (parsedData.workExperience && parsedData.workExperience.length > 0) {
      clearExperience();
      parsedData.workExperience.forEach((exp: any) => {
        const safeId = (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11));
        addExperience({
          id: safeId,
          company: exp.company || '',
          role: exp.position || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          current: exp.current || false,
          description: exp.description || '',
          location: '',
        });
      });
    }

    if (parsedData.education && parsedData.education.length > 0) {
      clearEducation();
      parsedData.education.forEach((edu: any) => {
        const safeId = (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11));
        addEducation({
          id: safeId,
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          description: edu.gpa ? `GPA: ${edu.gpa}` : '',
        });
      });
    }

    if (parsedData.skills && parsedData.skills.length > 0) {
      parsedData.skills.forEach((skill: any) => {
        if (typeof skill === 'string' && skill.trim()) addSkill(skill);
      });
    }
  };

  const parseWithGemini = async (cvText: string) => {
    const prompt = `
    أنت محلل سير ذاتية محترف. استخرج البيانات من النص التالي وأرجعها كـ JSON فقط بدون أي نص إضافي.
    
    النص:
    ${cvText}
    
    أرجع JSON بالهيكل ده بالظبط:
    {
      "personalInfo": {
        "fullName": "",
        "jobTitle": "",
        "email": "",
        "phone": "",
        "address": "",
        "linkedin": "",
        "github": "",
        "website": "",
        "summary": ""
      },
      "workExperience": [
        {
          "company": "",
          "position": "",
          "startDate": "",
          "endDate": "",
          "current": false,
          "description": ""
        }
      ],
      "education": [
        {
          "institution": "",
          "degree": "",
          "field": "",
          "startDate": "",
          "endDate": "",
          "gpa": ""
        }
      ],
      "skills": [""],
      "certifications": [
        {
          "name": "",
          "issuer": "",
          "date": "",
          "credentialId": ""
        }
      ],
      "projects": [
        {
          "name": "",
          "description": "",
          "technologies": [""]
        }
      ]
    }
    
    قواعد مهمة:
    - لو حاجة مش موجودة في النص، حطها string فاضي "" أو array فاضي []
    - استنتج المهارات (Skills) تلقائياً من خلال نصوص الخبرات السابقة (Experience) إذا لم تكن مكتوبة بوضوح في النص.
    - الـ dates بالصيغة MM/YYYY
    - لو في أكتر من وظيفة أو تعليم، حطهم كلهم في الـ array
    - أرجع JSON فقط بدون markdown أو backticks
    `;
    
    const response = await aiService.generateContent(prompt);
    
    console.log('RAW Gemini response:', JSON.stringify(response));
    
    const text = response.text || '';
    console.log('Extracted text before parsing:', text);
    
    try {
      const cleanJson = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      console.log('Cleaned JSON string:', cleanJson);
      
      return JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON parse failed. Raw text was:', text);
      console.error('Parse error details:', parseError);
      throw parseError;
    }
  };

  const handlePasteImport = async () => {
    if (!pastedText || pastedText.trim().length < 50) {
      setImportError({
        title: language === 'ar' ? 'النص قصير جدًا' : 'Text too short',
        description: language === 'ar' ? 'الصق نص سيرتك الذاتية كاملاً (على الأقل بضعة أسطر)' : 'Please paste your full resume text (at least a few lines)',
      });
      return;
    }
    
    setImportLoading(true);
    setImportError(null);
    try {
      const parsedData = await parseWithGemini(pastedText);
      fillFormWithData(parsedData);
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        setPastedText('');
        onClose();
      }, 2000);
    } catch (error) {
      setImportError({
        title: language === 'ar' ? 'حدث خطأ أثناء التحليل' : 'Error during parsing',
        description: language === 'ar' ? 'تأكد من لصق نص واضح يحتوي على بياناتك' : 'Make sure to paste clear text containing your data',
      });
    } finally {
      setImportLoading(false);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !importLoading && onClose()}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden z-10"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <button
              onClick={onClose}
              disabled={importLoading}
              className="absolute top-4 end-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-600">
                <Sparkles size={24} className="text-brand-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {language === "ar" ? "استيراد بيانات السيرة الذاتية" : "Import Resume Data"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === "ar" ? "الصق نص سيرتك الذاتية وسنقوم بتنظيمها تلقائياً" : "Paste your resume text and we will organize it automatically"}
                </p>
              </div>
            </div>

            {importSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-xl font-bold text-slate-900">
                  {language === "ar" ? "تم استيراد بياناتك بنجاح!" : "Imported Successfully!"}
                </h4>
                <p className="text-slate-500 max-w-xs mx-auto">
                  {language === "ar" ? "راجع المعلومات وعدّل أي حاجة" : "Review the info and make any edits needed."}
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-6 space-y-4 text-sm text-slate-600">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <strong className="block text-slate-800 mb-2">
                      {language === "ar" ? "كيف تحصل على النص؟" : "How to get the text?"}
                    </strong>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-500">
                      <li>{language === "ar" ? "افتح ملف سيرتك الذاتية (Word أو PDF)" : "Open your resume file (Word or PDF)"}</li>
                      <li>{language === "ar" ? "اضغط Ctrl+A لتحديد كل النص" : "Press Ctrl+A to select all text"}</li>
                      <li>{language === "ar" ? "اضغط Ctrl+C للنسخ" : "Press Ctrl+C to copy"}</li>
                      <li>{language === "ar" ? "الصق النص في المربع بالأسفل (Ctrl+V)" : "Paste the text in the box below (Ctrl+V)"}</li>
                    </ol>
                  </div>
                </div>

                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={language === "ar" ? "الصق نص سيرتك الذاتية هنا..." : "Paste your resume text here..."}
                  rows={10}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none"
                />
                
                <div className="text-right text-xs text-slate-400 mt-2">{pastedText.length} {language === "ar" ? "حرف" : "characters"}</div>
                
                {importError && (
                  <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                      <X size={16} className="text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-900 text-sm">{importError.title}</h4>
                      <p className="text-rose-700 text-xs mt-1 mb-2 font-medium">{importError.description}</p>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    onClick={handlePasteImport}
                    disabled={importLoading}
                    style={{ backgroundColor: 'var(--color-brand-500)', color: '#fff' }}
                    className="w-full disabled:bg-slate-300 disabled:text-slate-500 font-bold py-4 px-6 rounded-xl shadow-lg transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {importLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        {language === "ar" ? "جاري الاستيراد..." : "Importing..."}
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        {language === "ar" ? "استيراد البيانات" : "Import Data"}
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
