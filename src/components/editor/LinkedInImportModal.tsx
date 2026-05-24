import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Linkedin, Upload, FileText, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useResumeStore } from "../../store/useResumeStore";
import { aiService } from "../../services/aiService";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface TextItem {
  str: string;
}

interface ParsedExperience {
  id?: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

interface ParsedEducation {
  id?: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ParsedResume {
  personalInfo?: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    jobTitle: string;
    summary: string;
  };
  experience?: ParsedExperience[];
  education?: ParsedEducation[];
  skills?: string[];
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setError(
          language === "ar" ? "الرجاء رفع ملف PDF" : "Please upload a PDF file"
        );
      }
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    // Process first 10 pages max to prevent abuse
    const numPages = Math.min(pdf.numPages, 10);

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => (item as TextItem).str)
        .join(" ");
      fullText += pageText + "\n";
      setProgress(Math.round((i / numPages) * 30)); // 30% progress for PDF parsing
    }

    return fullText;
  };

  const processFile = async () => {
    if (!selectedFile) return;

    try {
      setIsProcessing(true);
      setError(null);
      setProgress(10);

      const text = await extractTextFromPDF(selectedFile);
      setProgress(40); // PDF parsing done

      // Use Gemini to parse resume text into JSON
      const response = await aiService.importResume(text);
      setProgress(90);

      if (response.error) {
        throw new Error(response.error);
      }

      const parsedData: ParsedResume = JSON.parse(
        response.text.replace(/```json/g, "").replace(/```/g, "")
      );

      // Apply parsed data to store
      if (parsedData.personalInfo) {
        updatePersonalInfo(parsedData.personalInfo);
      }

      if (parsedData.experience && parsedData.experience.length > 0) {
        clearExperience();
        parsedData.experience.forEach((exp) => {
          addExperience({
            ...exp,
            id: exp.id || crypto.randomUUID(),
          });
        });
      }

      if (parsedData.education && parsedData.education.length > 0) {
        clearEducation();
        parsedData.education.forEach((edu) => {
          addEducation({
            ...edu,
            id: edu.id || crypto.randomUUID(),
          });
        });
      }

      if (parsedData.skills && parsedData.skills.length > 0) {
        parsedData.skills.forEach((skill) => {
          if (typeof skill === "string") addSkill(skill);
        });
      }

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
      const errorMessage =
        err instanceof Error ? err.message : String(err);
      setError(
        errorMessage ||
          (language === "ar"
            ? "فشل تحليل الملف. الرجاء المحاولة مرة أخرى."
            : "Failed to parse file. Please try again.")
      );
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
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
                <Sparkles size={24} className="text-indigo-600 animate-pulse" />
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
                  {language === "ar" ? "تم الاستيراد بنجاح!" : "Imported Successfully!"}
                </h4>
                <p className="text-slate-500 max-w-xs mx-auto">
                  {language === "ar" ? "تم تعبئة بيانات سيرتك الذاتية بنجاح." : "Your resume data has been populated."}
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
                  <div className="mt-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100 flex items-start gap-2">
                    <X size={16} className="mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {isProcessing && (
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        {language === "ar" ? "جاري معالجة البيانات..." : "Processing data..."}
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
