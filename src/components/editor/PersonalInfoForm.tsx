import React, { useState } from "react";
import { motion } from "motion/react";
import { ZodIssue } from "zod";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  FileText,
  Sparkles,
  AlertCircle,
  Calendar,
  Flag,
  Heart,
  Shield,
  CreditCard,
  Car,
  ChevronDown
} from "lucide-react";
import SectionTooltip from "./SectionTooltip";
import { personalInfoSchema } from "../../lib/validation";

import AISuggestion from "./AISuggestion";

const PersonalInfoForm = () => {
  const { language } = useLanguageStore();
  const t = (translations[language as keyof typeof translations] || translations.en).editor;
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo, settings } = data;
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showGCCFields, setShowGCCFields] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [_touched, setTouched] = useState<Record<string, boolean>>({});

  const lang = settings.language || "en";

  const validate = (name: string, value: string) => {
    const schema = personalInfoSchema(lang);
    const result = schema.safeParse({ ...personalInfo, [name]: value });

    if (!result.success) {
      const issues = result.error.issues;
      const fieldError = issues.find(
        (err: ZodIssue) => err.path[0] === name,
      );
      return fieldError ? fieldError.message : "";
    }
    return "";
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validate(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    updatePersonalInfo({ [name]: value });

    // Real-time validation
    const error = validate(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-150 font-sans transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="text-[11px] font-semibold text-slate-500 block mb-1"
          >
            {t.fullName} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <User
                className={`h-4 w-4 ${errors.fullName ? "text-rose-450" : "text-slate-400"}`}
              />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={personalInfo.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full ps-9 pe-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 font-medium ${
                errors.fullName
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              placeholder={t.fullName}
            />
            {errors.fullName && (
              <div className="absolute inset-y-0 end-0 pe-4 flex items-center pointer-events-none">
                <AlertCircle className="h-4 w-4 text-rose-500" />
              </div>
            )}
          </div>
          {errors.fullName && (
            <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="jobTitle"
            className="text-[11px] font-semibold text-slate-500 block mb-1"
          >
            {t.jobTitle} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <FileText
                className={`h-4 w-4 ${errors.jobTitle ? "text-rose-450" : "text-slate-400"}`}
              />
            </div>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={personalInfo.jobTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full ps-9 pe-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 font-medium ${
                errors.jobTitle
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              placeholder={t.jobTitle}
            />
            {errors.jobTitle && (
              <div className="absolute inset-y-0 end-0 pe-4 flex items-center pointer-events-none">
                <AlertCircle className="h-4 w-4 text-rose-500" />
              </div>
            )}
          </div>
          {errors.jobTitle && (
            <p className="text-xs text-rose-500 mt-1">{errors.jobTitle}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-[11px] font-semibold text-slate-500 block mb-1">
            {t.email} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <Mail
                className={`h-4 w-4 ${errors.email ? "text-rose-455" : "text-slate-400"}`}
              />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={personalInfo.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full ps-9 pe-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 font-medium ${
                errors.email
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              placeholder={t.email}
            />
            {errors.email && (
              <div className="absolute inset-y-0 end-0 pe-4 flex items-center pointer-events-none">
                <AlertCircle className="h-4 w-4 text-rose-500" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-[11px] font-semibold text-slate-500 block mb-1">
            {t.phone}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={personalInfo.phone}
              onChange={handleChange}
              className="block w-full ps-10 pe-4 py-3 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all bg-white text-slate-900 placeholder-slate-450 font-medium"
              placeholder={t.phone}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="address"
            className="text-[11px] font-semibold text-slate-500 block mb-1"
          >
            {t.address}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="address"
              name="address"
              value={personalInfo.address}
              onChange={handleChange}
              className="block w-full ps-10 pe-4 py-3 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all bg-white text-slate-900 placeholder-slate-450 font-medium"
              placeholder={t.address}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="linkedin"
            className="text-[11px] font-semibold text-slate-500 block mb-1"
          >
            {t.linkedin}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <Linkedin className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={personalInfo.linkedin}
              onChange={handleChange}
              className="block w-full ps-10 pe-4 py-3 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all bg-white text-slate-900 placeholder-slate-450 font-medium"
              placeholder={t.linkedin}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="github"
            className="text-[11px] font-semibold text-slate-500 block mb-1"
          >
            {t.github}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <Github className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="url"
              id="github"
              name="github"
              value={personalInfo.github || ""}
              onChange={handleChange}
              className="block w-full ps-10 pe-4 py-3 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all bg-white text-slate-900 placeholder-slate-450 font-medium"
              placeholder={t.github}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="portfolio"
            className="text-[11px] font-semibold text-slate-500 block mb-1"
          >
            {t.website}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <Globe className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="url"
              id="portfolio"
              name="portfolio"
              value={personalInfo.portfolio || ""}
              onChange={handleChange}
              className="block w-full ps-10 pe-4 py-3 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all bg-white text-slate-900 placeholder-slate-455 font-medium"
              placeholder={t.website}
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label
                htmlFor="summary"
                className="text-[11px] font-semibold text-slate-500 block mb-1"
              >
                {t.summary}
              </label>
              <SectionTooltip
                title={t.summaryTips}
                content={t.summaryDesc}
                example={t.summaryExample}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="text-xs font-bold text-brand-600 flex items-center gap-1 bg-brand-50/50 hover:bg-brand-50 border border-brand-100/30 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                          title={language === "ar" ? "أعد صياغة النص باحترافية عبر الذكاء الاصطناعي" : "Rewrite to be more professional"}
            >
              <Sparkles size={14} />
              {language === "ar" ? "تحسين بالذكاء الاصطناعي" : "Improve with AI"}
            </button>
          </div>

          {showAISuggestions && (
            <div className="mb-2">
              <AISuggestion
                currentValue={personalInfo.summary}
                onApply={(newText) => {
                  updatePersonalInfo({ summary: newText });
                  setShowAISuggestions(false);
                }}
                context={`Job Title: ${personalInfo.jobTitle}`}
              />
            
            </div>
          )}

          <div className="relative">
          <textarea
            id="summary"
            name="summary"
            rows={5}
            value={personalInfo.summary}
            onChange={handleChange}
            className="block w-full p-4 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all resize-y bg-white text-slate-900 placeholder-slate-400 font-medium leading-relaxed"
            placeholder={t.summaryPlaceholder}
          />
          <div className="mt-2 text-[10px] text-slate-400 flex items-start sm:items-center justify-between gap-4 px-2 leading-tight flex-col sm:flex-row">
            <div className="flex items-center gap-1 opacity-70">
              <Sparkles size={10} className="text-brand-400 shrink-0" />
              {language === "ar" 
                ? "يتم إرسال النص أعلاه فقط بشكل مشفر لتخصيص محتواك."
                : "Only the text snippet above is sent anonymously to generate tailored content."}
            </div>
            <div className={`font-mono font-medium ${(personalInfo.summary?.length || 0) > 500 ? "text-amber-500" : "text-slate-400"}`}>
              {personalInfo.summary?.length || 0} / 500
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 px-2">{t.summaryFooter}</p>
          </div>
        </div>

        {/* Middle East & GCC Recruitment Fields Collapsible */}
        <div className="col-span-1 md:col-span-2 border border-dashed border-slate-200 hover:border-[#FF4D2D]/35 rounded-2xl p-4 transition-all bg-white shadow-3xs mt-2">
          <button
            type="button"
            onClick={() => setShowGCCFields(!showGCCFields)}
            className="flex items-center justify-between w-full text-start text-slate-700 font-bold text-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🌍</span>
              <div>
                <span>{language === "ar" ? "بيانات التوظيف لدول الخليج والشرق الأوسط (اختياري)" : "MENA & GCC Premium Recruiting Fields (Optional)"}</span>
                <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                  {language === "ar" ? "تاريخ الميلاد، الجنسية، الحالة الاجتماعية، التأشيرة والخدمة العسكرية" : "Date of Birth, Nationality, Marital, Visa & Military status"}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showGCCFields ? "rotate-180 text-[#FF4D2D]" : "text-slate-400"}`} />
          </button>

          {showGCCFields && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100"
            >
              <div className="space-y-2">
                <label htmlFor="birthDate" className="text-xs font-medium text-slate-600">
                  {t.birthDate}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={personalInfo.birthDate || ""}
                    onChange={handleChange}
                    className="block w-full ps-10 pe-4 py-3 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm bg-white text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="nationality" className="text-xs font-medium text-slate-600">
                  {t.nationality}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                    <Flag className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    value={personalInfo.nationality || ""}
                    onChange={handleChange}
                    className="block w-full ps-10 pe-4 py-3 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm bg-white text-slate-900 placeholder-slate-400"
                    placeholder={language === "ar" ? "مثال: مصري، سعودي" : "e.g. Saudi, Egyptian"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="maritalStatus" className="text-xs font-medium text-slate-600">
                  {t.maritalStatus}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                    <Heart className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="maritalStatus"
                    name="maritalStatus"
                    value={personalInfo.maritalStatus || ""}
                    onChange={handleChange}
                    className="block w-full ps-10 pe-4 py-3 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm bg-white text-slate-900 placeholder-slate-405"
                    placeholder={language === "ar" ? "مثال: أعزل، متزوج" : "e.g. Single, Married"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="visaStatus" className="text-xs font-medium text-slate-600">
                  {t.visaStatus}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="visaStatus"
                    name="visaStatus"
                    value={personalInfo.visaStatus || ""}
                    onChange={handleChange}
                    className="block w-full ps-10 pe-4 py-3 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm bg-white text-slate-900 placeholder-slate-405"
                    placeholder={language === "ar" ? "مثال: إقامة قابلة للنقل، مواطن" : "e.g. Transferable Iqama, Citizen"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="militaryStatus" className="text-xs font-medium text-slate-600">
                  {t.militaryStatus}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                    <Shield className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="militaryStatus"
                    name="militaryStatus"
                    value={personalInfo.militaryStatus || ""}
                    onChange={handleChange}
                    className="block w-full ps-10 pe-4 py-3 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm bg-white text-slate-900 placeholder-slate-405"
                    placeholder={language === "ar" ? "مثال: معفى، قدّم الخدمة" : "e.g. Exempted, Completed"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="drivingLicense" className="text-xs font-medium text-slate-600">
                  {t.drivingLicense}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                    <Car className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="drivingLicense"
                    name="drivingLicense"
                    value={personalInfo.drivingLicense || ""}
                    onChange={handleChange}
                    className="block w-full ps-10 pe-4 py-3 border border-slate-200 hover:border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm bg-white text-slate-900 placeholder-slate-405"
                    placeholder={language === "ar" ? "مثال: رخصة قيادة سعودية خاصة" : "e.g. Valid GCC Driving License"}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default PersonalInfoForm;
