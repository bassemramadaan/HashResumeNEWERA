import React, { useState, Suspense, lazy } from "react";
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
} from "lucide-react";
import SectionTooltip from "./SectionTooltip";
import { personalInfoSchema } from "../../lib/validation";

const AISuggestion = lazy(() => import("./AISuggestion"));

const PersonalInfoForm = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo, settings } = data;
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

    if (touched[name]) {
      const error = validate(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  return (
    <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 font-sans transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="text-sm font-medium text-slate-700"
          >
            {t.fullName} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <User
                className={`h-4 w-4 ${errors.fullName ? "text-rose-400" : "text-slate-500 "}`}
              />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={personalInfo.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full ps-10 pe-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-slate-50 text-slate-900 placeholder-slate-400 ${
                errors.fullName
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                  : "border-slate-200 "
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
            className="text-sm font-medium text-slate-700"
          >
            {t.jobTitle} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <FileText
                className={`h-4 w-4 ${errors.jobTitle ? "text-rose-400" : "text-slate-500 "}`}
              />
            </div>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={personalInfo.jobTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full ps-10 pe-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-slate-50 text-slate-900 placeholder-slate-400 ${
                errors.jobTitle
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                  : "border-slate-200 "
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
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            {t.email} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <Mail
                className={`h-4 w-4 ${errors.email ? "text-rose-400" : "text-slate-400 "}`}
              />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={personalInfo.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full ps-10 pe-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-slate-50 text-slate-900 placeholder-slate-400 ${
                errors.email
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                  : "border-slate-200 "
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
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
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
              className="block w-full ps-10 pe-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-slate-50 text-slate-900 placeholder-slate-400"
              placeholder={t.phone}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="address"
            className="text-sm font-medium text-slate-700"
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
              className="block w-full ps-10 pe-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-slate-50 text-slate-900 placeholder-slate-400"
              placeholder={t.address}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="linkedin"
            className="text-sm font-medium text-slate-700"
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
              className="block w-full ps-10 pe-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-slate-50 text-slate-900 placeholder-slate-400"
              placeholder={t.linkedin}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="github"
            className="text-sm font-medium text-slate-700"
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
              className="block w-full ps-10 pe-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-slate-50 text-slate-900 placeholder-slate-400"
              placeholder={t.github}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="portfolio"
            className="text-sm font-medium text-slate-700"
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
              className="block w-full ps-10 pe-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors bg-slate-50 text-slate-900 placeholder-slate-400"
              placeholder={t.website}
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label
                htmlFor="summary"
                className="text-sm font-medium text-slate-700"
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
              className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-full transition-colors"
            >
              <Sparkles size={12} />
              {t.aiSuggestions}
            </button>
          </div>

          {showAISuggestions && (
            <Suspense
              fallback={
                <div className="h-20 animate-pulse bg-slate-100 rounded-xl mb-4" />
              }
            >
              <AISuggestion
                currentValue={personalInfo.summary}
                onApply={(newText) => {
                  updatePersonalInfo({ summary: newText });
                  setShowAISuggestions(false);
                }}
                context={`Job Title: ${personalInfo.jobTitle}`}
              />
            </Suspense>
          )}

          <textarea
            id="summary"
            name="summary"
            rows={4}
            value={personalInfo.summary}
            onChange={handleChange}
            className="block w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-none bg-slate-50 text-slate-900 placeholder-slate-400"
            placeholder={t.summaryPlaceholder}
          />
          <p className="text-xs text-white0 mt-1">{t.summaryFooter}</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
