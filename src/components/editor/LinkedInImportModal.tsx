import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Linkedin, Upload, FileText, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useResumeStore } from "../../store/useResumeStore";
import { aiService } from "../../services/aiService";
import * as pdfjsLib from "pdfjs-dist";

import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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

  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<{ title: string; description: string; tip: string } | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getErrorMessage = (error: Error) => {
    if (error.message.includes('image') || error.message.includes('صورة')) {
      return {
        title: 'الملف صورة مسكانة',
        description: 'جرب: LinkedIn PDF → Profile → More → Save to PDF',
        tip: 'أو ارفع CV نصي من Word أو Google Docs'
      };
    }
    if (error.message.includes('كبير') || error.message.includes('size')) {
      return {
        title: 'الملف كبير جداً',
        description: 'الحد الأقصى 10MB — حجم الملف الحالي: ' + (selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(1) : 0) + 'MB',
        tip: 'جرب تضغط الـ PDF أو استخدم نسخة أخف'
      };
    }
    return {
      title: 'خطأ في قراءة الملف',
      description: 'تأكد إن الملف PDF نصي وليس صورة',
      tip: 'جرب ملف تاني أو تواصل معنا'
    };
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        setError({
          title: language === "ar" ? "نوع الملف غير مدعوم" : "Unsupported File Type",
          description: language === "ar" ? "الرجاء رفع ملف PDF" : "Please upload a PDF file",
          tip: ""
        });
      }
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const version = pdfjsLib.version || "5.7.284";

    let pdf: any = null;
    const errors: any[] = [];

    // Attempt 1: Try with Cloudflare CDNJS (highly reliable globally, especially in MENA countries)
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/standard_fonts/`,
      });
      pdf = await loadingTask.promise;
    } catch (e1) {
      console.warn("PDF extraction Attempt 1 failed (cdnjs):", e1);
      errors.push(e1);
    }

    // Attempt 2: Try with unpkg (as secondary CDN)
    if (!pdf) {
      try {
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
          cMapUrl: `https://unpkg.com/pdfjs-dist@${version}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${version}/standard_fonts/`,
        });
        pdf = await loadingTask.promise;
      } catch (e2) {
        console.warn("PDF extraction Attempt 2 failed (unpkg):", e2);
        errors.push(e2);
      }
    }

    // Attempt 3: Try without custom cMap/font paths (offline fallback, parses standard text/fonts)
    if (!pdf) {
      try {
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
        });
        pdf = await loadingTask.promise;
      } catch (e3) {
        console.error("PDF extraction Attempt 3 failed (no maps):", e3);
        errors.push(e3);
        throw new Error(
          language === "ar"
            ? "فشل تحميل الملف. تأكد من أن ملف PDF غير تالف."
            : "Failed to load PDF. Please make sure the file is not corrupted."
        );
      }
    }

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? (item as { str: string }).str : ''))
        .join(' ');
      fullText += pageText + '\n';
    }

    console.log('Extracted text length:', fullText.trim().length);
    console.log('First 200 chars:', fullText.substring(0, 200));

    if (fullText.trim().length < 50) {
      throw new Error('image-based');
    }

    return fullText.trim();
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
    
    const text = response.text;
    
    // تنظيف الـ response لو فيه markdown
    const cleanJson = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    return JSON.parse(cleanJson);
  };

  const fillFormWithData = (parsedData: {
    personalInfo?: {
      fullName: string;
      jobTitle: string;
      email: string;
      phone: string;
      address: string;
      linkedin: string;
      github: string;
      website: string;
      summary: string;
    };
    workExperience?: {
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
    }[];
    education?: {
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate: string;
      gpa: string;
    }[];
    skills?: string[];
  }) => {
    // Personal Info
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

    // Work Experience
    if (parsedData.workExperience && parsedData.workExperience.length > 0) {
      clearExperience();
      parsedData.workExperience.forEach((exp) => {
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

    // Education
    if (parsedData.education && parsedData.education.length > 0) {
      clearEducation();
      parsedData.education.forEach((edu) => {
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

    // Skills
    if (parsedData.skills && parsedData.skills.length > 0) {
      parsedData.skills.forEach((skill) => {
        if (typeof skill === 'string' && skill.trim()) addSkill(skill);
      });
    }
  };

  const processFile = async () => {
    if (!selectedFile) return;

    try {
      setIsProcessing(true);
      setError(null);
      setProgress(10); // "جاري قراءة الملف..."
      
      // Step 1: Extract text
      const text = await extractTextFromPDF(selectedFile);
      setProgress(40);
      
      if (!text || text.trim().length < 50) {
        throw new Error('الملف يبدو صورة — جرب ترفع PDF نصي أو LinkedIn profile بدلاً منه');
      }
      
      setProgress(50); // "جاري تحليل السيرة الذاتية بالذكاء الاصطناعي..."
      // Step 2: Parse with Gemini
      const parsedData = await parseWithGemini(text);
      setProgress(90);
      
      // Step 3: Fill form
      fillFormWithData(parsedData);
      
      setProgress(100);
      setSuccess(true);

      setTimeout(() => {
        onClose();
        setSuccess(false);
        setSelectedFile(null);
        setProgress(0);
      }, 2000);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(getErrorMessage(err));
      } else {
        setError({ title: "خطأ غير معروف", description: "حدث خطأ غير متوقع", tip: "" });
      }
    } finally {
      setIsProcessing(false);
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
            onClick={() => !isProcessing && onClose()}
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
              disabled={isProcessing}
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
                  {language === "ar" ? "مستخلص السبر الذاتية الذكي (PDF)" : "Smart Resume Auto-Parser (PDF)"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === "ar" ? "ارفع سيرتك الذاتية القديمة أو ملف لينكد إن لاستخلاص البيانات فوراً" : "Upload your old resume or LinkedIn PDF to extract data instantly"}
                </p>
              </div>
            </div>

            {success ? (
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
                <div className="mb-6 space-y-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-start gap-2 mb-2">
                    <Linkedin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <p className="font-medium text-slate-700">
                      {language === "ar" 
                        ? "لماذا ملف PDF وليس ربط الحساب؟" 
                        : "Why PDF instead of direct connect?"}
                    </p>
                  </div>
                  <p className="text-slate-500 text-xs ms-6 leading-relaxed">
                    {language === "ar"
                      ? "اعدادات الخصوصية في LinkedIn لا تسمح للتطبيقات باستخراج السيرة الذاتية للحفاظ على خصوصيتك. استخراج البيانات من ملف الـ PDF هو البديل الآمن."
                      : "To protect your privacy, LinkedIn does not allow external apps to extract full resume details via direct connect. Scanning your profile PDF securely bypasses this limitation."}
                  </p>
                </div>

                <div className="mb-6 space-y-4 text-sm text-slate-600">
                  <p className="font-medium">
                    {language === "ar" ? "كيفية الحصول على ملف PDF من لينكد إن:" : "How to get your profile PDF:"}
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-500 ms-2">
                    <li>{language === "ar" ? "اذهب إلى حسابك الشخصي على LinkedIn" : "Go to your LinkedIn profile"}</li>
                    <li>{language === "ar" ? "اضغط على زر (المزيد / More)" : "Click the (More) button"}</li>
                    <li>{language === "ar" ? "اختر (حفظ بتنسيق PDF / Save to PDF)" : "Select (Save to PDF)"}</li>
                  </ol>
                </div>

                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isProcessing && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-[#0A66C2] bg-[#0A66C2]/5"
                      : selectedFile
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-[#0A66C2]/50 hover:bg-slate-50"
                  } ${isProcessing ? "pointer-events-none opacity-50" : ""}`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    accept="application/pdf"
                    className="hidden"
                  />
                  
                  {selectedFile ? (
                    <>
                      <FileText size={40} className="text-emerald-500 mb-4" />
                      <p className="text-emerald-700 font-medium mb-1">{selectedFile.name}</p>
                      <p className="text-emerald-500 text-sm">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload size={40} className="text-slate-400 mb-4" />
                      <p className="text-slate-700 font-medium mb-1">
                        {language === "ar" ? "اضغط أو اسحب الملف هنا" : "Click or drag file here"}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {language === "ar" ? "ملفات PDF فقط" : "PDF files only"}
                      </p>
                    </>
                  )}
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                      <X size={16} className="text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-900 text-sm">{error.title}</h4>
                      <p className="text-rose-700 text-xs mt-1 mb-2 font-medium">{error.description}</p>
                      {error.tip && (
                        <div className="text-rose-600/80 text-[11px] font-semibold bg-rose-100/50 p-2 rounded-lg inline-block">
                          💡 {error.tip}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        {progress <= 40
                          ? (language === "ar" ? "جاري قراءة الملف..." : "Reading file...")
                          : (language === "ar" ? "جاري تحليل السيرة الذاتية بالذكاء الاصطناعي..." : "Parsing resume with AI...")}
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#0A66C2] transition-all duration-300 relative overflow-hidden" 
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    onClick={processFile}
                    disabled={!selectedFile || isProcessing}
                    style={{ backgroundColor: 'var(--color-brand-500)', color: '#fff' }}
                    className="w-full disabled:bg-slate-300 disabled:text-slate-500 font-bold py-4 px-6 rounded-xl shadow-lg transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
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
