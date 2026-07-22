import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutTemplate, Check, ArrowRight, ArrowLeft, Star } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useResumeStore } from "@/store/useResumeStore";
import TiltCard from "@/components/landing/TiltCard";

const TEMPLATE_HIGHLIGHTS = [
  {
    id: "modern",
    nameAr: "روبي التكنولوجي الحديث",
    nameEn: "Modern Ruby",
    nameFr: "Ruby Moderne",
    descAr: "تصميم أنيق مزدوج العمود يبرز نقاط قوتك وإنجازاتك بتركيز بصري ممتاز وبأقصى درجات المقروئية.",
    descEn: "An elegant, clean two-column structure highlighting your strengths with outstanding focal points.",
    descFr: "Une mise en page moderne à double colonne, conçue pour souligner vos forces cliniques.",
    color: "#2563FF",
    bgClass: "from-rose-50 to-orange-50",
    featuresAr: ["عمود مزدوج لحفظ المساحة", "مثالي لمجال التقنية والتسويق", "فحص ATS فائق السهولة"],
    featuresEn: ["Saves page height", "Perfect for tech/marketing", "Top ATS indexing rate"],
    featuresFr: ["Structure compacte", "Idéal pour la tech & marketing", "Validation ATS totale"]
  },
  {
    id: "tech",
    nameAr: "زمردي المبرمجين التقني",
    nameEn: "Tech Emerald",
    nameFr: "Tech Émeraude",
    descAr: "الخيار الأول للمهندسين والمطورين. بنية شبكية دقيقة وجداول مهارات واضحة تعكس احترافيتك الفنية.",
    descEn: "The absolute elite layout for software developers. Precise structural components and clear skill nodes.",
    descFr: "Le choix élite des ingénieurs réseau. Des grilles précises et une hiérarchie irréprochable.",
    color: "#10B981",
    bgClass: "from-[#F0FDF4] to-[#ECFDF5]",
    featuresAr: ["منظم للغاية للبيانات الفنية", "رسم مخصص للمهارات", "سلس مع الأدوار الهندسية"],
    featuresEn: ["Ultra-organized developer grid", "Dedicated skills capsules", "Tailored for IT roles"],
    featuresFr: ["Grilles techniques", "Badges de compétences", "Idéal pour l'ingénierie"]
  },
  {
    id: "classic",
    nameAr: "الفضي الاحترافي العريق",
    nameEn: "Classic Charcoal",
    nameFr: "Charbon Classique",
    descAr: "تنسيق مهني رصين مصمم للقطاعات المصرفية والطبية والمالية حيث تكون التقاليد والموثوقية هما الأساس.",
    descEn: "A timeless academic & corporate layout. Refined margins, classic line dividers, high seriousness.",
    descFr: "Format traditionnel et rigoureux pour les secteurs formels, banques, administration et droit.",
    color: "#2C3E50",
    bgClass: "from-slate-50 to-zinc-100",
    featuresAr: ["تخطيط كلاسيكي فخم", "الأفضل للمناصب التنفيذية", "متناسق مع المستندات الطبية"],
    featuresEn: ["Timeless structural elements", "Best for Directors & executives", "Highly medical friendly"],
    featuresFr: ["Mise en page épurée", "Cadres exécutifs & directeurs", "Idéal secteur santé/finance"]
  },
  {
    id: "creative",
    nameAr: "الاستوديو الإبداعي الجريء",
    nameEn: "Creative Orange",
    nameFr: "Orange Créatif",
    descAr: "قالب ديناميكي نابض بالحياة لتتميز فوراً في المقابلات لدى الوكلات الإعلانية ومصممي تجربة المستخدم.",
    descEn: "A vibrant, stylish sidebar-equipped format built to capture immediately the attention of top agencies.",
    descFr: "Un format moderne et dynamique avec barre latérale pour capturer instantanément l'attention.",
    color: "#F97316",
    bgClass: "from-amber-50 to-orange-100/40",
    featuresAr: ["شريط جانبي مميز للمعلومات", "توازن فريد بين الفن والبروفايل", "رائع للمصممين والمنتجين"],
    featuresEn: ["Distinctive info sidebar", "Splendid typographic balance", "Excellent for designers"],
    featuresFr: ["Barre latérale stylisée", "Équilibre artistique", "Parfait pour les designers"]
  }
];

export function PremiumTemplatesGallery() {
  const { language: lang } = useLanguageStore();
  const navigate = useNavigate();
  const { resetData, updateSettings } = useResumeStore();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const isAr = lang === "ar";
  
  const handleSelect = (templateId: string, defaultColor: string) => {
    resetData();
    updateSettings({
      template: templateId,
      themeColor: defaultColor,
    });
    // Scroll to top upon navigation
    window.scrollTo({ top: 0 });
    navigate("/editor");
  };

  const t = {
    badge: isAr ? "قوالب احترافية" : "PROFESSIONAL TEMPLATES",
    title: isAr ? "اختر قالبك" : "Choose Your Layout",
    desc: isAr 
      ? "ابدأ بتوفير آلاف الساعات لتصميم ملفك. اختر قالبك المناسب بنقرة واحدة، واملأ بياناتك لتبهر مسؤولي التوظيف."
      : "Skip thousands of design iterations. Pre-load your optimal template configuration in one satisfying click.",
    cta: isAr ? "ابدأ كتابة سيرتك بهذا التصميم" : "Use Layout & Start Writing",
    newTag: isAr ? "جديد" : "New",
  };

  return (
    <section className="py-24 bg-slate-50/50 border-y border-slate-100 relative overflow-hidden select-none" id="templates-gallery">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[20%] -end-[10%] w-[350px] h-[350px] rounded-full bg-orange-100/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] -start-[10%] w-[350px] h-[350px] rounded-full bg-emerald-100/20 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600/5 border border-brand-600/10 text-brand-600 text-[10px] font-black uppercase tracking-widest mb-3.5">
            <LayoutTemplate size={12} className="animate-spin-slow" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-slate-500 text-sm md:text-base mt-4 leading-relaxed font-semibold max-w-xl mx-auto">
            {t.desc}
          </p>
        </div>

        {/* Templates Grid with interactive visual feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TEMPLATE_HIGHLIGHTS.map((tpl) => {
            const isHovered = hoveredCard === tpl.id;
            const name = isAr ? tpl.nameAr : lang === "fr" ? tpl.nameFr : tpl.nameEn;
            const desc = isAr ? tpl.descAr : lang === "fr" ? tpl.descFr : tpl.descEn;
            const features = isAr ? tpl.featuresAr : lang === "fr" ? tpl.featuresFr : tpl.featuresEn;

            return (
              <TiltCard
                key={tpl.id}
                onMouseEnter={() => setHoveredCard(tpl.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white rounded-3xl border border-slate-150 p-6 md:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group shadow-sm hover:border-slate-200 ${
                  isHovered ? "shadow-[0_20px_40px_rgba(0,0,0,0.06)] scale-[1.01]" : ""
                }`}
              >
                {/* Visual Accent Corner Glow */}
                <div 
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 filter blur-xl transition-opacity group-hover:opacity-20"
                  style={{ backgroundColor: tpl.color }}
                />

                {/* Content details */}
                <div className="space-y-6 text-start">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full border-2" style={{ borderColor: tpl.color, backgroundColor: isHovered ? tpl.color : "transparent" }} />
                      <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
                        {name}
                      </h3>
                    </div>
                    {tpl.id === "modern" && (
                      <span className="text-[10px] bg-brand-600 text-white px-2.5 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
                        <Star size={10} className="fill-white" />
                        {isAr ? "الأكثر طلباً" : "Most Popular"}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
                    {desc}
                  </p>

                  {/* Feature Checkmarks inline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-slate-100">
                    {features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <Check size={11} className="text-emerald-500 font-bold" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Resume Skeletal Preview Card - Gives user direct feel */}
                <div className={`mt-8 p-4 rounded-2xl bg-gradient-to-b ${tpl.bgClass} border border-slate-200/50 flex flex-col gap-2`}>
                  <div className="flex justify-between items-center pb-2 border-b border-white">
                    <div className="space-y-1 text-start">
                      <div className="h-2 w-16 rounded bg-slate-400/30" />
                      <div className="h-1.5 w-24 rounded bg-slate-400/20" />
                    </div>
                    <div className="w-6 h-6 rounded-full animate-pulse" style={{ backgroundColor: tpl.color }} />
                  </div>
                  <div className="flex gap-4">
                    {/* Columns skeleton */}
                    <div className="w-3/5 space-y-2 text-start">
                      <div className="h-1.5 w-1/2 rounded bg-slate-300" />
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded bg-slate-200" />
                        <div className="h-1 w-full rounded bg-slate-200" />
                        <div className="h-1 w-4/5 rounded bg-slate-200" />
                      </div>
                    </div>
                    <div className="w-2/5 space-y-2 text-start">
                      <div className="h-1.5 w-4/5 rounded bg-slate-300" />
                      <div className="flex flex-wrap gap-1">
                        <div className="h-2.5 w-6 rounded bg-white border border-slate-100" />
                        <div className="h-2.5 w-8 rounded bg-white border border-slate-100" />
                        <div className="h-2.5 w-7 rounded bg-white border border-slate-100" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Trigger Action */}
                <div className="mt-8">
                  <button
                    onClick={() => handleSelect(tpl.id, tpl.color)}
                    className="w-full bg-brand-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-2xl font-black text-xs md:text-sm tracking-wider shadow-md hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t.cta}</span>
                    {isAr ? (
                      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                </div>

              </TiltCard>
            );
          })}
        </div>

      </div>
    </section>
  );
}
