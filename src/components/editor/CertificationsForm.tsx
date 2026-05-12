import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Copy, Award } from "lucide-react";
import { motion, Reorder, AnimatePresence } from "motion/react";

export const CertificationsForm: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const { data, updateCertification, addCertification, removeCertification, reorderCertifications, duplicateCertification } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(data.certifications[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 leading-none">
            {String(t.certifications.title || "")}
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            {language === 'ar' ? 'أضف الشهادات والإنجازات المهنية ذات الصلة.' : 'Add relevant certifications and professional achievements.'}
          </p>
        </div>
        <button
          onClick={() => addCertification({ name: "", issuer: "", date: "" })}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-sm text-sm font-medium"
        >
          <Plus size={18} />
          {String(t.certifications.add || "")}
        </button>
      </div>

      {data.certifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Award className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">
            {String(t.certifications.noCertifications || "")}
          </h3>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={data.certifications}
          onReorder={reorderCertifications}
          className="space-y-4"
        >
          {data.certifications.map((cert) => (
            <Reorder.Item
              key={cert.id}
              value={cert}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                <GripVertical className="mr-3 text-gray-400 cursor-grab active:cursor-grabbing" size={20} />
                <button
                  onClick={() => toggleExpand(cert.id)}
                  className="flex-1 text-left font-medium text-gray-900 truncate"
                >
                  {cert.name || String(t.certifications.notSpecified || "")}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateCertification(cert.id)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title={String(t.experience.duplicate || "")}
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => removeCertification(cert.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title={String(t.experience.remove || "")}
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => toggleExpand(cert.id)}
                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
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
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {String(t.certifications.name || "")}
                          </label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                            placeholder="e.g. AWS Certified Solutions Architect"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {String(t.certifications.issuer || "")}
                          </label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                            placeholder="e.g. Amazon Web Services"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {String(t.certifications.date || "")}
                          </label>
                          <input
                            type="text"
                            value={cert.date}
                            onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                            placeholder="MM/YYYY"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};

export default CertificationsForm;
