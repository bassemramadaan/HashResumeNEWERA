import React, { useState, useRef } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Upload, 
  Trash2,
  Sparkles,
  Info
} from "lucide-react";

interface ApplicationFormProps {
  language: string;
  hasDesignedResume: boolean;
  fullName: string;
  setFullName: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  jobTitle: string;
  setJobTitle: (v: string) => void;
  experience: string;
  setExperience: (v: string) => void;
  userLocation: string;
  setUserLocation: (v: string) => void;
  openTo: string;
  setOpenTo: (v: string) => void;
  resumeFile: { name: string; type: string; data: string } | null;
  setResumeFile: (v: { name: string; type: string; data: string } | null) => void;
  submitting: boolean;
  errorMessage: string;
  setErrorMessage: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAutoFill: () => void;
}

export function ApplicationForm({
  language,
  hasDesignedResume,
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  jobTitle,
  setJobTitle,
  experience,
  setExperience,
  userLocation,
  setUserLocation,
  openTo,
  setOpenTo,
  resumeFile,
  setResumeFile,
  submitting,
  errorMessage,
  setErrorMessage,
  onSubmit,
  onAutoFill
}: ApplicationFormProps) {
  const isAr = language === "ar";
  const isFr = language === "fr";

  // Wizard active step: 1 (File Upload), 2 (Personal Info), 3 (Target Role & Prefs)
  const [activeStep, setActiveStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (file: File) => {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 5) {
      setErrorMessage(isAr ? "حجم الملف الحالي أكبر من 5 ميجابايت!" : "File size exceeds 5MB limit!");
      return;
    }
    
    setErrorMessage("");
    const reader = new FileReader();
    reader.onload = () => {
      setResumeFile({
        name: file.name,
        type: file.type || "application/pdf",
        data: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleNextStep = () => {
    if (activeStep === 1) {
      if (!resumeFile) {
        setErrorMessage(isAr ? "يرجى تحميل ملف السيرة الذاتية للمتابعة" : "Please upload your resume to proceed");
        return;
      }
      setErrorMessage("");
      setActiveStep(2);
    } else if (activeStep === 2) {
      if (!fullName || !phoneNumber || !email) {
        setErrorMessage(isAr ? "يرجى ملء جميع الحقول الإلزامية للمتابعة" : "Please fill in all required fields to proceed");
        return;
      }
      setErrorMessage("");
      setActiveStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorMessage("");
    setActiveStep((prev) => Math.max(1, prev - 1));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !email || !jobTitle) {
      setErrorMessage(isAr ? "يرجى ملء جميع الحقول الإلزامية التي تحتوي علامة (*)" : "Please fill in all required fields marked with (*)");
      return;
    }
    if (!resumeFile) {
      setErrorMessage(isAr ? "يرجى تحميل سيرتك الذاتية للمتابعة" : "Please upload your CV/Resume to continue");
      return;
    }
    onSubmit(e);
  };

  // Translations
  const stepTitles = [
    isAr ? "رفع السيرة" : isFr ? "Déposer le CV" : "Upload CV",
    isAr ? "البيانات الأساسية" : isFr ? "Infos de base" : "Basic Details",
    isAr ? "التفضيلات والتأكيد" : isFr ? "Préférences" : "Preferences"
  ];

  const uploadBoxLabel = isAr ? "اختر أو اسحب ملف السيرة الذاتية هنا" : isFr ? "Choisissez ou glissez votre CV ici" : "Choose or drag your resume file here";
  const uploadBoxSupport = isAr ? "الفرز الفوري مدعوم لـ PDF و Word" : isFr ? "L'extraction prend en charge PDF et Word" : "Instant extraction supports PDF & Word";
  const changeFileText = isAr ? "تغيير الملف ✕" : isFr ? "Changer de fichier ✕" : "Change file ✕";
  const readyToSyncText = isAr ? "جاهز للتزامن والرفع لـ Google Drive" : isFr ? "Prêt à être synchronisé" : "Ready to be synced";

  const fullNameLabel = isAr ? "الاسم بالكامل *" : isFr ? "Nom complet *" : "Full Name *";
  const phoneLabel = isAr ? "رقم الهاتف أو المحمول *" : isFr ? "Numéro de téléphone *" : "Phone Number *";
  const emailLabel = isAr ? "البريد الإلكتروني *" : isFr ? "Adresse e-mail *" : "Email *";
  
  const targetJobLabel = isAr ? "المسمى الوظيفي المستهدف *" : isFr ? "Titre du poste cible *" : "Job Title *";
  const expLabel = isAr ? "سنوات الخبرة" : isFr ? "Années d'expérience" : "Years of Experience";
  const locationLabel = isAr ? "الدولة الحالية *" : isFr ? "Localisation actuelle *" : "Current Location *";
  const openToLabel = isAr ? "نوع العمل المفضل" : isFr ? "Type de contrat préféré" : "Open To";

  const btnNext = isAr ? "التالي" : isFr ? "Suivant" : "Next";
  const btnBack = isAr ? "السابق" : isFr ? "Précédent" : "Back";
  const btnSubmit = isAr ? "انضم الآن وتزامن مباشرة" : isFr ? "Rejoindre et synchroniser" : "Submit & Sync to Cloud Drive";
  const submittingText = isAr ? "جاري رفع السيرة وتحديث الشيت..." : isFr ? "Téléchargement en cours..." : "Processing & Uploading...";

  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto scroll-mt-24" id="upload-profile">
      
      {/* Step Indicator Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-sans text-lg font-extrabold text-slate-900">
            {isAr ? "أنشئ ملفك الشخصي" : isFr ? "Créez votre profil" : "Create Profile"}
          </h3>
          <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-black text-slate-500 font-mono">
            {activeStep} / 3
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1 mb-4">
          <div className={`h-full flex-1 rounded-full transition-all duration-300 ${activeStep >= 1 ? "bg-[#001639]" : "bg-slate-100"}`} />
          <div className={`h-full flex-1 rounded-full transition-all duration-300 ${activeStep >= 2 ? "bg-[#001639]" : "bg-slate-100"}`} />
          <div className={`h-full flex-1 rounded-full transition-all duration-300 ${activeStep >= 3 ? "bg-[#001639]" : "bg-slate-100"}`} />
        </div>

        {/* Labels below bar */}
        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span className={activeStep === 1 ? "text-[#001639]" : ""}>{stepTitles[0]}</span>
          <span className={activeStep === 2 ? "text-[#001639]" : ""}>{stepTitles[1]}</span>
          <span className={activeStep === 3 ? "text-[#001639]" : ""}>{stepTitles[2]}</span>
        </div>
      </div>

      {/* Main Wizard Form */}
      <form onSubmit={handleFormSubmit} className="space-y-6">
        
        {/* STEP 1: Upload Resume */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                dragActive ? "border-[#001639] bg-[#001639]/5 scale-[1.01]" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />

              {resumeFile ? (
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
                    <CheckCircle2 size={30} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 break-all">{resumeFile.name}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {readyToSyncText}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-bold hover:underline"
                  >
                    <Trash2 size={13} />
                    <span>{changeFileText}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 cursor-pointer" onClick={triggerFileInput}>
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
                    <Upload size={24} className="text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{uploadBoxLabel}</h4>
                    <p className="text-xs text-slate-400 mt-1">{uploadBoxSupport}</p>
                  </div>
                </div>
              )}
            </div>

            {hasDesignedResume && (
              <div className="bg-[#FAFAF6] border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-3 items-start sm:items-center text-start">
                  <span className="text-2xl mt-0.5 sm:mt-0">⚡</span>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                      {isAr ? "لديك سيرة متوافقة مع الـ ATS بالمحرر!" : "You have an ATS CV in your editor!"}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {isAr ? "تزامن تلقائي بضغطة زر مجهزة ومحفوظة." : "Auto-fill all your fields instantly with one tap."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onAutoFill();
                    setActiveStep(2);
                  }}
                  className="bg-[#001639] hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Sparkles size={13} />
                  <span>{isAr ? "تعبئة البيانات تلقائياً ⚡" : "Auto-fill ⚡"}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Personal Details */}
        {activeStep === 2 && (
          <div className="space-y-4 text-start">
            
            {hasDesignedResume && (
              <button
                type="button"
                onClick={onAutoFill}
                className="w-full bg-[#001639]/5 hover:bg-[#001639]/10 text-[#001639] font-extrabold text-xs py-3 rounded-xl transition-all border border-dashed border-[#001639]/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={13} />
                <span>{isAr ? "تعبئة البيانات من السيرة بالمحرر ⚡" : "Auto-fill from Editor Resume ⚡"}</span>
              </button>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                {fullNameLabel}
              </label>
              <input 
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isAr ? "احمد كمال" : "Ahmed Kamal"} 
                className="w-full font-bold px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-[#001639] focus:ring-1 focus:ring-[#001639] outline-none"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                {phoneLabel}
              </label>
              <input 
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={isAr ? "01000791165" : "+201000791165"} 
                className="w-full font-bold px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-[#001639] focus:ring-1 focus:ring-[#001639] outline-none font-mono"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                {emailLabel}
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmed.kamal@example.com" 
                className="w-full font-bold px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-[#001639] focus:ring-1 focus:ring-[#001639] outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Preferences & Confirm */}
        {activeStep === 3 && (
          <div className="space-y-4 text-start">
            
            {/* Job Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block" id="label-job-title">
                {targetJobLabel}
              </label>
              <input 
                id="target-job-title"
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder={isAr ? "مطور برمجيات واجهات" : "Senior Software Engineer"} 
                className="w-full font-bold px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-[#001639] focus:ring-1 focus:ring-[#001639] outline-none"
              />
            </div>

            {/* Years of Experience */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                {expLabel}
              </label>
              <div className="relative">
                <select 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full font-bold px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-[#001639] focus:ring-1 focus:ring-[#001639] outline-none appearance-none"
                >
                  <option>0–1 {isAr ? "سنة" : isFr ? "an" : "year"}</option>
                  <option>1–3 {isAr ? "سنوات" : isFr ? "ans" : "years"}</option>
                  <option>3–5 {isAr ? "سنوات" : isFr ? "ans" : "years"}</option>
                  <option>5–10 {isAr ? "سنوات" : isFr ? "ans" : "years"}</option>
                  <option>10+ {isAr ? "سنة" : isFr ? "ans" : "years"}</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                {locationLabel}
              </label>
              <div className="relative">
                <select 
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="w-full font-bold px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-[#001639] focus:ring-1 focus:ring-[#001639] outline-none appearance-none"
                >
                  <option>{isAr ? "مصر" : "Egypt"}</option>
                  <option>{isAr ? "السعودية" : "Saudi Arabia"}</option>
                  <option>{isAr ? "الإمارات" : "UAE"}</option>
                  <option>{isAr ? "الكويت" : "Kuwait"}</option>
                  <option>{isAr ? "الأردن" : "Jordan"}</option>
                  <option>{isAr ? "أخرى" : "Other"}</option>
                </select>
              </div>
            </div>

            {/* Open To */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                {openToLabel}
              </label>
              <div className="relative">
                <select 
                  value={openTo}
                  onChange={(e) => setOpenTo(e.target.value)}
                  className="w-full font-bold px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-[#001639] focus:ring-1 focus:ring-[#001639] outline-none appearance-none"
                >
                  <option>{isAr ? "عن بعد فقط" : isFr ? "Télétravail uniquement" : "Remote only"}</option>
                  <option>{isAr ? "عن بعد أو من المكتب" : isFr ? "Hybride" : "Remote or On-site"}</option>
                  <option>{isAr ? "من المكتب فقط" : isFr ? "Présentiel uniquement" : "On-site only"}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2">
            <Info size={14} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Wizard Footer Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-slate-100">
          {activeStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-6 py-3.5 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-sm text-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>{btnBack}</span>
            </button>
          )}

          {activeStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={activeStep === 1 && !resumeFile}
              className="flex-1 bg-[#001639] hover:bg-blue-700 disabled:bg-slate-250 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{btnNext}</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black py-4 px-6 rounded-2xl text-base transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{submittingText}</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>{btnSubmit}</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
      
      {/* Mini bottom features badge */}
      <div className="mt-6 flex justify-center gap-6 text-[10px] text-slate-400 font-bold">
        <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-500 shrink-0" /> {isAr ? "أمان البيانات 100%" : isFr ? "Données sécurisées" : "100% Secure"}</span>
        <span className="flex items-center gap-1">⚡ {isAr ? "تنبيه مقابلة فوري" : isFr ? "Alerte instantanée" : "Instant Alert"}</span>
        <span className="flex items-center gap-1">🌍 {isAr ? "ربط مرن وسريع" : isFr ? "Feuille temps réel" : "Realtime Sheet"}</span>
      </div>
    </div>
  );
}
