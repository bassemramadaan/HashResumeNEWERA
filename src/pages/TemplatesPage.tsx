import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, LayoutTemplate, CheckCircle2, Eye, X, Sparkles, Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useLanguageStore } from "../store/useLanguageStore";
import { useResumeStore, ResumeData } from "../store/useResumeStore";
import ResumePreview from "../components/preview/ResumePreview";
import { cn } from "@/lib/utils";

// ── dummy data (نفس اللي كان موجود) ──────────────────────
const dummyData: ResumeData = {
  personalInfo: {
    fullName: "Professional Name",
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
    themeColor: "#2563FF",
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
  bestFor: string;
  bestForAr: string;
  bestForFr: string;
};

// ── templates data ────────────────────────────────────────
const templates: Template[] = [
  {
    id: "classic",
    name: "Classic", nameAr: "كلاسيك", nameFr: "Classique",
    description: "Traditional format perfect for corporate, legal, and banking roles.",
    descriptionAr: "تنسيق تقليدي كلاسيكي مثالي للأدوار المؤسسية، القانونية، والقطاعات الرسمية والمالية.",
    descriptionFr: "Format traditionnel parfait pour les rôles d'entreprise et formels.",
    color: "#1E293B", categories: ["Business", "Academic", "Finance"], isPopular: true,
    bestFor: "Corporate, HR & Finance", bestForAr: "الشركات، الموارد البشرية والمالية", bestForFr: "Entreprise, RH & Finance"
  },
  {
    id: "modern",
    name: "Modern", nameAr: "عصري", nameFr: "Moderne",
    description: "Clean and contemporary design with a focus on readability and tech roles.",
    descriptionAr: "تصميم عصري ونظيف مع التركيز على سهولة القراءة وملائم جداً للمجالات التقنية والبرمجة.",
    descriptionFr: "Design épuré et contemporain axé sur la lisibilité et la technologie.",
    color: "#2563FF", categories: ["Technology", "Creative"], isPopular: true,
    bestFor: "Tech, Software & Startups", bestForAr: "التقنية، البرمجة والشركات الناشئة", bestForFr: "Tech, Logiciels & Startups"
  },
  {
    id: "executive",
    name: "Executive", nameAr: "تنفيذي", nameFr: "Exécutif",
    description: "Premium layout with a prominent header for senior management and leadership roles.",
    descriptionAr: "تخطيط متميز بلمسات قيادية وهيدر بارز للإدارة العليا وأدوار القيادة والاستشارات.",
    descriptionFr: "Mise en page premium pour la direction et les postes de leadership.",
    color: "#8B5CF6", categories: ["Business", "Finance"], isNew: true,
    bestFor: "Executives & Managers", bestForAr: "المدراء التنفيذيين والإدارة العليا", bestForFr: "Cadres & Direction"
  },
  {
    id: "minimal",
    name: "Minimal", nameAr: "مبسط", nameFr: "Minimaliste",
    description: "Simple, elegant, and straight to the point.",
    descriptionAr: "تصميم بسيط، أنيق ومباشر يركز كلياً على انسيابية عرض النص.",
    descriptionFr: "Simple, élégant et direct, centré sur le contenu.",
    color: "#475569", categories: ["Academic", "Healthcare"],
    bestFor: "Freshers & Academics", bestForAr: "الخريجين الجدد والأكاديميين", bestForFr: "Nouveaux diplômés & Académiques"
  },
  {
    id: "two-column",
    name: "Two-Column", nameAr: "ثنائي الأعمدة", nameFr: "Deux Colonnes",
    description: "Modern layout with a distinct sidebar for skills and contact information.",
    descriptionAr: "تخطيط كلاسيكي وعصري من عمودين لتنظيم المهارات ومعلومات الاتصال بشكل جانبي مميز.",
    descriptionFr: "Mise en page moderne à deux colonnes avec une barre latérale pour les compétences.",
    color: "#0EA5E9", categories: ["Technology", "Creative", "Healthcare"], isNew: true,
    bestFor: "Creatives & Designers", bestForAr: "المبدعين، التسويق والتصميم", bestForFr: "Créatifs, Marketing & Design"
  },
];

const categories = ["All", "Technology", "Business", "Creative", "Healthcare", "Academic", "Engineering", "Finance"] as const;
type Category = (typeof categories)[number];

const CATEGORY_TRANSLATIONS: Record<string, { ar: string, en: string, fr: string }> = {
  All: { ar: "الكل", en: "All", fr: "Tout" },
  Technology: { ar: "برمجيات وتقنية", en: "Technology", fr: "Technologie" },
  Business: { ar: "إدارة وأعمال", en: "Business", fr: "Affaires" },
  Creative: { ar: "فنون وإبداع", en: "Creative", fr: "Créatif" },
  Healthcare: { ar: "صحة وطب", en: "Healthcare", fr: "Santé" },
  Academic: { ar: "تعليم وأكاديمي", en: "Academic", fr: "Académique" },
  Engineering: { ar: "هندسة", en: "Engineering", fr: "Ingénierie" },
  Finance: { ar: "مالية ومحاسبة", en: "Finance", fr: "Finance" }
};

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
const THEME_COLORS = ["#2563FF", "#1E293B", "#10B981", "#8B5CF6", "#F97316", "#0EA5E9", "#BE185D", "#0F766E"];

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

  const hasActiveDraft = 
    (data.personalInfo?.fullName || "").trim() !== "" ||
    (data.personalInfo?.jobTitle || "").trim() !== "" ||
    (data.experience || []).length > 0 ||
    (data.education || []).length > 0 ||
    (data.skills || []).length > 0 ||
    (data.projects || []).length > 0 ||
    (data.certifications || []).length > 0;

  const handleSelectTemplate = (templateId: ResumeData["settings"]["template"], color?: string) => {
    updateSettings({ template: templateId, themeColor: color ?? templates.find(t => t.id === templateId)?.color ?? "#2563FF" });
    navigate("/editor");
  };

  const filtered = templates.filter(t => {
    const matchCat  = activeCategory === "All" || t.categories.includes(activeCategory);
    const searchLower = search.toLowerCase();
    const matchSearch = search === "" ||
      t.name.toLowerCase().includes(searchLower) ||
      t.nameAr.toLowerCase().includes(searchLower) ||
      t.nameFr.toLowerCase().includes(searchLower) ||
      t.categories.some(c => c.toLowerCase().includes(searchLower));
    return matchCat && matchSearch;
  });

  const labels = {
    libraryBadge: language === "ar" ? "مكتبة القوالب" : language === "fr" ? "Bibliothèque" : "Template Library",
    title:        language === "ar" ? "اختر قالب سيرتك" : language === "fr" ? "Choisissez votre modèle" : "Choose Your Template",
    sub: language === "ar" ? `${templates.length} قالب احترافي ومتوافق مع ATS — مجاني بالكامل` : language === "fr" ? `${templates.length} modèles professionnels et compatibles ATS — 100% gratuits` : `${templates.length} professional ATS-optimized templates — all free`,
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
    <div className={cn("min-h-screen bg-[#FAFAF8] text-slate-900 font-sans pb-36", isRtl && "rtl")}>
      <Helmet>
        <title>قوالب CV احترافية | Hash Resume</title>
        <meta name="description" content="اختر من بين قوالب CV احترافية ATS-Friendly بالعربي والإنجليزي. قوالب مجانية جاهزة للتحميل." />
        <link rel="canonical" href="https://hashresume.com/templates" />
      </Helmet>

      {/* ── Header ── */}
      <header className="bg-white/90 border-b border-slate-200/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100">
              <ArrowLeft size={18} className="rtl:rotate-180" />
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hidden sm:block text-brand-600 font-black flex items-center gap-1.5 bg-brand-50/50 px-3 py-1 rounded-full text-xs border border-brand-100/50">
              <Sparkles size={12} className="animate-pulse" />
              {language === "ar" ? "ابنِ وعاين مجاناً بالكامل — ادفع فقط عند التصدير" : "Build & preview for free — pay only when you download"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* ── Hero ── */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-600 font-black text-xs mb-5 uppercase tracking-wider shadow-2xs"
          >
            <LayoutTemplate size={14} />
            {labels.libraryBadge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight text-slate-900"
          >
            {labels.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="flex flex-col items-center gap-2.5"
          >
            <p className="text-slate-600 text-lg font-bold leading-relaxed">
              {language === "ar" ? "5 قوالب احترافية مصممة لاجتياز أنظمة الفرز الآلي (ATS)" : "5 professional, battle-tested templates optimized for ATS algorithms"}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-black text-xs border border-emerald-200/60 shadow-xs">
              <CheckCircle2 size={12} className="stroke-[2.5]" />
              <span>{language === "ar" ? "100% مجانية وبدون علامات مائية" : "100% Free — No Watermarks"}</span>
            </div>
          </motion.div>

          {hasActiveDraft && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 inline-flex flex-col sm:flex-row gap-4 justify-center items-center p-4 px-6 rounded-2xl bg-orange-50 border border-orange-100 text-slate-700 text-xs sm:text-sm font-semibold max-w-xl mx-auto relative overflow-hidden shadow-2xs"
            >
              <div className="absolute top-0 start-0 w-1.5 h-full bg-brand-600" />
              <span className="text-start leading-normal text-slate-600 font-bold">
                {language === "ar" 
                  ? "لديك مسودة نشطة محفوظة. سيتم تطبيق التصميم واللون فوراً دون فقدان أي بيانات !" 
                  : language === "fr"
                  ? "Brouillon enregistré détecté. Vos modifications seront appliquées directement !"
                  : "Active draft detected. Design changes will apply directly without losing any text!"}
              </span>
              <button
                onClick={() => {
                  if (confirm(
                    language === "ar" 
                      ? "هل أنت متأكد من مسح كافة البيانات الحالية وبدء سيرة جديدة بالكامل؟" 
                      : language === "fr"
                      ? "Êtes-vous sûr de vouloir tout effacer et recommencer à zéro ?"
                      : "Are you sure you want to erase all current data and start a completely fresh draft?"
                  )) {
                    resetData();
                    navigate("/editor");
                  }
                }}
                className="bg-white hover:bg-brand-600 hover:text-white border border-slate-200 hover:border-transparent text-slate-800 px-3.5 py-2 rounded-xl font-black transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-sm active:scale-95"
              >
                {language === "ar" ? "بدء مسودة جديدة 🗑️" : language === "fr" ? "Nouveau brouillon 🗑️" : "Start Fresh Draft 🗑️"}
              </button>
            </motion.div>
          )}
        </div>

        {/* ── Search + Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 max-w-6xl mx-auto"
        >
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full ps-10 pe-4 py-3 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10 transition-all font-semibold shadow-xs text-slate-800"
            />
          </div>

          {/* Category filters */}
          <div className="w-full md:w-auto flex items-center justify-end">
            {/* Mobile Dropdown */}
            <div className="sm:hidden w-full relative">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as Category)}
                className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-3 px-4 pe-10 rounded-xl text-xs font-bold outline-none focus:border-brand-600 transition-colors shadow-xs"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_TRANSLATIONS[cat]?.[language] || cat}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden sm:flex flex-wrap justify-end gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer active:scale-95",
                    activeCategory === cat
                      ? "bg-[#0D0D0B] text-white border-[#0D0D0B]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {CATEGORY_TRANSLATIONS[cat]?.[language] || cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">{labels.noResults}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    onClick={() => { setPreviewTemplate(template); setPreviewColor(template.color); }}
                    className={cn(
                      "group relative bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 flex flex-col cursor-pointer w-full max-w-[380px] md:max-w-none mx-auto",
                      isSelected
                        ? "border-brand-600 shadow-xl shadow-brand-500/10"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-2xl hover:-translate-y-1"
                    )}
                  >
                    {/* Badges */}
                    <div className="absolute top-4 start-4 z-20 flex flex-wrap gap-1 max-w-[calc(100%-36px)]">
                      {template.isNew && (
                        <span className="bg-brand-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-xs">{labels.new_}</span>
                      )}
                      {template.isPopular && (
                        <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-xs">⭐ {labels.popular}</span>
                      )}
                    </div>

                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-4 end-4 z-20 bg-brand-600 text-white p-2 rounded-full shadow-lg">
                        <CheckCircle2 size={16} />
                      </div>
                    )}

                    {/* Preview area */}
                    <div
                      className="aspect-[1/1.3] relative overflow-hidden bg-slate-100 border-b border-slate-100 @container"
                      onClick={() => { setPreviewTemplate(template); setPreviewColor(template.color); }}
                    >
                      {/* Resume scaled preview */}
                      <div
                        className="absolute top-0 start-0 w-[800px] origin-top-left"
                        style={{ transform: "scale(calc(100cqi / 800))" }}
                      >
                        <ResumePreview
                          isMini={true}
                          data={{
                            ...dummyData,
                            settings: { ...dummyData.settings, template: template.id, themeColor: template.color },
                          }}
                        />
                      </div>

                      {/* Bottom fade */}
                      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white/90 to-transparent z-10 pointer-events-none" />

                      {/* Hover overlay */}
                      <div className={cn(
                        "absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 transition-all duration-300",
                        isHovered ? "opacity-100 bg-slate-900/40 backdrop-blur-[2px]" : "opacity-0"
                      )}>
                        <button
                          onClick={e => { e.stopPropagation(); handleSelectTemplate(template.id); }}
                          className="bg-brand-600 text-white px-6 py-3 rounded-xl font-black shadow-lg text-xs tracking-wider uppercase hover:bg-brand-700 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                        >
                          {isSelected ? labels.selected : labels.useTemplate}
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setPreviewTemplate(template); setPreviewColor(template.color); }}
                          className="bg-white text-slate-800 px-5 py-2.5 rounded-xl font-black text-xs shadow hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye size={13} /> {labels.preview}
                        </button>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-black text-slate-900 text-base">{getTemplateName(template, language)}</h3>
                          <div
                            className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ring-2 ring-white shadow-md border border-slate-100"
                            style={{ background: template.color }}
                          />
                        </div>
                        
                        {/* Target audience badge - Mini Labels */}
                        <div className="mb-3 flex items-center gap-1 text-[11px] font-black text-brand-600 bg-brand-50/50 px-2.5 py-1 rounded-lg w-fit border border-brand-100/30">
                          <Sparkles size={11} className="shrink-0 animate-pulse text-brand-500" />
                          <span className="truncate">
                            {language === "ar" ? `${labels.bestFor}: ${template.bestForAr}` : `${labels.bestFor}: ${template.bestFor}`}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          {getTemplateDesc(template, language)}
                        </p>
                      </div>

                      {/* Card Action Button pair */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSelectTemplate(template.id); }}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-xs font-black transition-all cursor-pointer text-center active:scale-98 shadow-xs border",
                            isSelected 
                              ? "bg-slate-100 text-slate-800 border-slate-200" 
                              : "bg-[#0D0D0B] hover:bg-brand-600 hover:border-brand-600 text-white border-[#0D0D0B] hover:shadow-md"
                          )}
                        >
                          {isSelected ? labels.selected : labels.useTemplate}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template); setPreviewColor(template.color); }}
                          className="px-3.5 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center shadow-2xs"
                          title={labels.preview}
                        >
                          <Eye size={14} />
                        </button>
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
                      <span key={cat} className="px-3 py-1 bg-orange-50 text-brand-600 rounded-full text-xs font-semibold border border-orange-100">
                        {CATEGORY_TRANSLATIONS[cat]?.[language] || cat}
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
                  <div className="flex gap-2.5 flex-wrap">
                    {THEME_COLORS.map((c, idx) => {
                      const isActive = (previewColor || previewTemplate.color) === c;
                      return (
                        <button
                          key={`${c}-${idx}`}
                          onClick={() => setPreviewColor(c)}
                          className={cn(
                            "w-8 h-8 rounded-full transition-all flex items-center justify-center cursor-pointer relative",
                            isActive 
                              ? "scale-110 shadow-md ring-2 ring-offset-2 ring-slate-800" 
                              : "hover:scale-105 hover:shadow-sm"
                          )}
                          style={{ background: c }}
                          title={c}
                        >
                          {isActive && (
                            <svg className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-auto space-y-2">
                  <button
                    onClick={() => { handleSelectTemplate(previewTemplate.id, previewColor || previewTemplate.color); setPreviewTemplate(null); }}
                    className="w-full bg-brand-600 hover:bg-[#e63e1d] text-white py-3 rounded-xl font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
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
