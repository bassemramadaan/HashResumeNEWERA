import React, { useState, useMemo } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  AlertCircle,
  GripVertical,
} from "lucide-react";
import { Reorder } from "motion/react";
import SectionTooltip from "./SectionTooltip";
import { getJobMatchResults } from "../../utils/ats";

import AISuggestion from "./AISuggestion";
import FormSkeleton from "./FormSkeleton";

const ExperienceForm = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const {
    data,
    isHydrated,
    addExperience,
    updateExperience,
    removeExperience,
    updateData,
  } = useResumeStore();

  const [expandedId, setExpandedId] = useState<string | null>(
    data.experience[0]?.id || null,
  );
  const [showAISuggestionFor, setShowAISuggestionFor] = useState<string | null>(
    null,
  );

  const matchResults = useMemo(() => getJobMatchResults(data), [data]);

  if (!isHydrated) {
    return <FormSkeleton />;
  }

  const { experience, jobDescription } = data;

  const handleAdd = () => {
    addExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleReorder = (newOrder: typeof experience) => {
    updateData({ ...data, experience: newOrder });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionTooltip
            title={String(t.experience?.title || "")}
            content={String(t.experience?.tooltipDesc || "Add your work experience, starting with the most recent.")}
            example={String(t.experience?.tooltipExample || "e.g., Senior Software Engineer at Google")}
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-slate-50 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200"
        >
          <Plus size={16} />
          {String(t.experience?.add || "")}
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 border-dashed text-center text-slate-500">
          {String(t.experience?.noExperience || "")}
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={experience}
          onReorder={handleReorder}
          className="space-y-4"
        >
          {experience.map((exp) => (
            <Reorder.Item
              key={exp.id}
              value={exp}
              className="bg-slate-50 rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all"
            >
              <div
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === exp.id ? null : exp.id)
                }
              >
                <div className="flex items-center gap-4">
                  <div
                    className="cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-slate-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {exp.position || String(t.experience?.notSpecified || "")}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {exp.company || String(t.experience?.company || "")} •{" "}
                      {exp.startDate || String(t.experience?.startDate || "")} - {exp.endDate || String(t.experience?.endDate || "")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-4 md:gap-4 lg:gap-4 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const { id: _id, ...rest } = exp;
                      addExperience(rest);
                    }}
                    className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors shrink-0"
                    title={String(t.experience?.duplicate || "")}
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExperience(exp.id);
                    }}
                    className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title={String(t.experience?.remove || "")}
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                    {expandedId === exp.id ? (
                      <ChevronUp size={20} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={20} className="text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedId === exp.id && (
                <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {String(t.experience?.position || "")}
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(exp.id, { position: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder={String(t.experience?.position || "")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {String(t.experience?.company || "")}
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, { company: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder={String(t.experience?.company || "")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {String(t.experience?.startDate || "")}
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(exp.id, {
                            startDate: e.target.value,
                          })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {String(t.experience?.endDate || "")}
                      </label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(exp.id, { endDate: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder={String(t.experience?.endDate || "")}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium text-slate-700">
                            {String(t.experience?.description || "")}
                          </label>
                          <SectionTooltip
                            title={String(t.experience?.experienceTips || "")}
                            content={String(t.experience?.experienceDescTips || "")}
                            example={String(t.experience?.experienceExample || "")}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setShowAISuggestionFor(
                              showAISuggestionFor === exp.id ? null : exp.id,
                            )
                          }
                          className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                          title={language === "ar" ? "أعد صياغة النص باحترافية عبر الذكاء الاصطناعي" : "Rewrite to be more professional"}
                        >
                          <Sparkles size={14} />
                          {language === "ar" ? "تحسين بالذكاء الاصطناعي" : "Improve with AI"}
                        </button>
                      </div>

                      {showAISuggestionFor === exp.id && (
                        <div className="mb-2">
                          <AISuggestion
                            currentValue={exp.description}
                            onApply={(newText) => {
                              updateExperience(exp.id, {
                                description: newText,
                              });
                              setShowAISuggestionFor(null);
                            }}
                            context={`Job Title: ${exp.position}, Company: ${exp.company}`}
                          />
                        </div>
                      )}
                      
                      <div className="relative">
                        <textarea
                          rows={6}
                          value={exp.description}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              description: e.target.value,
                            })
                          }
                          className="block w-full p-4 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-y placeholder-slate-400 font-mono leading-relaxed"
                          placeholder={String(t.experience?.descriptionPlaceholder || "")}
                        />

                        {/* Smart Auto-Complete Duties Based on Position */}
                        {exp.position && (
                          <div className="mt-3 bg-slate-100/60 p-3 rounded-xl border border-slate-200/50">
                            <h4 className="text-[11px] font-bold text-slate-600 mb-2 flex items-center gap-1.5 align-middle">
                              <Sparkles size={11} className="text-indigo-505" />
                              {language === "ar" 
                                ? `مهام مقترحة ومصاغة لوظيفة (${exp.position}) - اضغط للإضافة وسد الفجوات:`
                                : `Suggested duties for (${exp.position}) - click to insert to close ATS gaps:`}
                            </h4>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {(() => {
                                const p = (exp.position || "").toLowerCase();
                                const duties = p.includes("برمج") || p.includes("مطور") || p.includes("ويب") || p.includes("برنامج") || p.includes("tech") || p.includes("dev") || p.includes("soft") || p.includes("engineer")
                                  ? (language === "ar"
                                      ? [
                                          "• تطوير وصيانة تطبيقات الويب باستخدام التقنيات الحديثة لضمان الكفاءة والسرعة الفائقة.",
                                          "• تصميم وبناء قواعد بيانات قوية وموثوقة لضمان أمان معالجة البيانات بسلاسة تامة.",
                                          "• التعاون مع مهندسي المنتجات ومصممي الواجهات لتحويل المتطلبات إلى ميزات حية وتفاعلية.",
                                          "• إجراء مراجعة الأكواد البرمجية (Code Review) وكتابة اختبارات لضمان معايير الجودة الممتازة."
                                        ]
                                      : [
                                          "• Developed and maintained scalable web applications utilizing modern technical stacks to guarantee raw speed.",
                                          "• Engineered robust relational and non-relational database models assuring extreme accessibility.",
                                          "• Partnered with product owners and UX researchers to formulate and launch high-impact runs.",
                                          "• Conducted diligent code reviews and set up advanced integration testing suites."
                                        ])
                                  : p.includes("تصميم") || p.includes("مُصمم") || p.includes("ديزاين") || p.includes("design") || p.includes("ui") || p.includes("ux") || p.includes("graphic")
                                  ? (language === "ar"
                                      ? [
                                          "• تصميم واجهات مستخدم (UI) جذابة وتفاعلية تتوافق مع معايير السلوك البصري وسلوك المستخدم.",
                                          "• بناء مخططات وهياكل تجربة المستخدم (UX Wireframes) لتبسيط وتحسين رحلات العملاء.",
                                          "• إجراء أبحاث واختبارات تجارب الاستخدام لضمان ملاءمة التصميم لاهداف العميل والجمهور.",
                                          "• تسليم ملفات التصاميم ومكوناتها المتكاملة لصالح فرق التطوير البرمجية لتسريع البناء."
                                        ]
                                      : [
                                          "• Created high-fidelity user interface concepts aligned with modern brand identity and user trends.",
                                          "• Designed thorough UX wireframes and flow maps simplifying the digital onboarding path.",
                                          "• Conducted user test groups and interactive prototype walk-through sessions to optimize flows.",
                                          "• Handed off production-ready assets and comprehensive design spec tokens to engineering teams."
                                        ])
                                  : p.includes("تسويق") || p.includes("مبيعات") || p.includes("ماركت") || p.includes("marketing") || p.includes("sales") || p.includes("سوشيال")
                                  ? (language === "ar"
                                      ? [
                                          "• صياغة وإطلاق الحملات التسويقية المدفوعة ومتابعة مقاييس الأداء والعائد من الاستثمار (ROI).",
                                          "• تحليل وتطوير خطط الأداء وقنوات القمع بهدف زيادة تحويل المبيعات وتحقيق نمو للأرباح.",
                                          "• إدارة حسابات التواصل وبناء شراكات تجارية قوية لضمان ولاء وتفاعل الجمهور المستهدف.",
                                          "• استخدام أدوات التحليل الرقمي لرصد تفاعلات السوق وصياغة استبيانات الرأي الدورية."
                                        ]
                                      : [
                                          "• Created and launched dynamic digital campaigns across social channels measuring KPI rates.",
                                          "• Facilitated pipeline deals and negotiated client contracts directly with enterprise partners.",
                                          "• Conducted thorough SEO audit cycles increasing organic impressions.",
                                          "• Drafted analytical briefs highlighting purchase funnels and overall growth strategies."
                                        ])
                                  : p.includes("مشروع") || p.includes("ادارة") || p.includes("مدير") || p.includes("manager") || p.includes("project")
                                  ? (language === "ar"
                                      ? [
                                          "• تخطيط وإدارة نطاق وجداول المشاريع باحترافية وضمان تسليمها في الوقت والميزانية المحددة.",
                                          "• قيادة فرق عمل متعددة التخصصات وتوزيع المهام عبر منهجيات مرنة كالـ Scrum-Agile.",
                                          "• رصد وتخفيف المخاطر التشغيلية المحتملة والتعامل مع العقبات بمرونة تامة لضمان سلامة الإنتاج.",
                                          "• بناء وتوثيق التقارير التنفيذية الدورية وعرض تطورات العمل للرئاسة وأصحاب المصلحة."
                                        ]
                                      : [
                                          "• Controlled project plan development from requirement aggregation to direct deployment.",
                                          "• Facilitated daily standing sessions organizing team milestones safely.",
                                          "• Managed client resources and budgets assuring 100% target delivery rate.",
                                          "• Mitigated operational risks by creating structured deployment contingency plans."
                                        ])
                                  : (language === "ar"
                                      ? [
                                          "• تنظيم وإدارة المهام العملية اليومية بكفاءة لضمان تحقيق الأهداف الأساسية للقسم.",
                                          "• كتابة وتوثيق المستندات والملفات التنظيمية لضمان دقة وتسهيل استرجاع واستخلاص المعلومات.",
                                          "• تقديم مقترحات وحلول ابتكارية لمواجهة المشاكل التشغيلية والتنظيمية بأسلوب عملي مرن.",
                                          "• المساهمة الفاعلة في تنسيق الجهود المشتركة مع باقي الأقسام لتحسين الكفاءة العامة."
                                        ]
                                      : [
                                          "• Organized daily target tasks ensuring structured progression towards corporate goals.",
                                          "• Structured and archived business documentation raising accessibility standard.",
                                          "• Administered custom support sessions resolving emergent software and logistics bugs.",
                                          "• Coordinated across standard team boards boosting standard alignment."
                                        ]);

                                return duties.map((duty, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      const currentText = exp.description || "";
                                      const separator = currentText ? "\n" : "";
                                      updateExperience(exp.id, {
                                        description: currentText + separator + duty
                                      });
                                    }}
                                    className="w-full text-start text-xs text-slate-600 hover:text-indigo-600 hover:bg-white p-2 px-3 rounded-lg border border-transparent hover:border-indigo-100 transition-all cursor-pointer select-none leading-relaxed flex items-start gap-1.5"
                                  >
                                    <span className="text-indigo-500 mt-0.5 shrink-0 font-bold">+</span>
                                    <span>{duty}</span>
                                  </button>
                                ));
                              })()}
                            </div>
                          </div>
                        )}

                        <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 opacity-70 px-2 leading-tight">
                            <Sparkles size={10} className="text-indigo-400 shrink-0" />
                            {language === "ar" 
                              ? "يتم إرسال النص أعلاه فقط (بدون أي هويات أو معلومات تواصل) بشكل مشفر لتخصيص محتواك."
                              : "Only the text snippet above is sent anonymously to generate tailored content."}
                        </div>
                      </div>

                      {/* ATS Hint */}
                      {jobDescription && matchResults && (
                        <div className="mt-2 text-xs flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <AlertCircle
                            size={14}
                            className="text-amber-500 shrink-0 mt-0.5"
                          />
                          <div className="text-slate-600">
                            <span className="font-semibold text-slate-700">
                              {String(t.experience?.atsHint || "")}:{" "}
                            </span>
                            {matchResults.missing.length > 0 ? (
                              <>
                                {String(t.experience?.tryIncorporating || "")}{" "}
                                <span className="text-red-500 font-medium">
                                  {matchResults.missing.slice(0, 3).join(", ")}
                                </span>
                              </>
                            ) : (
                              <span className="text-emerald-500 font-medium">
                                {String(t.experience?.greatMatched || "")}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};

export default ExperienceForm;
