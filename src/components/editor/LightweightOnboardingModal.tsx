import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  GraduationCap, 
  Briefcase, 
  Palette, 
  Building2, 
  FileText,
  Compass
} from "lucide-react";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useResumeStore, ResumeData } from "../../store/useResumeStore";
import { cn } from "../../lib/utils";

interface LightweightOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type ExperienceLevelOption = "freshGrad" | "experienced" | "creative" | "corporate" | "none";

export const RESUME_TEMPLATES_CONFIG = [
  {
    id: "modern",
    nameEn: "Modern",
    nameAr: "حديث",
    nameFr: "Moderne",
    badgeEn: "Tech & Software",
    badgeAr: "برمجيات وتقنية",
    badgeFr: "Tech & Logiciel",
    descEn: "Clean, structured design with balanced line spacing. Ideal for software engineering & startups.",
    descAr: "تصميم عصري ونظيف مع توازن ممتاز في المسافات. مثالي للبرمجة والتقنية والشركات الناشئة.",
    descFr: "Design épuré et contemporain, idéal pour le développement et les startups.",
    accentColor: "#2563FF",
    previewBg: "from-blue-50 to-indigo-50",
  },
  {
    id: "classic",
    nameEn: "Classic",
    nameAr: "كلاسيكي",
    nameFr: "Classique",
    badgeEn: "Banking & Law",
    badgeAr: "قانون ومالية",
    badgeFr: "Banque & Droit",
    descEn: "Traditional single-column layout. Trusted by corporate firms, legal offices & banks.",
    descAr: "تنسيق تقليدي كلاسيكي بأسلوب موثوق لدى الشركات الكبرى والبنوك وقطاع المحاماة.",
    descFr: "Format traditionnel à colonne unique. Recommandé pour les banques et le droit.",
    accentColor: "#1E293B",
    previewBg: "from-slate-50 to-stone-50",
  },
  {
    id: "executive",
    nameEn: "Executive",
    nameAr: "تنفيذي",
    nameFr: "Exécutif",
    badgeEn: "Leadership & C-Suite",
    badgeAr: "قيادي وتنفيذي",
    badgeFr: "Direction & Cadres",
    descEn: "Prestigious header layout highlighting achievements and management background.",
    descAr: "هيدر بارز وفخم يركز على الإنجازات والقدرات القيادية العالية والمدراء.",
    descFr: "Mise en page prestigieuse mettant en valeur le leadership et les réalisations.",
    accentColor: "#8B5CF6",
    previewBg: "from-purple-50 to-violet-50",
  },
  {
    id: "minimal",
    nameEn: "Minimal",
    nameAr: "بسيط",
    nameFr: "Minimaliste",
    badgeEn: "Freshers & Academics",
    badgeAr: "خريجون وأكاديمي",
    badgeFr: "Débutants & Éducation",
    descEn: "Focuses strictly on content readability and crisp typography. Great for students & entry level.",
    descAr: "تصميم بسيط ومباشر يركز كلياً على وضوح المحتوى النصي. ممتاز للخريجين الجدد.",
    descFr: "Priorité absolue à la lisibilité du texte. Parfait pour les débutants et étudiants.",
    accentColor: "#475569",
    previewBg: "from-gray-50 to-slate-50",
  },
  {
    id: "timeline",
    nameEn: "Timeline",
    nameAr: "جدول زمني",
    nameFr: "Chronologique",
    badgeEn: "Career Growth",
    badgeAr: "تسلسل مهني",
    badgeFr: "Parcours Évolutif",
    descEn: "Chronological vertical track connecting your career milestones seamlessly.",
    descAr: "يعرض خبراتك المتراكمة ومسيرتك التعليمية على خط زمني متسق ومبتكر.",
    descFr: "Affiche vos étapes de carrière sur un axe chronologique fluide.",
    accentColor: "#059669",
    previewBg: "from-emerald-50 to-teal-50",
  },
  {
    id: "two-column",
    nameEn: "Two-Column",
    nameAr: "عمودين",
    nameFr: "Deux Colonnes",
    badgeEn: "Design & Marketing",
    badgeAr: "تصميم وتسويق",
    badgeFr: "Design & Marketing",
    descEn: "Distinct sidebar for contact & skills. Highly effective for creative & marketing roles.",
    descAr: "عمود جانبي مميز للمهارات والتواصل. فعال جداً لأدوار التصميم والتسويق والإعلام.",
    descFr: "Barre latérale pratique pour les compétences. Idéal pour les créatifs.",
    accentColor: "#0EA5E9",
    previewBg: "from-sky-50 to-cyan-50",
  }
];

export default function LightweightOnboardingModal({
  isOpen,
  onClose,
}: LightweightOnboardingModalProps) {
  const { language, setLanguage } = useLanguageStore();
  const { data, updateSettings, setIsStarted, setHasCompletedOnboarding, loadRoleTemplate } = useResumeStore();

  const [step, setStep] = useState<number>(1);
  const [selectedExp, setSelectedExp] = useState<ExperienceLevelOption>("none");
  const [selectedTemplate, setSelectedTemplate] = useState<string>(data.settings?.template || "modern");
  const [sampleChoice, setSampleChoice] = useState<"blank" | "developer" | "accountant" | "designer">("blank");

  const isRtl = language === "ar";

  if (!isOpen) return null;

  const handleLanguageChange = (lang: "en" | "ar" | "fr") => {
    setLanguage(lang);
    updateSettings({ language: lang });
  };

  const handleSkip = () => {
    setHasCompletedOnboarding(true);
    setIsStarted(true);
    onClose();
  };

  const handleExpSelect = (exp: ExperienceLevelOption) => {
    setSelectedExp(exp);
    if (exp === "freshGrad") {
      updateSettings({ isFreshGrad: true, template: "minimal" });
      setSelectedTemplate("minimal");
    } else if (exp === "experienced") {
      updateSettings({ isFreshGrad: false, template: "modern" });
      setSelectedTemplate("modern");
    } else if (exp === "creative") {
      updateSettings({ isFreshGrad: false, template: "two-column" });
      setSelectedTemplate("two-column");
    } else if (exp === "corporate") {
      updateSettings({ isFreshGrad: false, template: "classic" });
      setSelectedTemplate("classic");
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    updateSettings({ template: templateId as ResumeData["settings"]["template"] });
  };

  const handleFinish = () => {
    if (sampleChoice !== "blank") {
      const roleId = sampleChoice;
      loadRoleTemplate(roleId, language === "ar" ? "ar" : "en");
      updateSettings({ template: selectedTemplate as ResumeData["settings"]["template"] });
    }
    setHasCompletedOnboarding(true);
    setIsStarted(true);
    onClose();
  };

  const isRecommended = (templateId: string) => {
    if (selectedExp === "freshGrad" && (templateId === "minimal" || templateId === "modern")) return true;
    if (selectedExp === "experienced" && (templateId === "modern" || templateId === "executive")) return true;
    if (selectedExp === "creative" && (templateId === "two-column" || templateId === "modern")) return true;
    if (selectedExp === "corporate" && (templateId === "classic" || templateId === "executive")) return true;
    return false;
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-black text-sm">
              #
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block leading-none">
                {language === "ar" ? "إعداد سريع (الخطوة " + step + " من 4)" : language === "fr" ? "Configuration (" + step + "/4)" : "Quick Setup (" + step + " of 4)"}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">
                {step === 1 && (language === "ar" ? "مرحباً بك في هاش سيرة" : language === "fr" ? "Bienvenue sur HashResume" : "Welcome to HashResume")}
                {step === 2 && (language === "ar" ? "الهدف والمستوى المهني" : language === "fr" ? "Niveau & Objectif" : "Your Role & Goal")}
                {step === 3 && (language === "ar" ? "اختر قالب السيرة الذاتية" : language === "fr" ? "Choix du modèle" : "Select Your Template")}
                {step === 4 && (language === "ar" ? "جاهز للبدء!" : language === "fr" ? "Prêt à commencer !" : "Ready to Start!")}
              </h2>
            </div>
          </div>

          <button
            onClick={handleSkip}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{language === "ar" ? "تخطي للمحرر" : language === "fr" ? "Passer" : "Skip to Editor"}</span>
            <X size={14} />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full h-1 bg-slate-100">
          <div 
            className="h-full bg-brand-600 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {/* STEP 1: WELCOME & LANGUAGE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: isRtl ? 15 : -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? -15 : 15 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
                    <span>{language === "ar" ? "سيرة ذاتية متوافقة مع الـ ATS في دقائق" : language === "fr" ? "CV compatible ATS en quelques minutes" : "ATS-Optimized Resume Builder"}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {language === "ar" ? "أنشئ سيرتك الذاتية باحترافية وسهولة" : language === "fr" ? "Créez votre CV professionnel rapidement" : "Build a Standout Professional Resume"}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    {language === "ar"
                      ? "اختر لغتك المفضلة وابدأ مباشرة بدون تعقيدات أو إنشاء حساب."
                      : language === "fr"
                      ? "Choisissez votre langue et commencez immédiatement sans inscription."
                      : "Choose your language and pick a clean template to get started instantly."}
                  </p>
                </div>

                {/* Language Switcher Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block text-start">
                    {language === "ar" ? " اختر لغة التطبيق والسيرة:" : language === "fr" ? " Langue de l'application & du CV :" : " Select Language:"}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { code: "en", label: "English", flag: "🇺🇸" },
                      { code: "ar", label: "العربية", flag: "🇸🇦" },
                      { code: "fr", label: "Français", flag: "🇫🇷" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code as "en" | "ar" | "fr")}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer min-h-[64px]",
                          language === lang.code
                            ? "border-brand-600 bg-brand-50/60 text-brand-900 shadow-xs"
                            : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                        )}
                      >
                        <span className="text-lg mb-1">{lang.flag}</span>
                        <span className="text-xs font-black">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {language === "ar" ? "تنسيق ATS نظيف" : language === "fr" ? "Compatible ATS" : "ATS-Ready Layout"}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        {language === "ar" ? "تخطي الفرز الآلي بسهولة" : language === "fr" ? "Mise en page lisible" : "Parsed reliably by systems"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {language === "ar" ? "خصوصية 100%" : language === "fr" ? "100% Privé" : "100% Private"}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        {language === "ar" ? "بياناتك تحفظ في متصفحك" : language === "fr" ? "Stocké dans votre navigateur" : "Saved strictly in browser"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {language === "ar" ? "تعديل مجاني" : language === "fr" ? "Édition Gratuite" : "Free Editing"}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        {language === "ar" ? "ادفع فقط عند تحميل PDF" : language === "fr" ? "Payez seulement à l'export" : "Pay only when downloading"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: EXPERIENCE & GOAL */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: isRtl ? 15 : -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? -15 : 15 }}
                className="space-y-6"
              >
                <div className="text-start space-y-1">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {language === "ar" ? "ما هو مستواك المهني حالياً؟" : language === "fr" ? "Quel est votre niveau d'expérience ?" : "What is your current experience level?"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {language === "ar"
                      ? "يساعدنا هذا في توصية أنسب قالب وتنسيق لسيرتك الذاتية."
                      : language === "fr"
                      ? "Cela nous aide à vous recommander le modèle le plus adapté."
                      : "This helps us suggest the best template structure for your profile."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "freshGrad",
                      icon: <GraduationCap className="w-5 h-5 text-purple-600" />,
                      titleAr: "طالب / حديث تخرج",
                      titleEn: "Student / Fresh Graduate",
                      titleFr: "Étudiant / Nouveau diplômé",
                      descAr: "التركيز على التعليم، المشاريع، والمهارات",
                      descEn: "Highlights education, academic projects & skills",
                      descFr: "Met en valeur les études et compétences",
                      recommended: "Minimal"
                    },
                    {
                      id: "experienced",
                      icon: <Briefcase className="w-5 h-5 text-blue-600" />,
                      titleAr: "خبرة محترفة / خبير",
                      titleEn: "Experienced Professional",
                      titleFr: "Professionnel expérimenté",
                      descAr: "التركيز على مسار الخبرات العملية والإنجازات",
                      descEn: "Highlights work experience & achievements",
                      descFr: "Met en valeur les expériences professionnelles",
                      recommended: "Modern"
                    },
                    {
                      id: "creative",
                      icon: <Palette className="w-5 h-5 text-sky-600" />,
                      titleAr: "إبداعي / تصميم / تسويق",
                      titleEn: "Creative / Design / Marketing",
                      titleFr: "Créatif / Design / Marketing",
                      descAr: "تنسيق أنيق بعمود جانبي للمهارات والمشاريع",
                      descEn: "Sleek sidebar layout for skills & portfolio",
                      descFr: "Mise en page élégante à deux colonnes",
                      recommended: "Two-Column"
                    },
                    {
                      id: "corporate",
                      icon: <Building2 className="w-5 h-5 text-slate-700" />,
                      titleAr: "شركات / مالية / قانون",
                      titleEn: "Corporate / Finance / Law",
                      titleFr: "Entreprise / Finance / Droit",
                      descAr: "تنسيق رسمّي موثوق معتمد لدى البنوك والشركات",
                      descEn: "Formal traditional layout trusted by corporations",
                      descFr: "Format traditionnel très formel et épuré",
                      recommended: "Classic"
                    }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleExpSelect(item.id as ExperienceLevelOption)}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-start transition-all cursor-pointer flex items-start gap-3.5 relative",
                        selectedExp === item.id
                          ? "border-brand-600 bg-brand-50/50 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div className="flex-1 pr-6 rtl:pr-0 rtl:pl-6">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {language === "ar" ? item.titleAr : language === "fr" ? item.titleFr : item.titleEn}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {language === "ar" ? item.descAr : language === "fr" ? item.descFr : item.descEn}
                        </p>
                      </div>

                      {selectedExp === item.id && (
                        <div className="absolute top-3 end-3 w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Honest ATS Disclaimer Notice */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                  <Compass className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-amber-900 leading-relaxed">
                    {language === "ar"
                      ? "تضمن جميع القوالب تنسيقاً نظيفاً وقابلية قراءة ممتازة لأنظمة الفرز الآلي (ATS). تذكر أن جودة المحتوى المكتوب والمهارات هي الأساس لإبراز سيرتك."
                      : language === "fr"
                      ? "Tous les modèles garantissent une mise en page claire et lisible par les outils ATS. La qualité de votre contenu reste l'élément clé."
                      : "All templates provide clean formatting and reliable parser compatibility for ATS tools. High-quality content & relevant skills are key to landing interviews."}
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: TEMPLATE SELECTION */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: isRtl ? 15 : -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? -15 : 15 }}
                className="space-y-4"
              >
                <div className="text-start space-y-1">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {language === "ar" ? "اختر القالب المناسب لسيرتك" : language === "fr" ? "Choisissez votre modèle" : "Choose Your Template"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {language === "ar"
                      ? "يمكنك تغيير القالب في أي وقت أثناء التحرير دون فقدان أي بيانات."
                      : language === "fr"
                      ? "Vous pourrez changer de modèle à tout moment sans perdre vos données."
                      : "You can switch templates at any time later in the editor without losing any data."}
                  </p>
                </div>

                {/* Grid of Templates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto p-1">
                  {RESUME_TEMPLATES_CONFIG.map((tmpl) => {
                    const recommended = isRecommended(tmpl.id);
                    const isSelected = selectedTemplate === tmpl.id;
                    const name = language === "ar" ? tmpl.nameAr : language === "fr" ? tmpl.nameFr : tmpl.nameEn;
                    const badge = language === "ar" ? tmpl.badgeAr : language === "fr" ? tmpl.badgeFr : tmpl.badgeEn;
                    const desc = language === "ar" ? tmpl.descAr : language === "fr" ? tmpl.descFr : tmpl.descEn;

                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => handleTemplateSelect(tmpl.id)}
                        className={cn(
                          "p-4 rounded-2xl border-2 text-start transition-all cursor-pointer relative flex flex-col justify-between space-y-3",
                          isSelected
                            ? "border-brand-600 bg-brand-50/40 shadow-sm ring-2 ring-brand-600/20"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                        )}
                      >
                        {/* Top Info & Recommended Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-black text-slate-900">{name}</h3>
                              {recommended && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                                  <Sparkles size={10} />
                                  {language === "ar" ? "موصى به" : language === "fr" ? "Recommandé" : "Recommended"}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                              {badge}
                            </span>
                          </div>

                          <div 
                            className="w-5 h-5 rounded-full border border-slate-300 shrink-0 flex items-center justify-center transition-colors"
                            style={{ backgroundColor: isSelected ? tmpl.accentColor : "transparent", borderColor: isSelected ? tmpl.accentColor : "" }}
                          >
                            {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                          </div>
                        </div>

                        {/* Mini Visual Preview Card */}
                        <div className={cn("h-16 rounded-xl border border-slate-200/80 p-2 flex flex-col justify-between bg-gradient-to-br", tmpl.previewBg)}>
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-slate-300" style={{ backgroundColor: tmpl.accentColor }} />
                            <div className="h-2 w-20 bg-slate-200 rounded-full" />
                          </div>
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-slate-200/80 rounded-full" />
                            <div className="h-1.5 w-3/4 bg-slate-200/80 rounded-full" />
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-snug">
                          {desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: FINISH & LAUNCH */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: isRtl ? 15 : -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? -15 : 15 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                    🚀
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    {language === "ar" ? "أنت جاهز للبدء الآن!" : language === "fr" ? "Vous êtes prêt !" : "You're All Set!"}
                  </h2>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {language === "ar"
                      ? "تم إعداد سيرتك الذاتية بالقالب واللغة المحددة. يمكنك إضافة بياناتك أو البدء بمثال تجريبي."
                      : language === "fr"
                      ? "Votre CV est configuré. Vous pouvez remplir vos informations ou charger un exemple."
                      : "Your resume is configured. You can start filling in your info or load a sample template."}
                  </p>
                </div>

                {/* Selected Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider text-start">
                    {language === "ar" ? "ملخص الإعدادات المختارة" : language === "fr" ? "Résumé de votre choix" : "Selected Configuration"}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-start">
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        {language === "ar" ? "القالب" : language === "fr" ? "Modèle" : "Template"}
                      </span>
                      <span className="text-xs font-black text-slate-800 capitalize">
                        {selectedTemplate}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        {language === "ar" ? "اللغة" : language === "fr" ? "Langue" : "Language"}
                      </span>
                      <span className="text-xs font-black text-slate-800 uppercase">
                        {language === "ar" ? "العربية (AR)" : language === "fr" ? "Français (FR)" : "English (EN)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Initial Start Options */}
                <div className="space-y-2 text-start">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === "ar" ? "اختر نقطة البداية:" : language === "fr" ? "Point de départ :" : "How do you want to start?"}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setSampleChoice("blank")}
                      className={cn(
                        "p-3.5 rounded-2xl border-2 text-start transition-all cursor-pointer flex items-center gap-3",
                        sampleChoice === "blank"
                          ? "border-brand-600 bg-brand-50/50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <FileText className="w-5 h-5 text-slate-600 shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">
                          {language === "ar" ? "نموذج فارغ" : language === "fr" ? "CV vierge" : "Start from Scratch"}
                        </h5>
                        <p className="text-[10px] text-slate-500">
                          {language === "ar" ? "إدخال بياناتك اليدوية مباشرة" : language === "fr" ? "Remplissez vos informations" : "Enter your info manually"}
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setSampleChoice("developer")}
                      className={cn(
                        "p-3.5 rounded-2xl border-2 text-start transition-all cursor-pointer flex items-center gap-3",
                        sampleChoice === "developer"
                          ? "border-brand-600 bg-brand-50/50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">
                          {language === "ar" ? "نموذج تجريبي جاهز" : language === "fr" ? "Exemple pré-rempli" : "Load Sample Data"}
                        </h5>
                        <p className="text-[10px] text-slate-500">
                          {language === "ar" ? "تعبئة بيانات توضيحية للتعديل عليها" : language === "fr" ? "Charge un exemple à modifier" : "Pre-fill with sample content"}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
              <span>{language === "ar" ? "السابق" : language === "fr" ? "Précédent" : "Back"}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>{language === "ar" ? "التالي" : language === "fr" ? "Suivant" : "Next"}</span>
              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-brand-600/20 active:scale-98"
            >
              <span>{language === "ar" ? "ابدأ تحرير السيرة الذاتية ✨" : language === "fr" ? "Commencer à modifier ✨" : "Start Editing Resume ✨"}</span>
              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
