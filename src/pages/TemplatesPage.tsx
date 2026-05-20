import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, LayoutTemplate, CheckCircle2, Eye, X, Sparkles, Search } from "lucide-react";
import Logo from "../components/Logo";
import { useLanguageStore } from "../store/useLanguageStore";
import { useResumeStore, ResumeData } from "../store/useResumeStore";
import ResumePreview from "../components/preview/ResumePreview";
import { cn } from "@/lib/utils";

// ── dummy data (نفس اللي كان موجود) ──────────────────────
const dummyData: ResumeData = {
  personalInfo: {
    fullName: "Alex Morgan",
    jobTitle: "Senior Product Designer",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 123-4567",
    address: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    portfolio: "alexmorgan.design",
    summary:
      "Award-winning Product Designer with 8+ years of experience creating user-centric digital products. Proven track record of leading design teams and increasing user engagement by 40%. Passionate about accessibility and design systems.",
  },
  experience: [
    {
      id: "1",
      company: "TechNova Solutions",
      position: "Lead Product Designer",
      startDate: "Jan 2020",
      endDate: "Present",
      description:
        "• Led the redesign of the core SaaS platform, resulting in a 35% increase in user retention.\n• Established and maintained a comprehensive design system used by 50+ developers.\n• Mentored a team of 4 junior designers and conducted weekly design critiques.",
    },
    {
      id: "2",
      company: "CreativePulse Agency",
      position: "UX/UI Designer",
      startDate: "Mar 2016",
      endDate: "Dec 2019",
      description:
        "• Designed responsive web applications for Fortune 500 clients in fintech and healthcare.\n• Conducted user research and usability testing with over 100 participants.\n• Reduced onboarding drop-off rate by 25% through UX improvements.",
    },
  ],
  education: [
    {
      id: "1",
      institution: "California College of the Arts",
      degree: "BFA in Interaction Design",
      startDate: "Sep 2012",
      endDate: "May 2016",
      description: "Graduated with Honors.",
    },
  ],
  skills: ["UI/UX Design", "Figma", "Design Systems", "User Research", "Prototyping", "HTML/CSS", "Agile"],
  projects: [],
  certifications: [],
  customSections: [],
  settings: {
    template: "modern",
    themeColor: "#2563EB",
    language: "en",
    isFreshGrad: false,
    sectionOrder: ["summary", "experience", "education", "skills", "projects", "certifications"],
    hiddenSections: [],
  },
  jobDescription: "",
  isPremium: false,
  coverLetter: {
    fullName: "", jobTitle: "", companyName: "",
    hiringManager: "", jobDescription: "", skills: "", generatedContent: "",
  },
};

// ── types ─────────────────────────────────────────────────
type Template = {
  id: ResumeData["settings"]["template"];
  name: string;
  nameAr: string;
  nameFr: string;
  description: string;
  descriptionAr: string;
  descriptionFr: string;
  color: string;
  categories: string[];
  isNew?: boolean;
  isPopular?: boolean;
};

// ── templates data ────────────────────────────────────────
const templates: Template[] = [
  {
    id: "modern",
    name: "Modern", nameAr: "عصري", nameFr: "Moderne",
    description: "Clean and contemporary design with a focus on readability.",
    descriptionAr: "تصميم عصري ونظيف مع التركيز على سهولة القراءة.",
    descriptionFr: "Design épuré et contemporain axé sur la lisibilité.",
    color: "#2563EB", categories: ["Technology", "Business"], isPopular: true,
  },
  {
    id: "classic",
    name: "Classic", nameAr: "كلاسيك", nameFr: "Classique",
    description: "Traditional format perfect for corporate and formal roles.",
    descriptionAr: "تنسيق تقليدي مثالي للأدوار المؤسسية والرسمية.",
    descriptionFr: "Format traditionnel parfait pour les rôles corporate.",
    color: "#1E293B", categories: ["Business", "Healthcare", "Academic"],
  },
  {
    id: "creative",
    name: "Creative", nameAr: "إبداعي", nameFr: "Créatif",
    description: "Stand out with a unique layout designed for creative fields.",
    descriptionAr: "تميّز بتخطيط فريد مصمم للمجالات الإبداعية.",
    descriptionFr: "Démarquez-vous avec une mise en page unique.",
    color: "#F97316", categories: ["Creative"],
  },
  {
    id: "minimal",
    name: "Minimal", nameAr: "بسيط", nameFr: "Minimaliste",
    description: "Simple, elegant, and straight to the point.",
    descriptionAr: "بسيط وأنيق ومباشر.",
    descriptionFr: "Simple, élégant et direct.",
    color: "#475569", categories: ["Business", "Academic"],
  },
  {
    id: "tech",
    name: "Tech", nameAr: "تقني", nameFr: "Tech",
    description: "Optimized for software engineers and IT professionals.",
    descriptionAr: "مُحسَّن لمهندسي البرمجيات ومتخصصي تكنولوجيا المعلومات.",
    descriptionFr: "Optimisé pour les ingénieurs logiciels.",
    color: "#10B981", categories: ["Technology"], isPopular: true,
  },
  {
    id: "executive",
    name: "Executive", nameAr: "تنفيذي", nameFr: "Exécutif",
    description: "Premium layout for senior management and leadership roles.",
    descriptionAr: "تخطيط متميز للإدارة العليا وأدوار القيادة.",
    descriptionFr: "Mise en page premium pour la direction.",
    color: "#8B5CF6", categories: ["Business"],
  },
  {
    id: "medical",
    name: "Medical", nameAr: "طبي", nameFr: "Médical",
    description: "Specialized format for healthcare professionals.",
    descriptionAr: "تنسيق متخصص للمهنيين الصحيين والأطباء.",
    descriptionFr: "Format spécialisé pour les professionnels de santé.",
    color: "#0EA5E9", categories: ["Healthcare"],
  },
  {
    id: "academic",
    name: "Academic", nameAr: "أكاديمي", nameFr: "Académique",
    description: "Multi-page optimized CV for researchers and educators.",
    descriptionAr: "سيرة ذاتية متعددة الصفحات للباحثين والمعلمين.",
    descriptionFr: "CV multi-pages pour chercheurs et enseignants.",
    color: "#64748B", categories: ["Academic"],
  },
  {
    id: "arabic",
    name: "Arabic (RTL)", nameAr: "عربي (RTL)", nameFr: "Arabe (RTL)",
    description: "Optimized for Arabic language with full RTL support.",
    descriptionAr: "مُحسَّن للغة العربية مع دعم كامل للكتابة من اليمين لليسار.",
    descriptionFr: "Optimisé pour l'arabe avec support RTL complet.",
    color: "#059669", categories: ["Business", "Technology"], isNew: true,
  },
  {
    id: "engineering",
    name: "Engineering", nameAr: "هندسي", nameFr: "Ingénierie",
    description: "Technical and structured layout for engineers.",
    descriptionAr: "تخطيط تقني ومنظم للمهندسين.",
    descriptionFr: "Mise en page technique et structurée pour ingénieurs.",
    color: "#0284C7", categories: ["Engineering", "Technology"],
  },
  {
    id: "finance",
    name: "Finance", nameAr: "مالي", nameFr: "Finance",
    description: "Professional and data-focused layout for finance roles.",
    descriptionAr: "تخطيط احترافي ومرتكز على البيانات للأدوار المالية.",
    descriptionFr: "Mise en page axée sur les données pour la finance.",
    color: "#0F766E", categories: ["Finance", "Business"],
  },
  {
    id: "elegant",
    name: "Elegant", nameAr: "أنيق", nameFr: "Élégant",
    description: "Sophisticated design with refined typography.",
    descriptionAr: "تصميم راقٍ مع طباعة مصقولة.",
    descriptionFr: "Design sophistiqué avec une typographie raffinée.",
    color: "#BE185D", categories: ["Creative", "Business"],
  },
  {
    id: "legal",
    name: "Legal", nameAr: "قانوني", nameFr: "Juridique",
    description: "Formal and authoritative design for legal professionals.",
    descriptionAr: "تصميم رسمي وموثوق لمتخصصي القانون.",
    descriptionFr: "Design formel et autoritaire pour les juristes.",
    color: "#0F172A", categories: ["Business"],
  },
  {
    id: "professional",
    name: "Professional", nameAr: "احترافي", nameFr: "Professionnel",
    description: "Versatile and polished layout for any industry.",
    descriptionAr: "تخطيط متعدد الاستخدامات ومصقول لأي صناعة.",
    descriptionFr: "Mise en page polyvalente pour tous les secteurs.",
    color: "#334155", categories: ["Business", "Technology"],
  },
];

const categories = ["All", "Technology", "Business", "Creative", "Healthcare", "Academic", "Engineering", "Finance"] as const;
type Category = (typeof categories)[number];

// ── i18n helpers ──────────────────────────────────────────
function getTemplateName(t: Template, lang: string) {
  if (lang === "ar") return t.nameAr;
  if (lang === "fr") return t.nameFr;
  return t.name;
}
function getTemplateDesc(t: Template, lang: string) {
  if (lang === "ar") return t.descriptionAr;
  if (lang === "fr") return t.descriptionFr;
  return t.description;
}

// ── Color swatch ──────────────────────────────────────────
const THEME_COLORS = ["#2563EB", "#FF4D2D", "#10B981", "#8B5CF6", "#F97316", "#0EA5E9", "#BE185D", "#0F766E"];

// ── main component ────────────────────────────────────────
export default function TemplatesPage() {
  const { language } = useLanguageStore();
  const { data, updateSettings, resetData } = useResumeStore();
  const navigate = useNavigate();
  const isRtl = language === "ar";

  const [activeCategory, setActiveCategory]   = useState<Category>("All");
  const [search, setSearch]                   = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewColor, setPreviewColor]       = useState<string>("");
  const [hoveredId, setHoveredId]             = useState<string | null>(null);

  const handleSelectTemplate = (templateId: ResumeData["settings"]["template"], color?: string) => {
    resetData();
    updateSettings({ template: templateId, themeColor: color ?? templates.find(t => t.id === templateId)?.color ?? "#2563EB" });
    navigate("/editor");
  };

  const filtered = templates.filter(t => {
    const matchCat  = activeCategory === "All" || t.categories.includes(activeCategory);
    const matchSearch = search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.nameAr.includes(search) ||
      t.categories.some(c => c.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const labels = {
    libraryBadge: language === "ar" ? "مكتبة القوالب" : language === "fr" ? "Bibliothèque" : "Template Library",
    title:        language === "ar" ? "اختر قالب سيرتك" : language === "fr" ? "Choisissez votre modèle" : "Choose Your Template",
    sub:          language === "ar" ? "١٤ قالب احترافي ومتوافق مع ATS — مجاني بالكامل" : language === "fr" ? "14 modèles professionnels et compatibles ATS — 100% gratuits" : "14 professional ATS-optimized templates — all free",
    searchPlaceholder: language === "ar" ? "ابحث عن قالب..." : language === "fr" ? "Rechercher..." : "Search templates...",
    useTemplate:  language === "ar" ? "استخدم القالب" : language === "fr" ? "Utiliser" : "Use Template",
    preview:      language === "ar" ? "معاينة" : language === "fr" ? "Aperçu" : "Preview",
    selected:     language === "ar" ? "محدد" : language === "fr" ? "Sélectionné" : "Selected",
    new_:         language === "ar" ? "جديد" : language === "fr" ? "Nouveau" : "New",
    popular:      language === "ar" ? "الأشهر" : language === "fr" ? "Populaire" : "Popular",
    bestFor:      language === "ar" ? "الأنسب لـ" : language === "fr" ? "Idéal pour" : "Best For",
    features:     language === "ar" ? "المميزات" : language === "fr" ? "Caractéristiques" : "Features",
    colorLabel:   language === "ar" ? "لون القالب" : language === "fr" ? "Couleur" : "Theme Color",
    closePreview: language === "ar" ? "إغلاق" : language === "fr" ? "Fermer" : "Close Preview",
    noResults:    language === "ar" ? "مفيش قوالب بالفلتر ده" : language === "fr" ? "Aucun modèle trouvé" : "No templates found",
    templatesCount: (n: number) => language === "ar" ? `${n} قالب` : language === "fr" ? `${n} modèles` : `${n} templates`,
  };

  return (
    <div className={cn("min-h-screen bg-[#FAFAF8] text-slate-900 font-sans", isRtl && "rtl")}>

      {/* ── Header ── */}
      <header className="bg-[#FAFAF8]/90 border-b border-slate-200/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100">
              <ArrowLeft size={18} className="rtl:rotate-180" />
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-32 sm:w-36 h-auto" variant="gradient" />
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hidden sm:block">{labels.templatesCount(templates.length)}</span>
            <span className="hidden sm:block">·</span>
            <span className="hidden sm:block text-[#FF4D2D] font-medium">100% Free</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* ── Hero ── */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-[#FF4D2D] font-semibold text-xs mb-5 uppercase tracking-wider"
          >
            <LayoutTemplate size={14} />
            {labels.libraryBadge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight"
          >
            {labels.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="text-slate-500 text-lg"
          >
            {labels.sub}
          </motion.p>
        </div>

        {/* ── Search + Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="flex flex-col sm:flex-row gap-4 items-center mb-10"
        >
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full ps-9 pe-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:border-[#FF4D2D] transition-colors"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 flex-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border",
                  activeCategory === cat
                    ? "bg-[#0D0D0B] text-white border-[#0D0D0B] shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                )}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ms-1 opacity-50">
                    {templates.filter(t => t.categories.includes(cat)).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Count */}
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {labels.templatesCount(filtered.length)}
          </span>
        </motion.div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">{labels.noResults}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((template, idx) => {
                const isSelected = data.settings.template === template.id;
                const isHovered  = hoveredId === template.id;

                return (
                  <motion.div
                    layout
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                    onMouseEnter={() => setHoveredId(template.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={cn(
                      "group relative bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 flex flex-col cursor-pointer",
                      isSelected
                        ? "border-[#FF4D2D] shadow-lg shadow-orange-500/10"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                    )}
                  >
                    {/* Badges */}
                    <div className="absolute top-3 start-3 z-20 flex gap-1.5">
                      {template.isNew && (
                        <span className="bg-[#FF4D2D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{labels.new_}</span>
                      )}
                      {template.isPopular && (
                        <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">⭐ {labels.popular}</span>
                      )}
                    </div>

                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-3 end-3 z-20 bg-[#FF4D2D] text-white p-1.5 rounded-full shadow">
                        <CheckCircle2 size={14} />
                      </div>
                    )}

                    {/* Preview area */}
                    <div
                      className="aspect-[1/1.3] relative overflow-hidden bg-slate-100 @container"
                      onClick={() => { setPreviewTemplate(template); setPreviewColor(template.color); }}
                    >
                      {/* Resume scaled preview */}
                      <div
                        className="absolute top-0 start-0 w-[800px] origin-top-left"
                        style={{ transform: "scale(calc(100cqi / 800))" }}
                      >
                        <ResumePreview
                          data={{
                            ...dummyData,
                            settings: { ...dummyData.settings, template: template.id, themeColor: template.color },
                          }}
                        />
                      </div>

                      {/* Bottom fade */}
                      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-white/80 to-transparent z-10" />

                      {/* Hover overlay */}
                      <div className={cn(
                        "absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 transition-all duration-300",
                        isHovered ? "opacity-100 bg-slate-900/25 backdrop-blur-[2px]" : "opacity-0"
                      )}>
                        <button
                          onClick={e => { e.stopPropagation(); handleSelectTemplate(template.id); }}
                          className="bg-[#FF4D2D] text-white px-5 py-2.5 rounded-full font-bold shadow-lg text-sm hover:bg-[#e63e1d] transition-colors"
                        >
                          {isSelected ? labels.selected : labels.useTemplate}
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setPreviewTemplate(template); setPreviewColor(template.color); }}
                          className="bg-white text-slate-800 px-5 py-2.5 rounded-full font-semibold text-sm shadow hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                          <Eye size={14} /> {labels.preview}
                        </button>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="p-4 border-t border-slate-100 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-sm">{getTemplateName(template, language)}</h3>
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 ring-2 ring-white shadow"
                          style={{ background: template.color }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {getTemplateDesc(template, language)}
                      </p>
                      <div className="flex gap-1 flex-wrap mt-2">
                        {template.categories.slice(0, 2).map(cat => (
                          <span key={cat} className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* ── Full Preview Modal ── */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-5xl h-[92vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Sidebar */}
              <div className="w-full md:w-72 bg-[#FAFAF8] border-e border-slate-200 p-6 flex flex-col shrink-0 overflow-y-auto">

                {/* Close mobile */}
                <div className="flex items-center justify-between mb-6 md:hidden">
                  <h2 className="text-xl font-bold">{getTemplateName(previewTemplate, language)}</h2>
                  <button onClick={() => setPreviewTemplate(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                {/* Close desktop */}
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="hidden md:flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 mb-6 transition-colors"
                >
                  <ArrowLeft size={14} className="rtl:rotate-180" /> {labels.closePreview}
                </button>

                <h2 className="text-2xl font-black mb-2 hidden md:block">
                  {getTemplateName(previewTemplate, language)}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {getTemplateDesc(previewTemplate, language)}
                </p>

                {/* Best for */}
                <div className="mb-5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{labels.bestFor}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {previewTemplate.categories.map(cat => (
                      <span key={cat} className="px-3 py-1 bg-orange-50 text-[#FF4D2D] rounded-full text-xs font-semibold border border-orange-100">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{labels.features}</div>
                  <ul className="space-y-1.5">
                    {["ATS-Friendly Layout", "Professional Typography", "Optimized Spacing", "PDF & Word Export"].map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Color picker */}
                <div className="mb-6">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{labels.colorLabel}</div>
                  <div className="flex gap-2 flex-wrap">
                    {THEME_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setPreviewColor(c)}
                        className={cn(
                          "w-7 h-7 rounded-full transition-all border-2",
                          previewColor === c ? "border-slate-900 scale-110 shadow" : "border-transparent hover:scale-105"
                        )}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-auto space-y-2">
                  <button
                    onClick={() => { handleSelectTemplate(previewTemplate.id, previewColor || previewTemplate.color); setPreviewTemplate(null); }}
                    className="w-full bg-[#FF4D2D] hover:bg-[#e63e1d] text-white py-3 rounded-xl font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    {labels.useTemplate}
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="flex-1 bg-slate-100 overflow-auto p-6 flex justify-center items-start">
                <div className="origin-top scale-[0.5] sm:scale-[0.65] md:scale-[0.75] lg:scale-90 xl:scale-100 h-[calc(297mm*0.5)] sm:h-[calc(297mm*0.65)] md:h-[calc(297mm*0.75)] lg:h-[calc(297mm*0.9)] xl:h-auto">
                  <div className="w-[210mm] bg-white shadow-2xl min-h-[297mm]">
                    <ResumePreview
                      data={{
                        ...dummyData,
                        settings: {
                          ...dummyData.settings,
                          template: previewTemplate.id,
                          themeColor: previewColor || previewTemplate.color,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
