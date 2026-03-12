import { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function CertificationsForm() {
  const { data, addCertification, updateCertification, removeCertification } = useResumeStore();
  const { certifications } = data;
  const [expandedId, setExpandedId] = useState<string | null>(certifications[0]?.id || null);

  const handleAdd = () => {
    addCertification({
      name: '',
      issuer: '',
      date: '',
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-end px-1">
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed text-center text-slate-500 dark:text-slate-400 transition-colors">
          <p className="font-medium">No certifications added yet.</p>
          <p className="text-sm mt-1">Click the button above to add your certifications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all">
              <div 
                className="p-5 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{cert.name || '(Not specified)'}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{cert.issuer || 'Issuer'} • {cert.date || 'Date'}</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeCertification(cert.id); }}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="p-2.5 text-slate-400">
                    {expandedId === cert.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {expandedId === cert.id && (
                <div className="p-5 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Certification Name</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                        className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g. AWS Certified Developer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Issuing Organization</label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                        className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="e.g. Amazon Web Services"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date Earned</label>
                      <input
                        type="month"
                        value={cert.date}
                        onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                        className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
