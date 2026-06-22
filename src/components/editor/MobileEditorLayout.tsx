import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { 
  Edit3, Eye, Grid, Download, 
  FileText, ChevronRight, Share2, AlertTriangle,
  ArrowUp, ArrowDown, Layers
} from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";

// ── i18n Translation Dictionary ───────────────────────────
const T: Record<string, Record<string, string>> = {
  ar: {
    edit:     "تعديل",
    preview:  "معاينة",
    sections: "الأقسام",
    export:   "تحميل",
    exportPDF:  "تحميل ملف PDF",
    exportWord: "تحميل ملف Word",
    shareLink:  "نسخ رابط المشاركة",
    exportTitle: "سيرتك الذاتية جاهزة! ✨",
    exportSub:   "لقد قمت بعمل رائع؛ اختر صيغة الملف المفضلة لطلب وظيفة أحلامك",
    pdfNote:  "الأكثر توافقاً وقبولاً لدى أنظمة الفرز (ATS)",
    wordNote: "ملف Word مرن وقابل للتعديل بالكامل للمستقبل",
    linkNote: "رابط ويب سريع وتفاعلي للمشاركة المباشرة مع الشركات",
    recentCompleteness: "نسبة الاكتمال الحالية",
    whatsNext: "خطوتك التالية",
    improveScore: "حسّن من نتيجة الـ ATS للحصول على فرص مقابلة أكثر بنسبة 3x!",
    backToEdit: "تابع التعديل وبناء السيرة",
  },
  en: {
    edit:     "Edit",
    preview:  "Preview",
    sections: "Sections",
    export:   "Download",
    exportPDF:  "Download as PDF",
    exportWord: "Download as Word",
    shareLink:  "Copy Share Link",
    exportTitle: "Resume is Ready! ✨",
    exportSub:   "You've crafted a premium resume; choose your high-performance file format",
    pdfNote:  "Industry-standard, best for ATS scanning systems",
    wordNote: "Fully editable format for custom manual adjustments",
    linkNote: "A snappy public link to share directly with recruiters",
    recentCompleteness: "Current Completeness",
    whatsNext: "What's next?",
    improveScore: "Boost ATS score for 3x higher interview landing rates!",
    backToEdit: "Continue building",
  },
  fr: {
    edit:     "Modifier",
    preview:  "Aperçu",
    sections: "Sections",
    export:   "Télécharger",
    exportPDF:  "Télécharger en PDF",
    exportWord: "Télécharger en Word",
    shareLink:  "Copier le lien",
    exportTitle: "Votre CV est prêt ! ✨",
    exportSub:   "Vous avez fait de l'excellent travail ; choisissez le format optimal",
    pdfNote:  "Standard recommandé pour les systèmes de tri ATS",
    wordNote: "Format .docx modifiable pour les ajustements",
    linkNote: "Un lien public fluide et direct pour les recruteurs",
    recentCompleteness: "Score actuel",
    whatsNext: "Prochaine étape",
    improveScore: "Améliorez le score ATS pour tripler vos chances !",
    backToEdit: "Continuer l'édition",
  },
};

const SECTIONS: Record<string, { id: string; label: string; emoji: string; desc: string }[]> = {
  ar: [
    { id: "basics",         label: "المعلومات الشخصية", emoji: "👤", desc: "الاسم، التواصل، الرابط المهني والمسمى" },
    { id: "experience",     label: "الخبرات العملية",   emoji: "💼", desc: "تاريخك الوظيفي وإنجازاتك المعززة بـ AI" },
    { id: "education",      label: "التعليم والدراسة",   emoji: "🎓", desc: "مؤهلاتك الأكاديمية والجامعات والتدريب" },
    { id: "skills",         label: "المهارات المهنية",  emoji: "⭐", desc: "مهاراتك التقنية والشخصية الموصى بها" },
    { id: "projects",       label: "المشاريع المنجزة",  emoji: "🚀", desc: "إنجازات عملية تبرز جدارتك وخبرتك" },
    { id: "certifications", label: "الشهادات والاعتمادات", emoji: "🏅", desc: "الكورسات والشهادات الداعمة لمؤهلك" },
    { id: "cover-letter",   label: "خطاب التغطية ذكي", emoji: "📝", desc: "خطاب مهني مخصص ومكتوب بالذكاء الاصطناعي" },
    { id: "finish",         label: "مراجعة وتحميل",     emoji: "🏁", desc: "التثبت من معايير ATS، وتحميل سيرتك فوراً" },
  ],
  en: [
    { id: "basics",         label: "Personal Details",  emoji: "👤", desc: "Your contact details, bio, and social handles" },
    { id: "experience",     label: "Work Experience",   emoji: "💼", desc: "Employment history with smart AI bullets" },
    { id: "education",      label: "Education",        emoji: "🎓", desc: "Degrees, schools, and academic track" },
    { id: "skills",         label: "Skills & Keywords", emoji: "⭐", desc: "Core technical strengths & general skills" },
    { id: "projects",       label: "Projects Portfolio", emoji: "🚀", desc: "Independent or corporate showcase works" },
    { id: "certifications", label: "Certifications",   emoji: "🏅", desc: "Badges, licenses, and auxiliary learning" },
    { id: "cover-letter",   label: "AI Cover Letter",   emoji: "📝", desc: "Generate a targeted, matching application letter" },
    { id: "finish",         label: "Audit & Launch",    emoji: "🏁", desc: "Double check ATS status & download file" },
  ],
  fr: [
    { id: "basics",         label: "Infos Personnelles", emoji: "👤", desc: "Coordonnées, liens pros et biographie" },
    { id: "experience",     label: "Expériences",       emoji: "💼", desc: "Parcours professionnel illustré par l'IA" },
    { id: "education",      label: "Cursus Scolaire",     emoji: "🎓", desc: "Diplômes, universités et certifications" },
    { id: "skills",         label: "Compétences clés",  emoji: "⭐", desc: "Savoir-faire et mots-clés recherchés" },
    { id: "projects",       label: "Projets et Travaux", emoji: "🚀", desc: "Réalisations et portefeuilles valorisants" },
    { id: "certifications", label: "Certifications",   emoji: "🏅", desc: "Formations certifiantes additionnelles" },
    { id: "cover-letter",   label: "Lettre de Motivation", emoji: "📝", desc: "Rédiger une lettre personnalisée via IA" },
    { id: "finish",         label: "Vérifier & Finir",    emoji: "🏁", desc: "Dernier audit ATS et téléchargement direct" },
  ],
};

// ── Completion Mini Indicator Widget ──────────────────────────
function InteractiveRing({ pct }: { pct: number }) {
  const size = 32, R = 12, C = 2 * Math.PI * R, dash = (pct / 100) * C;
  const col = pct === 100 ? "#10b981" : pct > 40 ? "#FF4D2D" : "#f59e0b";
  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 shrink-0">
        <circle cx={size/2} cy={size/2} r={R} fill="none" stroke="#f1f5f9" strokeWidth={3}/>
        <circle cx={size/2} cy={size/2} r={R} fill="none" stroke={col}
          strokeWidth={3} strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {pct === 100 ? (
        <span className="absolute text-emerald-500 text-[10px] font-black">✓</span>
      ) : (
        <span className="absolute text-[8.5px] font-black tracking-tighter text-slate-500">{pct}%</span>
      )}
    </div>
  );
}

// ── ExportScreen ──────────────────────────────────────────
function ExportScreen({ lang, onPDF, onWord, atsScore }: { lang: string; onPDF: () => void; onWord: () => void; atsScore: number }) {
  const t = T[lang] ?? T.en;

  const isHighATS = atsScore >= 75;

  const items = [
    { 
      icon: <FileText className="w-5 h-5 text-rose-500" />, 
      label: t.exportPDF,  
      note: t.pdfNote,  
      bg: "bg-rose-50 border-rose-100",  
      badge: lang === "ar" ? "موصى به" : "Recommended",
      badgeColor: "bg-rose-500 text-white",
      action: onPDF 
    },
    { 
      icon: <Download className="w-5 h-5 text-blue-500" />, 
      label: t.exportWord, 
      note: t.wordNote, 
      bg: "bg-blue-50 border-blue-100",  
      badge: lang === "ar" ? "قابل للتعديل" : "Editable",
      badgeColor: "bg-slate-200 text-slate-800",
      action: onWord 
    },
  ];

  return (
    <div className="px-4 py-6 md:py-8 space-y-6 max-w-md mx-auto h-full overflow-y-auto scrollbar-none pb-24">
      {/* Celebration Header */}
      <div className="text-center pb-2 relative">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 155, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-[#FF4D2D]/20 to-amber-100 mb-4 text-4xl shadow-[0_8px_20px_rgba(251,191,36,0.18)]"
        >
          🎓
        </motion.div>
        
        <h3 className="text-xl font-black text-slate-900 tracking-tight">{t.exportTitle}</h3>
        <p className="text-xs text-slate-500 font-medium px-4 mt-1.5 leading-relaxed">{t.exportSub}</p>
      </div>

      {/* Mini ATS Score Meter Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Ambient colored background circle glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FF4D2D]/15 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-500/15 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="text-right ltr:text-left">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.recentCompleteness}</p>
            <h4 className="text-lg font-black mt-0.5 text-white flex items-center gap-2">
              <span>ATS {atsScore}%</span>
              {isHighATS ? (
                <span className="text-[9.5px] bg-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-full border border-emerald-500/30">Excellent</span>
              ) : (
                <span className="text-[9.5px] bg-amber-500/20 text-amber-300 font-black px-2 py-0.5 rounded-full border border-amber-500/30">Needs Boost</span>
              )}
            </h4>
          </div>
          
          {/* Circular dial meter */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg width="48" height="48" className="-rotate-90">
              <circle cx="24" cy="24" r="18" fill="none" stroke="#1e293b" strokeWidth="4" />
              <circle cx="24" cy="24" r="18" fill="none" stroke={isHighATS ? "#10b981" : "#FF4D2D"} strokeWidth="4" 
                strokeLinecap="round"
                strokeDasharray={`${(atsScore / 100) * 2 * Math.PI * 18} ${2 * Math.PI * 18}`}
              />
            </svg>
            <span className="absolute text-[10px] font-black">{atsScore}%</span>
          </div>
        </div>

        {!isHighATS && (
          <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-start gap-2 text-[10.5px] text-amber-200/90 leading-relaxed font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p>{t.improveScore}</p>
          </div>
        )}
      </div>

      {/* Export Options Custom Buttons */}
      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.button
            whileHover={{ y: -3, shadow: "0 10px 20px rgba(0,0,0,0.06)" }}
            whileTap={{ scale: 0.98 }}
            key={i}
            onClick={item.action}
            className="w-full flex items-center gap-4 p-4.5 bg-white border border-slate-200/90 rounded-2.5xl cursor-pointer text-right ltr:text-left transition-all hover:border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.02)] relative group"
          >
            <div className={`w-12 h-12 ${item.bg} border rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:scale-105`}>
              {item.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-800">{item.label}</h4>
                {item.badge && (
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor} scale-90 transform origin-left`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-semibold leading-normal">{item.note}</p>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-colors group-hover:bg-slate-100 group-hover:text-slate-800 shrink-0">
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Share Link Clipboard Pill */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (typeof window !== "undefined") {
            const currentUrl = window.location.href;
            navigator.clipboard.writeText(currentUrl).then(() => {
              alert(lang === "ar" ? "تم نسخ الرابط ومشاركته بنجاح!" : "Link copied to clipboard!");
            });
          }
        }}
        className="w-full py-4.5 bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200 text-slate-700 rounded-2.5xl flex items-center justify-center gap-2.5 text-xs font-black cursor-pointer transition-all"
      >
        <Share2 className="w-4 h-4" />
        <span>{t.shareLink}</span>
      </motion.button>
    </div>
  );
}

// ── Bento-Style Sections Screen ────────────────────────────
function SectionsScreen({ _lang, sections, activeSection, onSectionChange, completionMap }: {
  _lang: string;
  sections: { id: string; label: string; emoji: string; desc: string }[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  completionMap: Record<string, number>;
}) {
  const [isSorting, setIsSorting] = useState(false);
  const mainSections = sections.filter((s) => s.id !== "finish");
  const auditSection = sections.find((s) => s.id === "finish");
  const isRtl = _lang === "ar";

  const sectionOrder = useResumeStore((state) => state.data.settings.sectionOrder) || [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
  ];
  const updateSettings = useResumeStore((state) => state.updateSettings);

  const labelMapKey: Record<string, string> = {
    summary: _lang === "ar" ? "الملخص المهني" : _lang === "fr" ? "Résumé" : "Professional Summary",
    experience: _lang === "ar" ? "الخبرات العملية" : _lang === "fr" ? "Expérience" : "Work Experience",
    education: _lang === "ar" ? "التعليم والدراسة" : _lang === "fr" ? "Éducation" : "Education",
    skills: _lang === "ar" ? "المهارات المهنية" : _lang === "fr" ? "Compétences" : "Skills",
    projects: _lang === "ar" ? "المشاريع المنجزة" : _lang === "fr" ? "Projets" : "Projects",
    certifications: _lang === "ar" ? "الشهادات والاعتمادات" : _lang === "fr" ? "Certifications" : "Certifications",
  };

  const emojiMapKey: Record<string, string> = {
    summary: "👤",
    experience: "💼",
    education: "🎓",
    skills: "⭐",
    projects: "🚀",
    certifications: "🏅",
  };

  return (
    <div className="px-4 py-5 space-y-4 max-w-md mx-auto h-full overflow-y-auto scrollbar-none pb-24">
      
      {/* Top Welcome Title inside bento */}
      <div className="pb-1 text-center sm:text-right ltr:sm:text-left flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black tracking-wider text-rose-500 uppercase">HashResume Map</span>
          <h3 className="text-base font-black text-slate-900 mt-0.5 leading-snug">
            {_lang === "ar" ? "خطوات بناء سيرتك الاحترافية" : _lang === "fr" ? "Étapes de création de votre CV" : "Steps to Build Your Professional Resume"}
          </h3>
        </div>
      </div>

      {/* Reordering view toggle selector */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 shadow-sm">
        <button
          onClick={() => setIsSorting(false)}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
            !isSorting ? "bg-white text-[#FF4D2D] shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {_lang === "ar" ? "📍 خطوات البناء" : _lang === "fr" ? "📍 Étapes" : "📍 Edit Steps"}
        </button>
        <button
          onClick={() => setIsSorting(true)}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            isSorting ? "bg-white text-[#FF4D2D] shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Layers size={13} />
          {_lang === "ar" ? "🔄 ترتيب الأقسام" : _lang === "fr" ? "🔄 Réorganiser" : "🔄 Reorder"}
        </button>
      </div>

      {isSorting ? (
        <div className="space-y-3">
          <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-3 text-xs text-orange-900 font-semibold leading-relaxed mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>
              {_lang === "ar" 
                ? "اضغط على الأسهم للتحكم في موضع وتدفق الأقسام بداخل صفحة السيرة النهائية!" 
                : "Tap arrow buttons to arrange and reorder section flows directly on page!"}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {sectionOrder.map((sectionId, index) => {
              const label = labelMapKey[sectionId] || sectionId;
              const emoji = emojiMapKey[sectionId] || "📝";
              
              const handleUp = () => {
                if (index === 0) return;
                const newOrder = [...sectionOrder];
                const temp = newOrder[index - 1];
                newOrder[index - 1] = newOrder[index];
                newOrder[index] = temp;
                updateSettings({ sectionOrder: newOrder });
              };

              const handleDown = () => {
                if (index === sectionOrder.length - 1) return;
                const newOrder = [...sectionOrder];
                const temp = newOrder[index + 1];
                newOrder[index + 1] = newOrder[index];
                newOrder[index] = temp;
                updateSettings({ sectionOrder: newOrder });
              };

              return (
                <motion.div
                  layout
                  key={sectionId}
                  className="bg-white border border-slate-100/90 rounded-2.5xl p-3 shadow-premium flex items-center justify-between gap-3"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg shrink-0 border border-slate-100">
                      {emoji}
                    </div>
                    <div className="text-right ltr:text-left">
                      <h4 className="text-xs font-black text-slate-800 leading-none">{label}</h4>
                      <p className="text-[10px] text-[#FF4D2D] font-bold uppercase tracking-wider mt-1.5 leading-none">
                        {_lang === "ar" ? `موضع: ${index + 1}` : `Pos: ${index + 1}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleUp}
                      disabled={index === 0}
                      className={`p-2 rounded-xl border transition-all ${
                        index === 0
                          ? "opacity-[0.15] text-slate-300 border-slate-100 cursor-not-allowed"
                          : "text-slate-700 bg-slate-50 border-slate-100 hover:bg-slate-100 active:scale-90"
                      }`}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={handleDown}
                      disabled={index === sectionOrder.length - 1}
                      className={`p-2 rounded-xl border transition-all ${
                        index === sectionOrder.length - 1
                          ? "opacity-[0.15] text-slate-300 border-slate-100 cursor-not-allowed"
                          : "text-slate-700 bg-slate-50 border-slate-100 hover:bg-slate-100 active:scale-90"
                      }`}
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* Visual Vertical Progress Bento Grid */}
          <div className="grid grid-cols-1 gap-3">
            {mainSections.map((s, idx) => {
              const pct = completionMap[s.id] ?? 0;
              const isActive = activeSection === s.id;
              
              return (
                <motion.div
                  key={s.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSectionChange(s.id)}
                  className={`p-3.5 rounded-2.5xl border cursor-pointer transition-all flex items-center gap-3.5 relative overflow-hidden group select-none ${
                    isActive 
                      ? "bg-white border-[#FF4D2D]/30 ring-4 ring-[#FF4D2D]/5 shadow-[0_12px_28px_rgba(255,77,45,0.08)] text-slate-900" 
                      : "bg-white border-slate-100/90 hover:border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-slate-700 hover:bg-slate-50/50"
                  }`}
                >
                  {/* Highlight background indicator */}
                  {isActive && (
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF4D2D] to-orange-500 rounded-full"
                      style={{ [isRtl ? "right" : "left"]: 0 }}
                    />
                  )}

                  {/* Number indicator count circles */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-colors shrink-0 ${
                    isActive
                      ? "bg-[#FF4D2D]/10 text-[#FF4D2D]"
                      : "bg-slate-50 border border-slate-150 text-slate-400 group-hover:bg-slate-100"
                  }`}>
                    {idx + 1}
                  </div>

                  {/* Icon / Emoji circle widget */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-br from-[#FF4D2D]/5 to-orange-500/[0.02]"
                      : "bg-slate-50 border border-slate-100"
                  }`}>
                    {s.emoji}
                  </div>

                  {/* Main titles info body */}
                  <div className="flex-1 min-w-0 px-1 text-right ltr:text-left">
                    <h4 className="text-xs font-black font-sans tracking-tight text-slate-900 leading-none">{s.label}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold truncate mt-1 leading-none">{s.desc}</p>
                  </div>

                  {/* Completion interactive percentage ring indicator */}
                  <InteractiveRing pct={pct} />
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Dynamic CTA Launch Segment card button */}
      {auditSection && (
        <div className="pt-2">
          <div className="h-px bg-slate-200/60 my-2" />
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSectionChange("finish")}
            className="w-full flex items-center gap-3.5 p-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2.5xl cursor-pointer text-white shadow-[0_10px_25px_rgba(15,23,42,0.15)] relative overflow-hidden group"
          >
            {/* Soft accent glow overlay */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#FF4D2D]/20 to-orange-500/0 rounded-full blur-xl pointer-events-none transition-transform group-hover:scale-110" />

            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-xl shrink-0">
              🏆
            </div>
            
            <div className="flex-1 min-w-0 text-right ltr:text-left">
              <h4 className="text-xs font-black text-white">{auditSection.label}</h4>
              <p className="text-[10px] text-slate-300 font-semibold mt-0.5 truncate">{auditSection.desc}</p>
            </div>

            <span className="bg-[#FF4D2D] text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-md leading-none tracking-wider">
              {_lang === "ar" ? "تحميل" : "DOWNLOAD"}
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
}

// ── main COMPONENT ─────────────────────────────────────────
export default function MobileEditorLayout({
  lang            = "ar",
  atsScore        = 0,
  activeSection   = "basics",
  onSectionChange = () => {},
  completionMap   = {},
  onExportPDF     = () => {},
  onExportWord    = () => {},
  previewContent  = null,
  children,
}: {
  lang?: string;
  atsScore?: number;
  activeSection?: string;
  onSectionChange?: (id: string) => void;
  completionMap?: Record<string, number>;
  onExportPDF?: () => void;
  onExportWord?: () => void;
  previewContent?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const t                             = T[lang] ?? T.en;
  const [activeTab, setActiveTab] = useState("edit");
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 375);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sections = SECTIONS[lang] ?? SECTIONS.en;
  const isRtl = lang === "ar";

  useEffect(() => {
    const tabEl = document.getElementById(`m-tab-${activeSection}`);
    if (tabEl) {
      tabEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeSection]);

  const handleSectionChange = (id: string) => {
    onSectionChange(id);
    setActiveTab("edit");
    // Ensure instant scroll recovery when transitioning section mobile tabs
    setTimeout(() => {
      const scrollable = document.querySelector(".editor-form-scrollable");
      if (scrollable) {
        scrollable.scrollTo({ top: 0, behavior: "instant" as any });
      }
    }, 45);
  };

  const TABS = [
    { id: "edit",     label: t.edit,     icon: Edit3 },
    { id: "sections", label: t.sections, icon: Grid },
    { id: "preview",  label: t.preview,  icon: Eye, isHighlight: true },
    { id: "export",   label: t.export,   icon: Download },
  ];

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="fixed inset-0 flex flex-col bg-[#FAF9F6] text-slate-800 overflow-hidden pb-[calc(84px+env(safe-area-inset-bottom,0px))]" style={{ direction: isRtl ? "rtl" : "ltr" }}>

      {/* ── Visual Mobile Header (Floating Pill like Desktop) ── */}
      <div className="w-full z-50 pt-3 px-3 pb-1 bg-transparent pointer-events-none flex justify-center shrink-0 transform-gpu select-none">
        <header className="pointer-events-auto bg-white/90 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] rounded-2xl px-3 h-14 flex items-center justify-between w-full relative">
          <div className="flex items-center gap-2.5">
            <motion.div 
              whileTap={{ scale: 0.94 }}
              onClick={() => { window.location.href = "/"; }}
              className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/50 p-1 flex items-center justify-center shrink-0 cursor-pointer shadow-3xs"
              title={lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
            >
              <img 
                src="https://i.ibb.co/qFFjyH8V/IN-LOGO-icon-3.png" 
                alt="HashResume App" 
                className="w-full h-full object-contain drop-shadow-sm" 
              />
            </motion.div>
            
            <div className="flex flex-col items-start leading-none">
              <span className="text-[8.5px] font-black text-[#FF4D2D] tracking-wider uppercase leading-none">HashResume</span>
              <span className="text-[12px] font-extrabold text-slate-900 mt-0.5 flex items-center gap-1 leading-none">
                <span className="text-xs shrink-0">{currentSection?.emoji}</span>
                <span className="font-extrabold">{currentSection?.label}</span>
              </span>
            </div>
          </div>

          {/* Floating Glassmorphic ATS Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-black text-[10px] bg-slate-950 text-white shadow-[0_4px_10px_rgba(15,23,42,0.12)] border border-slate-900">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D2D] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF4D2D]" />
            </span>
            <span className="tracking-tight">ATS {atsScore}%</span>
          </div>
        </header>
      </div>

      {/* Sleek Gradient completeness progress micro-line */}
      <div className="w-full h-[6px] bg-transparent relative overflow-visible shrink-0 select-none px-5 pt-1 pb-1">
        <div className="w-full bg-slate-200/80 h-1 rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, atsScore))}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute top-0 bottom-0 bg-gradient-to-r from-[#FF4D2D] via-orange-500 to-amber-500 rounded-full"
            style={{ [isRtl ? "right" : "left"]: 0 }}
          />
        </div>
      </div>

      {/* ── Main content area ── */}
      <main className="flex-1 overflow-hidden w-full max-w-lg mx-auto relative bg-[#FAF9F7]">
        
        {/* EDIT TAB */}
        <div className={`h-full w-full ${activeTab === "edit" ? "block" : "hidden"}`}>
          <div className="h-full flex flex-col overflow-hidden relative">
            <style>{`
              .mobile-tabs-container {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                overflow-x: auto !important;
                white-space: nowrap !important;
                scroll-snap-type: x mandatory !important;
                scrollbar-width: none !important; /* Firefox */
                -ms-overflow-style: none !important;  /* IE and Edge */
              }
              .mobile-tabs-container::-webkit-scrollbar {
                display: none !important; /* Chrome, Safari, Opera */
              }
              .mobile-tab-btn {
                scroll-snap-align: start !important;
              }
            `}</style>
            
            {/* Horizontal Segmented Switcher List with sleek glass background (Unified Glassmorphism) */}
            <div className="bg-[#FAF9F6] border-b border-slate-200/50 px-3.5 py-2.5 shrink-0 select-none mobile-tabs-container">
              <div className="flex items-center bg-slate-100/40 backdrop-blur-xl border border-slate-200/40 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-full p-0.5 gap-0.5 w-max">
                {sections.map((s) => {
                  const isActive = activeSection === s.id;
                  const pct = completionMap[s.id] ?? 0;
                  
                  return (
                    <button
                      key={s.id}
                      id={`m-tab-${s.id}`}
                      onClick={() => handleSectionChange(s.id)}
                      className={`relative flex items-center gap-1 px-3 py-2 rounded-full text-xs font-extrabold whitespace-nowrap shrink-0 transition-all border mobile-tab-btn cursor-pointer ${
                        isActive
                          ? "bg-slate-900 border-slate-900 text-white shadow-md font-black"
                          : "bg-transparent border-transparent text-slate-500 hover:bg-slate-100/70"
                      }`}
                    >
                      <span className="text-[11px] select-none leading-none">{s.emoji}</span>
                      <span className="text-[10px] font-bold leading-none">{s.label}</span>
                      
                      {pct === 100 ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      ) : pct > 0 ? (
                        <span className="text-[8px] px-1 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-extrabold leading-none scale-90">
                          {pct}%
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Render active field step components */}
            <div className="flex-1 overflow-hidden relative">
              <div className="h-full w-full overflow-hidden relative">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW TAB */}
        <div className={`h-full w-full ${activeTab === "preview" ? "block" : "hidden"} bg-slate-100`}>
          <div className="h-full flex flex-col overflow-hidden relative">
            
            {/* Scale Preview Help tip bar */}
            <div className="bg-slate-900 text-white/95 px-4 py-2 flex items-center justify-between text-[10px] font-bold shrink-0 select-none">
              <span>💡 {lang === "ar" ? "اضغط على الشاشة للتكبير ومعاينة ملف الـ PDF" : "Swipe & zoom to inspect clean A4 layout output"}</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-[8.5px] font-black uppercase">LIVE PREVIEW</span>
            </div>

            {/* Fitted Document Frame */}
            <div className="flex-1 overflow-auto p-4 flex justify-center items-start origin-top bg-slate-200/60 pb-20 scrollbar-none">
              <div 
                className="shrink-0 transform-gpu transition-all shadow-[0_12px_45px_rgba(0,0,0,0.12)] rounded-lg border border-slate-300 bg-white" 
                style={{
                  width: "210mm",
                  transform: `scale(${Math.min(0.96, (windowWidth - 32) / 794)})`,
                  transformOrigin: "top center",
                  marginBottom: `-${(1 - Math.min(0.96, (windowWidth - 32) / 794)) * 297}mm`
                }}
              >
                {previewContent}
              </div>
            </div>
          </div>
        </div>

        {/* SECTIONS TAB */}
        <div className={`h-full w-full pb-6 ${activeTab === "sections" ? "block" : "hidden"} bg-[#fafafa]`}>
          <SectionsScreen
            _lang={lang}
            sections={sections}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            completionMap={completionMap}
          />
        </div>

        {/* EXPORT TAB */}
        <div className={`h-full w-full pb-6 ${activeTab === "export" ? "block" : "hidden"} bg-[#fafafa]`}>
          <ExportScreen lang={lang} onPDF={onExportPDF} onWord={onExportWord} atsScore={atsScore} />
        </div>
      </main>

      {/* ── Highly Polished Floating Capsule Dock bottom navigation ── */}
      <div className="fixed bottom-6 inset-x-0 mx-auto z-50 px-3 flex justify-center pointer-events-none w-full max-w-md">
        <nav 
          ref={containerRef}
          className="pointer-events-auto bg-[#252525]/90 backdrop-blur-3xl border border-white/10 rounded-full py-1.5 px-2 flex items-center justify-start sm:justify-center shadow-[0_12px_40px_rgba(0,0,0,0.25)] select-none gap-0.5 overflow-x-auto scrollbar-none max-w-full"
        >
          {TABS.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;

            // Simple divider before Download/Export
            const isLast = idx === TABS.length - 1;

            if (isLast) {
              return (
                <div key={tab.id} className="flex flex-row items-center">
                  <div className="h-5 w-[1px] bg-white/10 shrink-0 mx-1.5" />
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 focus:outline-none",
                      isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeDockIndicatorMobile"
                        className="absolute inset-0 bg-white/20 rounded-full"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center">
                      <IconComponent strokeWidth={isActive ? 2 : 1.5} className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </span>
                  </button>
                </div>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 focus:outline-none shrink-0 ${
                  isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeDockIndicatorMobile"
                    className="absolute inset-0 bg-white/20 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                
                <span className="relative z-10 flex items-center justify-center">
                  {IconComponent && (
                    <IconComponent strokeWidth={isActive ? 2.5 : 1.5} className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  )}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

    </div>
  );
}
