import React from 'react'
import type { AppLang } from '@/hooks/useDirection'

interface FeaturesSectionProps { lang: AppLang }

const FEATURES = {
  ar: [
    { icon: "🤖", title: "ذكاء اصطناعي حقيقي", desc: "Gemini AI يكتب المحتوى المهني بأسلوبك — مش ترجمة حرفية من إنجليزي.", tag: "AI", tagColor: "#FF4D2D", tagBg: "rgba(255,77,45,0.1)" },
    { icon: "🎯", title: "ATS متوافق 100%", desc: "كل الـ templates مصممة تعدي أنظمة الفلترة الأوتوماتيكية عند أكبر الشركات.", tag: "مهم", tagColor: "#0F6E56", tagBg: "rgba(15,110,86,0.1)" },
    { icon: "🌍", title: "عربي • إنجليزي • فرنسي", desc: "RTL حقيقي للعربي — مش مجرد تعكيس للنص. الوحيد في السوق بيدعم الفرنسية.", tag: "حصري", tagColor: "#534AB7", tagBg: "rgba(83,74,183,0.1)" },
    { icon: "⚡", title: "5 دقائق بدون تسجيل", desc: "مفيش account، مفيش email، مفيش انتظار. تبدأ دلوقتي وتنزّل PDF على طول.", tag: "سريع", tagColor: "#854F0B", tagBg: "rgba(133,79,11,0.1)" },
    { icon: "📄", title: "PDF + Word تصدير", desc: "نزّل بالصيغتين. كتير من أصحاب العمل في MENA بيطلبوا Word صريح.", tag: "مميز", tagColor: "#185FA5", tagBg: "rgba(24,95,165,0.1)" },
    { icon: "🔒", title: "خصوصية كاملة", desc: "بياناتك مش بتتخزن على سيرفراتنا. كل شيء بيشتغل في المتصفح بتاعك.", tag: "آمن", tagColor: "#0F6E56", tagBg: "rgba(15,110,86,0.1)" },
  ],
  en: [
    { icon: "🤖", title: "True AI", desc: "Gemini AI writes professional content in your style — not just literal translation.", tag: "AI", tagColor: "#FF4D2D", tagBg: "rgba(255,77,45,0.1)" },
    { icon: "🎯", title: "100% ATS Friendly", desc: "All templates are designed to pass automated filtering systems at top companies.", tag: "Important", tagColor: "#0F6E56", tagBg: "rgba(15,110,86,0.1)" },
    { icon: "🌍", title: "Arabic • English • French", desc: "True RTL for Arabic. We are the only platform supporting French natively.", tag: "Exclusive", tagColor: "#534AB7", tagBg: "rgba(83,74,183,0.1)" },
    { icon: "⚡", title: "5 Mins, No Sign-up", desc: "No account, no email, no waiting. Start now and download PDF instantly.", tag: "Fast", tagColor: "#854F0B", tagBg: "rgba(133,79,11,0.1)" },
    { icon: "📄", title: "PDF + Word Export", desc: "Download in both formats. Many employers in MENA explicitly request Word.", tag: "Special", tagColor: "#185FA5", tagBg: "rgba(24,95,165,0.1)" },
    { icon: "🔒", title: "Complete Privacy", desc: "Your data is not stored on our servers. Everything runs entirely in your browser.", tag: "Secure", tagColor: "#0F6E56", tagBg: "rgba(15,110,86,0.1)" },
  ],
  fr: [
    { icon: "🤖", title: "Vraie IA", desc: "L'IA Gemini rédige du contenu de façon professionnelle dans votre style.", tag: "IA", tagColor: "#FF4D2D", tagBg: "rgba(255,77,45,0.1)" },
    { icon: "🎯", title: "100% Compatible ATS", desc: "Tous les modèles sont conçus pour passer les systèmes de filtrage automatisés.", tag: "Important", tagColor: "#0F6E56", tagBg: "rgba(15,110,86,0.1)" },
    { icon: "🌍", title: "Arabe • Anglais • Français", desc: "Véritable RTL pour l'arabe. La seule plateforme qui gère parfaitement le français.", tag: "Exclusif", tagColor: "#534AB7", tagBg: "rgba(83,74,183,0.1)" },
    { icon: "⚡", title: "5 Min, Sans Inscription", desc: "Pas de compte, ni d'email, ni d'attente. Commencez et téléchargez votre PDF.", tag: "Rapide", tagColor: "#854F0B", tagBg: "rgba(133,79,11,0.1)" },
    { icon: "📄", title: "Export PDF + Word", desc: "Téléchargez dans les deux formats. Pratique pour les employeurs qui demandent Word.", tag: "Spécial", tagColor: "#185FA5", tagBg: "rgba(24,95,165,0.1)" },
    { icon: "🔒", title: "Confidentialité totale", desc: "Vos données ne sont pas stockées. Tout s'exécute localement dans votre navigateur.", tag: "Sécurisé", tagColor: "#0F6E56", tagBg: "rgba(15,110,86,0.1)" },
  ],
}

const HEADINGS = {
  ar: { label: 'كل اللي محتاجه', title: 'مش بس Resume Builder', subtitle: 'أدوات كاملة لمساعدتك تحصل على الوظيفة — من كتابة السيرة لحد ما تعدي الـ ATS' },
  en: { label: 'Everything you need', title: 'Not just a Resume Builder', subtitle: 'Complete tools to help you land the job — from writing the CV to passing the ATS.' },
  fr: { label: 'Tout ce dont vous avez besoin', title: 'Plus qu\'un créateur de CV', subtitle: 'Des outils complets pour décrocher le poste — de la rédaction à l\'optimisation ATS.' },
}

export function FeaturesSection({ lang }: FeaturesSectionProps) {
  const currentFeatures = FEATURES[lang] || FEATURES['en']
  const heading = HEADINGS[lang] || HEADINGS['en']

  return (
    <section
      id="features"
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "64px 24px",
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span
          style={{
            display: "inline-block",
            background: "rgba(255,77,45,0.1)",
            color: "#FF4D2D",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            padding: "4px 14px",
            borderRadius: 99,
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          {heading.label}
        </span>
        <h2
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 700,
            color: "#111",
            margin: "0 0 12px",
            lineHeight: 1.3,
          }}
        >
          {heading.title}
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "#666",
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          {heading.subtitle}
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {currentFeatures.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, tag, tagColor, tagBg }: { icon: string, title: string, desc: string, tag: string, tagColor: string, tagBg: string }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #F0EDE8",
        borderRadius: 16,
        padding: "24px",
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,77,45,0.35)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#F0EDE8";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 32 }}>{icon}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: tagColor,
            background: tagBg,
            padding: "3px 10px",
            borderRadius: 99,
          }}
        >
          {tag}
        </span>
      </div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#111",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "#666",
          margin: 0,
          lineHeight: 1.7,
        }}
      >
        {desc}
      </p>
    </div>
  );
}