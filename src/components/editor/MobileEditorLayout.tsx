import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { LogoImage } from "../LogoImage";
import { LOGO_ICON_URL } from "../../constants";
import { 
  User, Briefcase, GraduationCap, Award, FolderHeart, Trophy, CheckCircle,
  Eye, Grid, Download, 
  FileText, ChevronRight, Share2, AlertTriangle,
  ArrowUp, ArrowDown, Layers, Settings, RotateCcw, MoreHorizontal,
  ArrowLeft, ArrowRight, X
} from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";

// Section Icon mapping for beautiful vector designs
const SECTION_ICONS: Record<string, React.ComponentType<any>> = {
  basics: User,
  summary: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Award,
  projects: FolderHeart,
  certifications: Trophy,
  finish: CheckCircle,
};

// Section Colors for premium gradient/vibrant look
const SECTION_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  basics: {
    bg: "bg-blue-50/70",
    text: "text-blue-500",
    border: "border-blue-150",
    glow: "rgba(59,130,246,0.15)"
  },
  summary: {
    bg: "bg-blue-50/70",
    text: "text-blue-500",
    border: "border-blue-150",
    glow: "rgba(59,130,246,0.15)"
  },
  experience: {
    bg: "bg-brand-50/70",
    text: "text-brand-500",
    border: "border-brand-150",
    glow: "rgba(99,102,241,0.15)"
  },
  education: {
    bg: "bg-purple-50/70",
    text: "text-purple-500",
    border: "border-purple-150",
    glow: "rgba(168,85,247,0.15)"
  },
  skills: {
    bg: "bg-amber-50/70",
    text: "text-amber-500",
    border: "border-amber-150",
    glow: "rgba(245,158,11,0.15)"
  },
  projects: {
    bg: "bg-emerald-50/70",
    text: "text-emerald-500",
    border: "border-emerald-150",
    glow: "rgba(16,185,129,0.15)"
  },
  certifications: {
    bg: "bg-rose-50/70",
    text: "text-rose-500",
    border: "border-rose-150",
    glow: "rgba(244,63,94,0.15)"
  },
  finish: {
    bg: "bg-orange-50/70",
    text: "text-orange-500",
    border: "border-orange-150",
    glow: "rgba(249,115,22,0.15)"
  },
};

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
    { id: "basics",         label: "المعلومات الشخصية + الملخص", emoji: "👤", desc: "الاسم، التواصل، الملخص والروابط المهنية" },
    { id: "experience",     label: "الخبرة والتعليم",   emoji: "💼", desc: "تاريخك الوظيفي والتعليمي بالكامل" },
    { id: "skills",         label: "المهارات والمشاريع والشهادات",  emoji: "⭐", desc: "مهاراتك ومشاريعك العملية والشهادات الداعمة" },
    { id: "finish",         label: "المعاينة والتحميل",     emoji: "🏁", desc: "التثبت من معايير ATS، وتحميل سيرتك فوراً" },
  ],
  en: [
    { id: "basics",         label: "Personal Info & Summary",  emoji: "👤", desc: "Contact details, target job title, and bio" },
    { id: "experience",     label: "Experience & Education",   emoji: "💼", desc: "Work experience history and educational track" },
    { id: "skills",         label: "Skills, Projects & Certs", emoji: "⭐", desc: "Technical skills, portfolio projects, and certifications" },
    { id: "finish",         label: "Preview & Download",    emoji: "🏁", desc: "Audit ATS criteria and download your completed CV" },
  ],
  fr: [
    { id: "basics",         label: "Infos Personnelles & Résumé", emoji: "👤", desc: "Coordonnées, liens pros et biographie" },
    { id: "experience",     label: "Expérience & Formation",       emoji: "💼", desc: "Parcours professionnel et diplômes" },
    { id: "skills",         label: "Compétences, Projets & Certifs",  emoji: "⭐", desc: "Savoir-faire, projets et certifications" },
    { id: "finish",         label: "Aperçu & Téléchargement",    emoji: "🏁", desc: "Dernier audit ATS et téléchargement direct" },
  ],
};

const FINE_SECTIONS = [
  "basics",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "finish"
];

const FINE_LABELS: Record<string, Record<string, string>> = {
  ar: {
    basics: "المعلومات",
    summary: "الملخص",
    experience: "الخبرات",
    education: "التعليم",
    skills: "المهارات",
    projects: "المشاريع",
    certifications: "الشهادات",
    finish: "التحميل"
  },
  en: {
    basics: "Info",
    summary: "Summary",
    experience: "Work",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certs",
    finish: "Export"
  },
  fr: {
    basics: "Infos",
    summary: "Résumé",
    experience: "Expérience",
    education: "Éducation",
    skills: "Savoir-faire",
    projects: "Projets",
    certifications: "Certifs",
    finish: "Télécharger"
  }
};

// ── Completion Mini Indicator Widget ──────────────────────────
function InteractiveRing({ pct }: { pct: number }) {
  const size = 32, R = 12, C = 2 * Math.PI * R, dash = (pct / 100) * C;
  const col = pct === 100 ? "#10b981" : pct > 40 ? "#2563FF" : "#f59e0b";
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
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-brand-600/20 to-amber-100 mb-4 text-4xl shadow-[0_8px_20px_rgba(251,191,36,0.18)]"
        >
          🎓
        </motion.div>
        
        <h3 className="text-xl font-black text-slate-900 tracking-tight">{t.exportTitle}</h3>
        <p className="text-xs text-slate-500 font-medium px-4 mt-1.5 leading-relaxed">{t.exportSub}</p>
      </div>

      {/* Mini ATS Score Meter Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Ambient colored background circle glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-600/15 rounded-full blur-xl pointer-events-none" />
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
              <circle cx="24" cy="24" r="18" fill="none" stroke={isHighATS ? "#10b981" : "#2563FF"} strokeWidth="4" 
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
            <div className={`w-12 h-12 ${item.bg} border rounded-2xl flex items-center justify-center shrink-0 shadow-3xs transition-all group-hover:scale-105`}>
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
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 shadow-3xs">
        <button
          onClick={() => setIsSorting(false)}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
            !isSorting ? "bg-white text-brand-600 shadow-3xs" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {_lang === "ar" ? "📍 خطوات البناء" : _lang === "fr" ? "📍 Étapes" : "📍 Edit Steps"}
        </button>
        <button
          onClick={() => setIsSorting(true)}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            isSorting ? "bg-white text-brand-600 shadow-3xs" : "text-slate-500 hover:text-slate-700"
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
                    {(() => {
                      const Icon = SECTION_ICONS[sectionId] || User;
                      const colors = SECTION_COLORS[sectionId] || { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-100" };
                      return (
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border", `${colors.bg} ${colors.text} ${colors.border}`)}>
                          <Icon className="w-5 h-5" strokeWidth={2.2} />
                        </div>
                      );
                    })()}
                    <div className="text-right ltr:text-left">
                      <h4 className="text-xs font-black text-slate-800 leading-none">{label}</h4>
                      <p className="text-[10px] text-brand-600 font-bold uppercase tracking-wider mt-1.5 leading-none">
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
                      ? "bg-white border-brand-600/30 ring-4 ring-brand-600/5 shadow-[0_12px_28px_rgba(255,77,45,0.08)] text-slate-900" 
                      : "bg-white border-slate-200 hover:border-slate-350 shadow-3xs text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {/* Highlight background indicator */}
                  {isActive && (
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-brand-600 to-orange-500 rounded-full"
                      style={{ [isRtl ? "right" : "left"]: 0 }}
                    />
                  )}

                  {/* Number indicator count circles */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-colors shrink-0 ${
                    isActive
                      ? "bg-brand-600/10 text-brand-600"
                      : "bg-slate-50 border border-slate-150 text-slate-400 group-hover:bg-slate-100"
                  }`}>
                    {idx + 1}
                  </div>

                  {/* Icon / Emoji circle widget with colorful tints */}
                  {(() => {
                    const Icon = SECTION_ICONS[s.id] || User;
                    const colors = SECTION_COLORS[s.id] || { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-100" };
                    return (
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-105 border", 
                        isActive ? "bg-brand-600/10 text-brand-600 border-brand-600/20 animate-pulse" : `${colors.bg} ${colors.text} ${colors.border}`
                      )}>
                        <Icon className="w-5 h-5" strokeWidth={2.2} />
                      </div>
                    );
                  })()}

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
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-brand-600/20 to-orange-500/0 rounded-full blur-xl pointer-events-none transition-transform group-hover:scale-110" />

            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
              <CheckCircle className="w-5 h-5 text-amber-400" strokeWidth={2.4} />
            </div>
            
            <div className="flex-1 min-w-0 text-right ltr:text-left">
              <h4 className="text-xs font-black text-white">{auditSection.label}</h4>
              <p className="text-[10px] text-slate-300 font-semibold mt-0.5 truncate">{auditSection.desc}</p>
            </div>

            <span className="bg-brand-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-xs leading-none tracking-wider">
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
  onOpenPreview   = () => {},
  onOpenAts       = () => {},
  onOpenSettings  = () => {},
  onReset         = () => {},
  focusMode       = false,
  onToggleFocus   = () => {},
  children,
}: {
  lang?: string;
  atsScore?: number;
  activeSection?: string;
  onSectionChange?: (id: string) => void;
  completionMap?: Record<string, number>;
  onExportPDF?: () => void;
  onExportWord?: () => void;
  onOpenPreview?: () => void;
  onOpenAts?: () => void;
  onOpenSettings?: () => void;
  onReset?: () => void;
  focusMode?: boolean;
  onToggleFocus?: () => void;
  children?: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("edit");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showTopMoreMenu, setShowTopMoreMenu] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
        scrollable.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
    }, 45);
  };

  const currentFineSectionIndex = FINE_SECTIONS.indexOf(activeSection);
  const handlePrevSection = () => {
    if (currentFineSectionIndex > 0) {
      handleSectionChange(FINE_SECTIONS[currentFineSectionIndex - 1]);
    }
  };
  const handleNextSection = () => {
    if (currentFineSectionIndex < FINE_SECTIONS.length - 1) {
      handleSectionChange(FINE_SECTIONS[currentFineSectionIndex + 1]);
    }
  };

  return (
    <div className="mobile-editor-container fixed inset-0 flex flex-col bg-[#F9FAFB] text-slate-800 overflow-hidden pb-[calc(100px+env(safe-area-inset-bottom,0px))]" style={{ direction: isRtl ? "rtl" : "ltr" }}>

      {/* ── Visual Mobile Header (Floating Pill like Desktop) ── */}
      <div className="w-full z-50 pt-3 px-3 pb-1 bg-transparent pointer-events-none flex justify-center shrink-0 transform-gpu select-none">
        <header className="pointer-events-auto bg-white/95 backdrop-blur-2xl border border-slate-200/50 shadow-[0_4px_24px_rgba(15,23,42,0.06)] rounded-2xl px-3 h-14 flex items-center justify-between w-full relative">
          <div className="flex items-center gap-2">
            {/* Elegant Back Button */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => { window.location.href = "/"; }}
              className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/55 flex items-center justify-center text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors shrink-0"
              title={lang === "ar" ? "رجوع" : "Back"}
              aria-label={lang === "ar" ? "رجوع" : "Back"}
            >
              <ArrowLeft size={16} className="rtl:rotate-180" />
            </motion.button>

            {/* Logo image */}
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <LogoImage 
                src={LOGO_ICON_URL} 
                alt="HashResume App" 
                className="w-full h-full object-contain" 
              />
            </div>
            
            <span className="text-xs font-black text-slate-900 tracking-tight leading-none font-mono">HashResume</span>
          </div>

          <div className="flex items-center gap-1.5 relative">
            {/* Compact Three-Dots Button */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setShowTopMoreMenu(!showTopMoreMenu)}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 cursor-pointer transition-colors shrink-0 border",
                showTopMoreMenu ? "bg-slate-100 border-slate-300 text-slate-900 shadow-sm" : "bg-slate-50 border-slate-200/55 hover:bg-slate-100"
              )}
              title={lang === "ar" ? "خيارات إضافية" : "More Options"}
            >
              <MoreHorizontal size={18} strokeWidth={2.5} />
            </motion.button>

            {/* Compact Dropdown Menu */}
            <AnimatePresence>
              {showTopMoreMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40 pointer-events-auto bg-transparent" 
                    onClick={() => setShowTopMoreMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.12 }}
                    className={cn(
                      "absolute top-11 end-0 w-48 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-1.5 flex flex-col gap-0.5 z-50 pointer-events-auto text-start",
                      isRtl ? "text-right" : "text-left"
                    )}
                  >
                    {/* Focus Mode */}
                    <button
                      onClick={() => {
                        onToggleFocus();
                        setShowTopMoreMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-start"
                    >
                      <Eye size={15} className="text-[#ff4d2d]" strokeWidth={2.5} />
                      <span>{focusMode ? (lang === "ar" ? "وضع العرض العادي" : "Disable Focus Mode") : (lang === "ar" ? "وضع التركيز" : "Focus Mode")}</span>
                    </button>

                    {/* WhatsApp Support */}
                    <a
                      href="https://wa.me/201101007965?text=Hello,%20I%20need%20help%20with%20my%20Hash%20Resume."
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowTopMoreMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-start"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500 shrink-0"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      <span>{lang === "ar" ? "الدعم الفني عبر واتساب" : "WhatsApp Support"}</span>
                    </a>

                    {/* Start Over */}
                    <button
                      onClick={() => {
                        onReset();
                        setShowTopMoreMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-start border-t border-slate-100"
                    >
                      <RotateCcw size={14} className="text-red-500" strokeWidth={2.5} />
                      <span>{lang === "ar" ? "مسح والبدء من جديد" : "Start Over"}</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>
      </div>

      {/* Horizontal Section Stepper Navigation on Mobile */}
      <div className="w-full bg-white border-b border-slate-200/40 px-3 py-2 shrink-0 overflow-x-auto scrollbar-none flex items-center justify-start gap-2 select-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {FINE_SECTIONS.map((stepId, idx) => {
          const isActive = activeSection === stepId;
          const pct = completionMap[stepId] ?? 0;
          const isCompleted = pct === 100;
          const label = (FINE_LABELS[lang] || FINE_LABELS.en)[stepId];
          
          return (
            <button
              id={`m-tab-${stepId}`}
              key={stepId}
              onClick={() => handleSectionChange(stepId)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-[10.5px] font-bold transition-all shrink-0 cursor-pointer border",
                isActive
                  ? "bg-[#001639] text-white border-[#001639] shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black shrink-0",
                isActive 
                  ? "bg-white text-[#001639]" 
                  : isCompleted 
                    ? "bg-emerald-500 text-white" 
                    : "bg-slate-200 text-slate-500"
              )}>
                {isCompleted ? "✓" : idx + 1}
              </div>
              <span className="whitespace-nowrap leading-none">{label}</span>
            </button>
          );
        })}
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

              /* Elegant mobile form spacing and padding coordination overrides */
              .editor-form-scrollable {
                padding: 16px 16px 100px 16px !important; /* General horizontal padding: 16px */
              }
              .editor-form-scrollable .bg-white {
                padding: 16px !important;
                border-radius: 16px !important; /* Card radius: 16px */
                border-color: rgba(226, 232, 240, 0.7) !important;
                box-shadow: 0 4px 14px rgba(15, 23, 42, 0.015) !important;
              }
              .editor-form-scrollable .space-y-6 > * + * {
                margin-top: 20px !important; /* Gap between main blocks: 20-24px */
              }
              .editor-form-scrollable .space-y-4 > * + * {
                margin-top: 16px !important;
              }
              .editor-form-scrollable .grid {
                gap: 16px !important;
              }
              
              /* Bigger inputs with clear touch friendly spacing and 44px+ touch targets */
              .editor-form-scrollable input, 
              .editor-form-scrollable select, 
              .editor-form-scrollable textarea {
                padding-top: 11px !important;
                padding-bottom: 11px !important;
                font-size: 16px !important;
                border-radius: 12px !important;
                min-height: 48px !important; /* Touch target minimum height */
                margin-top: 4px !important;
                border-color: #cbd5e1 !important;
                background-color: #fafbfd !important;
              }
              .editor-form-scrollable label {
                font-size: 11px !important;
                font-weight: 700 !important;
                color: #475569 !important;
                margin-bottom: 4px !important;
                display: block !important;
              }
              .editor-form-scrollable .mt-8 {
                margin-top: 20px !important;
              }
              .editor-form-scrollable h3,
              .editor-form-scrollable h2,
              .editor-form-scrollable h1 {
                font-size: 14px !important;
                margin-bottom: 10px !important;
              }
            `}</style>
            
            {/* Render active field step components */}
            <div className="flex-1 overflow-hidden relative flex flex-col justify-between">
              <div className="flex-1 overflow-y-auto relative">
                {children}
              </div>

              {/* Sticky bottom bar with Back, Preview & Next buttons at 48px height */}
              <div className="w-full bg-white border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] flex items-center justify-between gap-2.5 px-4 py-2.5 select-none shrink-0 z-10">
                <button
                  type="button"
                  onClick={handlePrevSection}
                  disabled={currentFineSectionIndex <= 0}
                  className="flex-1 flex items-center justify-center gap-1.5 h-12 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ArrowLeft size={15} className={cn("shrink-0", isRtl && "rotate-180")} />
                  <span>{lang === "ar" ? "رجوع" : "Back"}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenPreview}
                  className="flex-1 flex items-center justify-center gap-1.5 h-12 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 shadow-2xs transition-all cursor-pointer"
                  title={lang === "ar" ? "معاينة السيرة الذاتية" : "Preview Resume"}
                >
                  <Eye size={15} className="text-amber-700 shrink-0" strokeWidth={2.5} />
                  <span>{lang === "ar" ? "معاينة" : lang === "fr" ? "Aperçu" : "Preview"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextSection}
                  disabled={currentFineSectionIndex >= FINE_SECTIONS.length - 1}
                  className="flex-[1.25] flex items-center justify-center gap-1.5 h-12 rounded-xl text-xs font-black bg-[#001639] hover:bg-[#00112c] text-white shadow-md disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <span>
                    {currentFineSectionIndex === FINE_SECTIONS.length - 1 
                      ? (lang === "ar" ? "إنهاء" : "Finish")
                      : (lang === "ar" ? "التالي" : "Next")}
                  </span>
                  <ArrowRight size={15} className={cn("shrink-0", isRtl && "rotate-180")} />
                </button>
              </div>
              {/* END Dynamic Step-by-Step Mini Stepper Navigation */}
            </div>
          </div>
        </div>

        {/* EXPORT TAB */}
        <div className={`h-full w-full ${activeTab === "export" ? "flex flex-col" : "hidden"} bg-[#fafafa] relative overflow-hidden pb-12`}>
          <div className="flex-1 overflow-y-auto">
            <ExportScreen lang={lang} onPDF={onExportPDF} onWord={onExportWord} atsScore={atsScore} />
          </div>
          {/* Beautiful Sticky CTA at the bottom of Export Tab */}
          <div className="px-4 py-3 bg-white border-t border-slate-150 shadow-[0_-8px_30px_rgba(0,0,0,0.03)] z-10 select-none flex flex-col gap-2 shrink-0">
            <button
              onClick={onExportPDF}
              className="w-full h-11 rounded-xl bg-brand-600 hover:bg-slate-950 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              <FileText size={14} strokeWidth={2.5} />
              <span>{lang === "ar" ? "تحميل السيرة الذاتية (PDF)" : "Download Resume (PDF)"}</span>
            </button>
          </div>
        </div>
      </main>

      {/* ── Highly Polished Flat Bottom Navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto flex flex-col select-none lg:hidden">
        {/* Mini Progress Line above the bar */}
        <div className="w-full h-[3px] bg-slate-100 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, atsScore))}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute top-0 bottom-0 bg-gradient-to-r from-brand-600 via-orange-500 to-emerald-500"
            style={{ [isRtl ? "right" : "left"]: 0 }}
          />
        </div>

        {/* Floating More Menu Popover */}
        {showMoreMenu && (
          <div className="absolute bottom-[72px] inset-x-4 max-w-sm mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-3 flex flex-col gap-1 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Settings Button */}
            <button
              onClick={() => {
                onOpenSettings();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer text-start text-xs sm:text-sm font-bold"
            >
              <Settings size={18} strokeWidth={2} className="text-brand-600" />
              <span>{lang === "ar" ? "الإعدادات والسمات" : "Settings & Themes"}</span>
            </button>

            {/* ATS Audit Button */}
            <button
              onClick={() => {
                onOpenAts();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer text-start text-xs sm:text-sm font-bold border-t border-slate-100"
            >
              <div className="flex items-center gap-3">
                <CheckCircle size={18} strokeWidth={2} className="text-brand-600" />
                <span>{lang === "ar" ? "فحص وتحليل ATS" : "ATS Audit & Analysis"}</span>
              </div>
              <span className={cn(
                "text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white shadow-xs",
                atsScore >= 80 ? "bg-emerald-500" : atsScore >= 50 ? "bg-amber-500" : "bg-rose-500"
              )}>
                {atsScore}%
              </span>
            </button>
          </div>
        )}

        {/* The White Flat Dock Container */}
        <div className="w-full bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] px-2 pt-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] flex items-center justify-around">
          
          {/* Tab 1: Sections Drawer Trigger */}
          <button
            onClick={() => {
              setIsDrawerOpen(true);
              setShowMoreMenu(false);
            }}
            className={cn(
              "flex flex-col items-center gap-[2px] min-w-[64px] transition-colors cursor-pointer text-gray-400 hover:text-brand-600"
            )}
            title={lang === "ar" ? "الأقسام" : lang === "fr" ? "Rubriques" : "Sections"}
            aria-label={lang === "ar" ? "الأقسام" : lang === "fr" ? "Rubriques" : "Sections"}
          >
            <Grid size={20} strokeWidth={2} />
            <span className="text-[10px] font-medium mt-0.5">{lang === "ar" ? "الأقسام" : lang === "fr" ? "Rubriques" : "Sections"}</span>
          </button>

          {/* Tab 2: Download */}
          <button
            onClick={() => {
              onExportPDF();
              setShowMoreMenu(false);
            }}
            className="flex flex-col items-center gap-[2px] min-w-[64px] transition-colors cursor-pointer"
            title={lang === "ar" ? "تحميل PDF" : "Download PDF"}
            aria-label={lang === "ar" ? "تحميل PDF" : "Download PDF"}
          >
            <div className="bg-[#001639] rounded-full p-1.5 text-white transform -translate-y-1 shadow-xs">
              <Download size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-medium text-[#001639] -mt-1 uppercase tracking-wider">{lang === "ar" ? "تحميل" : "Download"}</span>
          </button>

          {/* Tab 3: More */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={cn(
              "flex flex-col items-center gap-[2px] min-w-[64px] transition-colors cursor-pointer",
              showMoreMenu ? "text-brand-600" : "text-gray-400 hover:text-gray-600"
            )}
            title={lang === "ar" ? "المزيد" : "More"}
            aria-label={lang === "ar" ? "المزيد" : "More"}
          >
            <MoreHorizontal size={20} strokeWidth={2} />
            <span className="text-[10px] font-medium mt-0.5">{lang === "ar" ? "المزيد" : "More"}</span>
          </button>

        </div>
      </div>

      {/* ── Slide-up Sections Drawer on Mobile ── */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/60 z-[150] backdrop-blur-[2px]"
            />
            {/* Slide-up Drawer Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed bottom-0 inset-x-0 bg-[#FAF9F7] rounded-t-[2rem] z-[160] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Drawer Handle / Header */}
              <div className="w-full flex flex-col items-center pt-3 pb-2.5 bg-white border-b border-slate-100 shrink-0 select-none">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-3.5" />
                <div className="flex items-center justify-between w-full px-5">
                  <h4 className="text-sm font-black text-slate-800">
                    {lang === "ar" ? "أقسام السيرة الذاتية" : "Resume Sections"}
                  </h4>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Drawer Content Area */}
              <div className="flex-1 overflow-y-auto px-1 py-2 pb-[calc(28px+env(safe-area-inset-bottom,0px))] bg-[#FAF9F7]">
                <SectionsScreen
                  _lang={lang}
                  sections={sections}
                  activeSection={activeSection}
                  onSectionChange={(id) => {
                    handleSectionChange(id);
                    setIsDrawerOpen(false);
                  }}
                  completionMap={completionMap}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Floating dynamic micro-hints disabled on mobile */}



    </div>
  );
}
