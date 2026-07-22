import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import { Plus, Trash2, ChevronDown, ChevronUp, Copy, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import EmptyState from "./EmptyState";
import { SortableList, DragHandle } from "../ui/SortableList";

export const CertificationsForm: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const { data, updateCertification, addCertification, removeCertification, reorderCertifications, duplicateCertification } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(data.certifications[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-auto">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
            {String(t.certifications.title || "Certifications")}
          </h3>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {language === 'ar' ? 'أضف الشهادات والإنجازات المهنية ذات الصلة.' : 'Add relevant certifications and professional achievements.'}
          </p>
        </div>
        <button
          onClick={() => addCertification({ name: "", issuer: "", date: "" })}
          className="flex items-center justify-center gap-2 w-full md:w-auto bg-slate-900 text-white hover:bg-slate-950 px-5 h-12 md:h-11 rounded-xl text-sm font-bold transition-all border border-brand-100 cursor-pointer shadow-3xs active:scale-95"
        >
          <Plus size={18} />
          {String(t.certifications.add || "Add")}
        </button>
      </div>

      {data.certifications.length === 0 ? (
        <EmptyState
          icon={<Award size={32} className="stroke-[1.5]" />}
          title={String(t.certifications.title || "Certifications")}
          description={String(t.certifications.noCertifications || "No certifications added yet.")}
          buttonText={String(t.certifications.add || "Add Certification")}
          onAdd={() => addCertification({ name: "", issuer: "", date: "" })}
        />
      ) : (
        <SortableList
          items={data.certifications}
          onReorder={reorderCertifications}
          keyExtractor={(item) => item.id}
          renderItem={(cert) => (
            <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-3xs transition-all">
              <div className="flex items-center px-4 md:px-6 py-4 bg-white/50 border-b border-slate-100 justify-between">
                <div className="flex items-center flex-1 min-w-0 mr-3 rtl:ml-3">
                  <DragHandle />
                  <button
                    onClick={() => toggleExpand(cert.id)}
                    className="flex-1 text-left rtl:text-right font-bold text-slate-900 truncate tracking-tight cursor-pointer hover:text-brand-600 transition-colors"
                  >
                    {cert.name || String(t.certifications.notSpecified || "")}
                  </button>
                </div>
                <div className="flex items-center gap-1 sm:gap-4 shrink-0">
                  <button
                    onClick={() => duplicateCertification(cert.id)}
                    className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-500 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                    title={String(t.experience?.duplicate || "")}
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => removeCertification(cert.id)}
                    className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                    title={String(t.experience?.remove || "")}
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => toggleExpand(cert.id)}
                    className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    {expandedId === cert.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {expandedId === cert.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-4 md:p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                            {String(t.certifications.name || "")}
                          </label>
                          <input dir="auto"
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                            placeholder="e.g. AWS Certified Solutions Architect"
                            className="block w-full px-4 py-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-900 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all font-medium placeholder-slate-450 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                            {String(t.certifications.issuer || "")}
                          </label>
                          <input dir="auto"
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                            placeholder="e.g. Amazon Web Services"
                            className="block w-full px-4 py-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-900 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all font-medium placeholder-slate-450 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                            {String(t.certifications.date || "")}
                          </label>
                          <input dir="auto"
                            type="text"
                            value={cert.date}
                            onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                            placeholder="MM/YYYY"
                            className="block w-full px-4 py-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-900 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all font-medium placeholder-slate-450 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                            {language === 'ar' ? 'رقم الشهادة' : 'Certificate ID'}
                          </label>
                          <input dir="auto"
                            type="text"
                            value={cert.certificateId || ""}
                            onChange={(e) => updateCertification(cert.id, { certificateId: e.target.value })}
                            placeholder="e.g. CERT-12345"
                            className="block w-full px-4 py-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-900 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-xs sm:text-sm transition-all font-medium placeholder-slate-450 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default CertificationsForm;
