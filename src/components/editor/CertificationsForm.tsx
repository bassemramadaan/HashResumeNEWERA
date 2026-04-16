import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { translations } from "../../i18n/translations";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
} from "lucide-react";
import { Reorder } from "framer-motion";
import SectionTooltip from "./SectionTooltip";

const CertificationsForm = () => {
  const { language } = useLanguageStore();
  const t = translations[language].editor;
  const {
    data,
    addCertification,
    updateCertification,
    removeCertification,
    updateData,
  } = useResumeStore();
  const { certifications } = data;
  const [expandedId, setExpandedId] = useState<string | null>(
    certifications[0]?.id || null,
  );

  const handleAdd = () => {
    addCertification({
      name: "",
      issuer: "",
      date: "",
    });
  };

  const handleReorder = (newOrder: typeof certifications) => {
    updateData({ ...data, certifications: newOrder });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionTooltip
            title={t.certifications.title}
            content={t.certifications.tooltipDesc || "Add relevant certifications to showcase your specialized skills."}
            example={t.certifications.tooltipExample || "e.g., AWS Certified Solutions Architect"}
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-slate-50 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200"
        >
          <Plus size={16} />
          {t.certifications.add}
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 border-dashed text-center text-white0">
          {t.certifications.noCertifications}
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={certifications}
          onReorder={handleReorder}
          className="space-y-4"
        >
          {certifications.map((cert) => (
            <Reorder.Item
              key={cert.id}
              value={cert}
              className="bg-slate-50 rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all"
            >
              <div
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === cert.id ? null : cert.id)
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
                      {cert.name || t.certifications.notSpecified}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {cert.issuer || t.certifications.issuer} • {cert.date || t.certifications.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const { id: _id, ...rest } = cert;
                      addCertification(rest);
                    }}
                    className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                    title={t.certifications.duplicate}
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCertification(cert.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={t.certifications.remove}
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === cert.id ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </div>
              </div>

              {expandedId === cert.id && (
                <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {t.certifications.name}
                      </label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) =>
                          updateCertification(cert.id, { name: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder="e.g. AWS Certified Developer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {t.certifications.issuer}
                      </label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) =>
                          updateCertification(cert.id, {
                            issuer: e.target.value,
                          })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors placeholder-slate-400"
                        placeholder="e.g. Amazon Web Services"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {t.certifications.date}
                      </label>
                      <input
                        type="month"
                        value={cert.date}
                        onChange={(e) =>
                          updateCertification(cert.id, { date: e.target.value })
                        }
                        className="block w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                      />
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

export default CertificationsForm;
