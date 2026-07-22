import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Sparkles, Info, Star } from "lucide-react";

// Helper function to classify any skill name if we don't have a classifier file yet
export function getSkillCategoryFallback(skillName: string): string {
  const name = skillName.toLowerCase();
  
  if (
    name.includes("design") || name.includes("ui") || name.includes("ux") || 
    name.includes("figma") || name.includes("photoshop") || name.includes("illustrator") ||
    name.includes("creative") || name.includes("brand") || name.includes("graphic") ||
    name.includes("art") || name.includes("copywrite") || name.includes("visual") ||
    name.includes("فوتوشوب") || name.includes("تصميم") || name.includes("ابداع") || name.includes("هوية")
  ) {
    return "creative";
  }
  
  if (
    name.includes("manage") || name.includes("lead") || name.includes("agile") || 
    name.includes("scrum") || name.includes("strategy") || name.includes("product") ||
    name.includes("business") || name.includes("marketing") || name.includes("sales") ||
    name.includes("plan") || name.includes("executive") || name.includes("director") ||
    name.includes("ادارة") || name.includes("قيادة") || name.includes("تخطيط") || name.includes("تسويق") || name.includes("مبيعات")
  ) {
    return "strategy";
  }

  if (
    name.includes("communicat") || name.includes("team") || name.includes("collaborat") || 
    name.includes("present") || name.includes("negotiat") || name.includes("interpersonal") ||
    name.includes("customer") || name.includes("client") || name.includes("social") ||
    name.includes("تواصل") || name.includes("فريق") || name.includes("عمل جماعي") || name.includes("عملاء")
  ) {
    return "collab";
  }

  if (
    name.includes("problem") || name.includes("solv") || name.includes("analyt") || 
    name.includes("research") || name.includes("algorithm") || name.includes("logic") ||
    name.includes("math") || name.includes("science") || name.includes("data") ||
    name.includes("critical") || name.includes("حل") || name.includes("مشكل") || name.includes("تحليل") || name.includes("بحث")
  ) {
    return "problem";
  }

  return "tech";
}

interface SkillsRadarGraphProps {
  skills: string[];
  skillLevels: Record<string, number>;
  skillCategories: Record<string, string>;
  language: string;
}

const CATEGORIES = ["tech", "collab", "strategy", "problem", "creative"];

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  ar: {
    tech: "الخبرة التقنية",
    collab: "العمل الجماعي",
    strategy: "القيادة والتخطيط",
    problem: "حل المشكلات",
    creative: "التصميم والابتكار",
  },
  en: {
    tech: "Hard / Tech",
    collab: "Collaboration",
    strategy: "Strategy & Lead",
    problem: "Problem Solving",
    creative: "Creative / UX",
  },
  fr: {
    tech: "Technique",
    collab: "Collaboration",
    strategy: "Stratégie",
    problem: "Résolution",
    creative: "Créativité",
  },
};

const LEVEL_NAMES: Record<string, string[]> = {
  ar: ["مبتدئ", "متوسط", "متقدم", "خبير", "محترف خارق"],
  en: ["Beginner", "Intermediate", "Advanced", "Expert", "Superhero"],
  fr: ["Débutant", "Intermédiaire", "Avancé", "Expert", "Superhéros"],
};

export default function SkillsRadarGraph({
  skills,
  skillLevels,
  skillCategories,
  language,
}: SkillsRadarGraphProps) {
  const isRtl = language === "ar";
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate scores for the 5 categories
  const categoryData = useMemo(() => {
    const scores = CATEGORIES.map((cat) => {
      // Find skills in this category
      const catSkills = skills.filter((skill) => {
        const customCat = skillCategories[skill];
        return customCat ? customCat === cat : getSkillCategoryFallback(skill) === cat;
      });

      if (catSkills.length === 0) {
        return {
          category: cat,
          score: 1.5, // Subtle baseline representing latent capability
          skillsList: [] as string[],
        };
      }

      const totalScore = catSkills.reduce((sum, skill) => sum + (skillLevels[skill] ?? 4), 0);
      const avgScore = totalScore / catSkills.length;

      return {
        category: cat,
        score: avgScore,
        skillsList: catSkills,
      };
    });

    return scores;
  }, [skills, skillLevels, skillCategories]);

  // Center coordinates & radius
  const cx = 130;
  const cy = 130;
  const R = 80;

  // Angles for pentagon axes: top is -Math.PI / 2
  const angles = useMemo(() => {
    return [0, 1, 2, 3, 4].map((i) => (2 * Math.PI * i) / 5 - Math.PI / 2);
  }, []);

  // Compute coordinates of active polygon vertices
  const pointsString = useMemo(() => {
    return categoryData
      .map((d, i) => {
        const val = d.score;
        const r = (val / 5) * R;
        const x = cx + r * Math.cos(angles[i]);
        const y = cy + r * Math.sin(angles[i]);
        return `${x},${y}`;
      })
      .join(" ");
  }, [categoryData, angles]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 md:p-6 bg-slate-900 rounded-2.5xl text-white border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Absolute decorative ambient elements */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-500/15 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-brand-500/15 rounded-full blur-xl pointer-events-none" />

      {/* Radar SVG */}
      <div className="relative shrink-0 w-[260px] h-[260px]">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 260 260">
          {/* Defs for glow filter */}
          <defs>
            <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="poly-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF7A60" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Draw Concentric pentagon grids (Levels 1 to 5) */}
          {[1, 2, 3, 4, 5].map((lvl) => {
            const r = (lvl / 5) * R;
            const gridPoints = angles
              .map((angle) => {
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                return `${x},${y}`;
              })
              .join(" ");

            return (
              <polygon
                key={`grid-${lvl}`}
                points={gridPoints}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                strokeDasharray={lvl < 5 ? "3,3" : "0"}
              />
            );
          })}

          {/* Draw Radial axis lines */}
          {angles.map((angle, i) => {
            const x = cx + R * Math.cos(angle);
            const y = cy + R * Math.sin(angle);
            return (
              <line
                key={`axis-${i}`}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Draw filled/stroke active Radar polygon */}
          {skills.length > 0 && (
            <motion.polygon
              points={pointsString}
              fill="url(#poly-grad)"
              stroke="#2563FF"
              strokeWidth="2.5"
              filter="url(#radar-glow)"
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* Active vertices handle dots */}
          {categoryData.map((d, i) => {
            const val = d.score;
            const r = (val / 5) * R;
            const x = cx + r * Math.cos(angles[i]);
            const y = cy + r * Math.sin(angles[i]);

            return (
              <g
                key={`vertex-${i}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="#2563FF"
                  className="transition-all hover:scale-150 duration-200"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="transparent"
                  className="hover:stroke-brand-600/20 hover:stroke-[3px]"
                />
              </g>
            );
          })}

          {/* Category Axis Labels */}
          {categoryData.map((d, i) => {
            const label = CATEGORY_LABELS[language]?.[d.category] || d.category;
            const angle = angles[i];
            // Push labels slightly outwards from R
            const labelDist = R + 18;
            const x = cx + labelDist * Math.cos(angle);
            const y = cy + labelDist * Math.sin(angle);

            // Alignment adjustments
            let textAnchor = "middle";
            if (Math.cos(angle) > 0.1) textAnchor = isRtl ? "end" : "start";
            else if (Math.cos(angle) < -0.1) textAnchor = isRtl ? "start" : "end";

            return (
              <text
                key={`label-${i}`}
                x={x}
                y={y + 4}
                textAnchor={textAnchor}
                className={`text-[10px] font-black fill-slate-300 hover:fill-brand-400 cursor-pointer transition-colors ${
                  hoveredIndex === i ? "fill-brand-600 scale-102 font-extrabold" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Right Side Info Details Card */}
      <div className="flex-1 w-full flex flex-col justify-center text-start md:border-s md:border-slate-800 md:ps-6 py-2 min-h-[180px]">
        {hoveredIndex !== null ? (
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -6 : 6 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-brand-400">
                {CATEGORY_LABELS[language]?.[categoryData[hoveredIndex].category]}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2.5 py-0.5 rounded-full">
                {categoryData[hoveredIndex].score.toFixed(1)} / 5
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-450 uppercase block">
                {isRtl ? "المستوى التقديري:" : "Estimated Grade:"}
              </span>
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                {LEVEL_NAMES[language]?.[Math.round(categoryData[hoveredIndex].score) - 1] || "—"}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-450 uppercase block mb-1">
                {isRtl ? "المهارات المندرجة تحت هذا القسم:" : "Associated Skills in Stack:"}
              </span>
              {categoryData[hoveredIndex].skillsList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {categoryData[hoveredIndex].skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] bg-slate-800/80 text-white font-medium px-2 py-1 rounded-lg border border-slate-700/50"
                    >
                      {skill} ({skillLevels[skill] ?? 4})
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[11px] text-slate-500 italic">
                  {isRtl ? "لا توجد مهارات مضافة في هذا التصنيف بعد" : "No skills added to this track yet"}
                </span>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3.5 text-center md:text-start flex flex-col items-center md:items-start justify-center">
            <div className="p-2 bg-brand-600/10 rounded-xl text-brand-600 shrink-0">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">
                {isRtl ? "رادار المهارات ثلاثي الأبعاد والذكي" : "3D Skills Radar Spectrum"}
              </h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1">
                {isRtl
                  ? "قم بتحديد مستويات مهاراتك الفنية والشخصية بالأسفل، وسيتحرك المخطط التفاعلي مباشرة لعكس توازن كفاءتك المهنية ومطابقتها للمتطلبات."
                  : "Rate your skills using the level controls below. The interactive radar will dynamically stretch and move to represent your professional balance."}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-950 px-2.5 py-1 rounded-lg">
              <Info size={11} />
              <span>{isRtl ? "مرر فوق زوايا المخطط للتفاصيل" : "Hover over angles for details"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
