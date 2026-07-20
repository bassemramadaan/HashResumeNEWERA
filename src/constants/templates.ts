export interface TemplateOption {
  id: string;
  nameEn: string;
  nameAr: string;
}

export const RESUME_TEMPLATES: TemplateOption[] = [
  { id: "classic", nameEn: "🏛️ Classic", nameAr: "🏛️ كلاسيكي" },
  { id: "modern", nameEn: "💼 Modern", nameAr: "💼 حديث" },
  { id: "executive", nameEn: "👑 Executive", nameAr: "👑 تنفيذي" },
  { id: "minimal", nameEn: "✨ Minimal", nameAr: "✨ بسيط" },
  { id: "timeline", nameEn: "⏱️ Timeline", nameAr: "⏱️ زمني" },
  { id: "two-column", nameEn: "📑 Two-Col", nameAr: "📑 عمودين" },
];
