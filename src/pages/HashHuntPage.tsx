import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { useLanguageStore } from "../store/useLanguageStore";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "../components/Footer";

export default function HashHuntPage() {
  const { language, dir } = useLanguageStore();
  const isRtl = language === "ar";

  // Data for sections
  const companies = [
    "Noon", "Careem", "Talabat", "Breadfast", "Paymob", "Instabug"
  ];

  const steps = isRtl ? [
    { num: "01", icon: "📄", title: "ارفع سيرتك الذاتية", desc: "قم برفع سيرتك الذاتية الحالية أو ابدأ واحدة جديدة في 5 دقائق. يقوم الذكاء الاصطناعي باستخراج مهاراتك وخبراتك تلقائياً." },
    { num: "02", icon: "🎯", title: "تطابق بالذكاء الاصطناعي", desc: "يقوم محرك التطابق لدينا بتحليل ملفك الشخصي مقابل آلاف الفرص المتاحة في أكثر من 85 شركة شريكة." },
    { num: "03", icon: "🤝", title: "استقبل الفرص", desc: "تتواصل معك الشركات مباشرة. لا مزيد من الانتظار أو التقديم اليدوي الممل. متوسط الرد خلال 48 ساعة." }
  ] : [
    { num: "01", icon: "📄", title: "Upload Your Resume", desc: "Upload your existing CV or build one with HashResume in 5 minutes. Our AI extracts your skills and experience automatically." },
    { num: "02", icon: "🎯", title: "Get Matched by AI", desc: "Our matching engine analyzes your profile against 85+ companies' open roles and ranks you based on fit — not just keywords." },
    { num: "03", icon: "🤝", title: "Receive Opportunities", desc: "Companies reach out directly to you. No ghosting, no black holes. Average first response within 48 hours." }
  ];

  const benefits = isRtl ? [
    { icon: "🎯", title: "تطابق ذكي", desc: "يقوم محركنا بربط ملفك بالوظائف بناءً على مهاراتك، مستوى خبرتك، وموقعك المفضل." },
    { icon: "🔒", title: "أنت في تحكم كامل", desc: "اختر الشركات التي يمكنها رؤية ملفك. يمكنك إخفاء ملفك عن صاحب العمل الحالي." },
    { icon: "⚡", title: "وصول سريع", desc: "يتم إرسال أفضل المطابقات مباشرة إلى مديري التوظيف — وليس لمستنقع الـ ATS." }
  ] : [
    { icon: "🎯", title: "AI Matching", desc: "Our engine matches your profile to roles based on skills, experience level, and location preference." },
    { icon: "🔒", title: "You stay in control", desc: "Choose which companies can see your profile. Hide from your current employer. Remove anytime." },
    { icon: "⚡", title: "Fast Track access", desc: "Top matches get sent directly to the hiring manager — not the ATS black hole." }
  ];

  const testimonials = [
    {
      stars: "★★★★★",
      text: isRtl ? "\"رفعت سيرتي الذاتية يوم الثلاثاء. بحلول الخميس كان لدي طلبا مقابلة. لم يحدث لي هذا من قبل مع مواقع التوظيف التقليدية.\"" : "\"I uploaded my resume on a Tuesday. By Thursday I had two interview requests. Never happened to me before with traditional job boards.\"",
      author: isRtl ? "أحمد حسين" : "Ahmed Hassan",
      role: isRtl ? "مطور واجهات · القاهرة" : "Frontend Developer · Cairo",
      av: "أح",
      avBg: "#FFDDD6",
      avCol: "#993C1D"
    },
    {
      stars: "★★★★★",
      text: isRtl ? "\"بصفتي مديرة موارد بشرية، وفرت لنا هاش هانت أسابيع من الفحص. المرشحون الذين نستقبلهم مطابقون مسبقاً وسيرهم الذاتية محسنة بالفعل.\"" : "\"As an HR manager, Hash Hunt saved us weeks of screening. The candidates we receive are pre-matched and their CVs are already ATS-optimized.\"",
      author: isRtl ? "سارة رمضان" : "Sara Ramadan",
      role: "HR Lead · Noon.com",
      av: "SR",
      avBg: "#D6E8FF",
      avCol: "#185FA5"
    },
    {
      stars: "★★★★★",
      text: isRtl ? "\"مش صدقت إن شركة في دبي بعتتلي عرض شغل بعد يومين بس من رفع السيرة. الحمدلله على الفرصة دي.\"" : "\"I couldn't believe a company in Dubai sent me a job offer just two days after uploading my resume. Thank God for this opportunity.\"",
      author: isRtl ? "محمد العمري" : "Mohamed El-Omari",
      role: isRtl ? "محلل بيانات · الرياض" : "Data Analyst · Riyadh",
      av: "مع",
      avBg: "#D6F5E8",
      avCol: "#0F6E56"
    }
  ];

  const stats = [
    { num: "2,400+", label: isRtl ? "مرشح تم توظيفه" : "Candidates placed" },
    { num: "85+", label: isRtl ? "شركة شريكة" : "Partner companies" },
    { num: "48h", label: isRtl ? "متوسط أول رد" : "Avg. first response" },
    { num: "15", label: isRtl ? "دولة عربية مغطاة" : "Arab countries covered" }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF6] text-[#0D0D0B] font-sans overflow-x-hidden" dir={dir}>
      <Helmet>
        <title>{isRtl ? "هاش هانت — دع الوظائف تجدك" : "Hash Hunt — Let the Jobs Find You"}</title>
      </Helmet>
      
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --brand:     #FF4D2D;
          --brand-dk:  #CC3A1F;
          --brand-lt:  rgba(255,77,45,0.08);
          --ink:       #0D0D0B;
          --ink2:      #3D3D38;
          --ink3:      #7A7A72;
          --paper:     #FAFAF6;
          --card:      #FFFFFF;
          --border:    rgba(0,0,0,0.08);
          --green:     #0F6E56;
          --green-lt:  rgba(15,110,86,0.1);
        }

        .hero-eyebrow::before {
          content: '';
          width: 6px;
          height: 6px;
          background: #FF4D2D;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
          display: inline-block;
          margin-inline-end: 8px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .4; transform: scale(.7); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .floating-card {
          animation: float 5s ease-in-out infinite;
        }

        .ats-fill-anim {
          width: 0;
          animation: fillBar 1.5s ease-out forwards delay-500;
        }

        @keyframes fillBar {
          from { width: 0; }
          to { width: 95%; }
        }
      `}} />

      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-eyebrow inline-flex items-center bg-[#FF4D2D]/8 border border-[#FF4D2D]/18 text-[#FF4D2D] text-xs font-bold px-3 py-1.5 rounded-full mb-6 tracking-wide">
            {isRtl ? "فرص وظيفية حصرية" : "🎯 Exclusive Job Opportunities"}
          </div>
          <h1 className="font-syne text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
            {isRtl ? (
              <>اجعل الوظائف<br /><span className="text-[#FF4D2D]">تبحث عنك.</span></>
            ) : (
              <>Let the jobs<br /><em className="not-italic text-[#FF4D2D]">find you.</em></>
            )}
          </h1>
          <p className="text-lg text-[#3D3D38] max-w-md mb-10 leading-relaxed">
            {isRtl 
              ? "ارفع سيرتك الذاتية مرة واحدة. احصل على تطابقات لوظائف في كبرى الشركات في مصر، السعودية، والإمارات — دون إرسال طلب واحد."
              : "Upload your resume once. Get matched to roles at top companies across Egypt, Saudi Arabia, and the UAE — without sending a single cold application."}
          </p>
          
          <div className="flex flex-wrap gap-4 mb-10">
            <a href="#upload" className="bg-[#FF4D2D] hover:bg-[#CC3A1F] text-white font-bold py-4 px-8 rounded-xl transition-all hover:-translate-y-0.5 flex items-center gap-2">
              {isRtl ? "انضم إلى قاعدة المواهب ←" : "Join the Talent Pool →"}
            </a>
            <a href="#how" className="border border-[#000]/8 hover:border-[#FF4D2D] hover:text-[#FF4D2D] text-[#3D3D38] font-bold py-4 px-8 rounded-xl transition-all">
              {isRtl ? "كيف يعمل النظام؟" : "See how it works"}
            </a>
          </div>

          <div className="flex gap-8 flex-wrap">
            {stats.slice(0, 3).map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-syne text-2xl font-extrabold whitespace-nowrap">{s.num}</span>
                <span className="text-xs text-[#7A7A72] uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:block"
        >
          {/* Float Card Top */}
          <div className="absolute -top-6 -right-6 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 border border-[#000]/5 floating-card" style={{ animationDelay: '1s' }}>
            <span className="text-2xl">🏢</span>
            <div>
              <div className="text-sm font-bold">{isRtl ? "85 شركة" : "85 companies"}</div>
              <div className="text-xs text-[#7A7A72]">{isRtl ? "توظف حالياً" : "actively hiring"}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl relative z-10 border border-[#000]/5 floating-card">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#FF4D2D] rounded-xl flex items-center justify-center font-syne font-bold text-white">JD</div>
              <div>
                <div className="text-base font-bold">{isRtl ? "أحمد محمد" : "John Doe"}</div>
                <div className="text-sm text-[#7A7A72]">{isRtl ? "مطور واجهات أول" : "Senior Frontend Developer"}</div>
              </div>
              <div className="ms-auto bg-[#0F6E56]/10 text-[#0F6E56] text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                ✓ {isRtl ? "أفضل 5% تطابق" : "Top 5% Match"}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-[#7A7A72] font-bold mb-2">
                <span>ATS Score</span>
                <span className="text-[#0F6E56]">95 / 100</span>
              </div>
              <div className="h-2 bg-[#F0EDE8] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#22c55e] to-[#0F6E56] rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {["React", "TypeScript", "Next.js", "Tailwind"].map(s => (
                <span key={s} className="bg-[#F5F4F0] text-[#3D3D38] text-xs font-semibold px-3 py-1 rounded-md">{s}</span>
              ))}
            </div>

            <div className="bg-[#FAFAF6] border border-[#000]/8 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0F6E56]/10 rounded-lg flex items-center justify-center text-xl">✉️</div>
              <div className="flex-1">
                <div className="text-sm font-bold">{isRtl ? "طلب مقابلة" : "Interview Request"}</div>
                <div className="text-[11px] text-[#7A7A72]">Noon.com · {isRtl ? "وظيفة مطور أول" : "Senior Developer role"}</div>
              </div>
              <div className="bg-[#FF4D2D] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">New</div>
            </div>
          </div>

          {/* Float Card Bottom */}
          <div className="absolute -bottom-6 -left-6 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 border border-[#000]/5 floating-card" style={{ animationDelay: '2s' }}>
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-sm font-bold">{isRtl ? "مسار سريع" : "Fast Track"}</div>
              <div className="text-xs text-[#7A7A72]">{isRtl ? "مباشرة لمدير التوظيف" : "Direct to Hiring Manager"}</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── COMPANIES ── */}
      <section className="py-16 border-y border-[#000]/8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-xs font-bold text-[#7A7A72] uppercase tracking-[0.2em] mb-10">
            {isRtl ? "موثوق من فرق التوظيف في" : "Trusted by hiring teams at"}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
            {companies.map(c => (
              <span key={c} className="font-syne text-xl font-bold text-[#3D3D38]">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 bg-white border-b border-[#000]/8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="inline-flex bg-[#FF4D2D]/8 border border-[#FF4D2D]/15 text-[#FF4D2D] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              {isRtl ? "كيف يعمل؟" : "How it works"}
            </div>
            <h2 className="font-syne text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
              {isRtl ? "3 خطوات لوظيفتك" : "3 steps to your"} <br /> {isRtl ? "القادمة" : "next opportunity"}
            </h2>
            <p className="text-[#3D3D38] max-w-lg leading-relaxed">
              {isRtl 
                ? "لا خطابات تقديم. لا لوحات وظائف مملة. فقط ارفع سيرتك واترك للذكاء الاصطناعي مهمة مطابقتك."
                : "No cover letters. No job boards. Just upload your resume and let our AI match you to the right roles."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-[#FAFAF6] border border-[#000]/8 rounded-3xl p-8 hover:border-[#FF4D2D]/30 hover:-translate-y-1 transition-all"
              >
                <div className="font-syne text-5xl font-extrabold text-[#FF4D2D]/12 leading-none mb-6 group-hover:text-[#FF4D2D]/20 transition-colors">{s.num}</div>
                <div className="w-12 h-12 bg-[#FF4D2D]/8 rounded-xl flex items-center justify-center text-2xl mb-6">{s.icon}</div>
                <h3 className="font-syne text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-[#3D3D38] leading-relaxed opacity-80">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex bg-[#FF4D2D]/8 border border-[#FF4D2D]/15 text-[#FF4D2D] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              {isRtl ? "نتائج حقيقية" : "Results that speak"}
            </div>
            <h2 className="font-syne text-4xl font-extrabold tracking-tight">{isRtl ? "قصص نجاح من قلب السوق" : "Real people, real jobs"}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((s, i) => (
              <div key={i} className="bg-white border border-[#000]/8 rounded-3xl p-8 text-center shadow-sm">
                <div className="font-syne text-4xl font-extrabold text-[#FF4D2D] mb-2">{s.num}</div>
                <div className="text-xs text-[#7A7A72] font-semibold uppercase">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-[#000]/8 rounded-3xl p-8 flex flex-col gap-6 shadow-sm">
                <div className="text-[#F59E0B] text-sm tracking-widest">{t.stars}</div>
                <p className="text-sm text-[#3D3D38] leading-relaxed flex-1 italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor: t.avBg, color: t.avCol }}>
                    {t.av}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{t.author}</div>
                    <div className="text-[11px] text-[#7A7A72]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPLOAD FORM ── */}
      <section id="upload" className="py-24 bg-white border-t border-[#000]/8">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-flex bg-[#FF4D2D]/8 border border-[#FF4D2D]/15 text-[#FF4D2D] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              {isRtl ? "انضم الآن" : "Join Now"}
            </div>
            <h2 className="font-syne text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-6">
              {isRtl ? "وظيفتك القادمة" : "Your next job is"} <br /> {isRtl ? "على بُعد خطوة" : "one upload away"}
            </h2>
            <p className="text-[#3D3D38] text-lg leading-relaxed mb-10 opacity-80">
              {isRtl 
                ? "أكمل ملفك الآن وكن مرئياً لمديري التوظيف في أكثر من 85 شركة رائدة في العالم العربي."
                : "Complete your profile and become visible to hiring managers at 85+ companies across the Arab world."}
            </p>

            <div className="space-y-6">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FF4D2D]/8 rounded-xl flex items-center justify-center text-xl shrink-0">{b.icon}</div>
                  <div>
                    <div className="text-base font-bold mb-0.5">{b.title}</div>
                    <div className="text-sm text-[#7A7A72] leading-relaxed">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#FAFAF6] border border-[#000]/8 rounded-3xl p-8 md:p-10"
          >
            <div className="font-syne text-2xl font-extrabold mb-2">{isRtl ? "أنشئ ملفك الشخصي" : "Create your profile"}</div>
            <div className="text-xs text-[#7A7A72] mb-8">{isRtl ? "يستغرق أقل من دقيقتين · لا حاجة للتسجيل" : "Takes less than 2 minutes · No registration required"}</div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#3D3D38] uppercase tracking-wider">{isRtl ? "الاسم بالكامل *" : "Full Name *"}</label>
                  <input type="text" className="w-full bg-white border border-[#000]/10 rounded-lg px-4 py-3 text-sm focus:border-[#FF4D2D] outline-none transition-colors" placeholder="Ahmed Hassan" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#3D3D38] uppercase tracking-wider">{isRtl ? "البريد الإلكتروني *" : "Email *"}</label>
                  <input type="email" className="w-full bg-white border border-[#000]/10 rounded-lg px-4 py-3 text-sm focus:border-[#FF4D2D] outline-none transition-colors" placeholder="ahmed@email.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#3D3D38] uppercase tracking-wider">{isRtl ? "المسمى الوظيفي *" : "Job Title *"}</label>
                  <input type="text" className="w-full bg-white border border-[#000]/10 rounded-lg px-4 py-3 text-sm focus:border-[#FF4D2D] outline-none transition-colors" placeholder="Senior Frontend Developer" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#3D3D38] uppercase tracking-wider">{isRtl ? "سنوات الخبرة" : "Years of Experience"}</label>
                  <select 
                    defaultValue={`3–5 ${isRtl ? "سنة" : "years"}`}
                    className="w-full bg-white border border-[#000]/10 rounded-lg px-4 py-3 text-sm focus:border-[#FF4D2D] outline-none transition-colors appearance-none"
                  >
                    <option>0–1 {isRtl ? "سنة" : "years"}</option>
                    <option>1–3 {isRtl ? "سنة" : "years"}</option>
                    <option>3–5 {isRtl ? "سنة" : "years"}</option>
                    <option>5–10 {isRtl ? "سنة" : "years"}</option>
                    <option>10+ {isRtl ? "سنة" : "years"}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#3D3D38] uppercase tracking-wider">{isRtl ? "الموقع" : "Location"}</label>
                  <select className="w-full bg-white border border-[#000]/10 rounded-lg px-4 py-3 text-sm focus:border-[#FF4D2D] outline-none transition-colors appearance-none">
                    <option>{isRtl ? "مصر" : "Egypt"}</option>
                    <option>{isRtl ? "السعودية" : "Saudi Arabia"}</option>
                    <option>{isRtl ? "الإمارات" : "UAE"}</option>
                    <option>{isRtl ? "الكويت" : "Kuwait"}</option>
                    <option>{isRtl ? "آخرى" : "Other"}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#3D3D38] uppercase tracking-wider">{isRtl ? "نوع العمل" : "Open To"}</label>
                  <select 
                    defaultValue={isRtl ? "عن بعد أو من المكتب" : "Remote or On-site"}
                    className="w-full bg-white border border-[#000]/10 rounded-lg px-4 py-3 text-sm focus:border-[#FF4D2D] outline-none transition-colors appearance-none"
                  >
                    <option>{isRtl ? "عن بعد فقط" : "Remote only"}</option>
                    <option>{isRtl ? "عن بعد أو من المكتب" : "Remote or On-site"}</option>
                    <option>{isRtl ? "من المكتب فقط" : "On-site only"}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#3D3D38] uppercase tracking-wider">{isRtl ? "سيرتك الذاتية" : "Your Resume"}</label>
                <div className="border-2 border-dashed border-[#000]/8 bg-white rounded-xl py-10 px-6 text-center cursor-pointer hover:border-[#FF4D2D]/30 hover:bg-[#FF4D2D]/5 transition-all group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📎</div>
                  <div className="text-sm font-bold text-[#3D3D38] mb-1">
                    {isRtl ? "اسحب سيرتك هنا أو" : "Drop your CV here or"} <span className="text-[#FF4D2D]">{isRtl ? "تصفح" : "browse"}</span>
                  </div>
                  <div className="text-xs text-[#7A7A72]">PDF or Word · Max 5MB</div>
                </div>
              </div>

              <button className="w-full bg-[#FF4D2D] hover:bg-[#CC3A1F] text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-[#FF4D2D]/20 flex items-center justify-center gap-2">
                🚀 {isRtl ? "انضم لقاعدة المواهب" : "Join the Talent Pool"}
              </button>

              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#7A7A72] uppercase tracking-wider">🔒 {isRtl ? "بياناتك آمنة" : "Data is secure"}</div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#7A7A72] uppercase tracking-wider">⚡ {isRtl ? "رد سريع" : "Fast response"}</div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#7A7A72] uppercase tracking-wider">🌍 {isRtl ? "تغطية كاملة" : "Full coverage"}</div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 bg-[#0D0D0B] text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4D2D]/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF4D2D]/20 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <h2 className="font-syne text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            {isRtl ? "توقف عن البحث." : "Stop applying."} <br /> {isRtl ? "اجعلهم يجدونك." : "Start getting found."}
          </h2>
          <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
            {isRtl ? "انضم لأكثر من 2,400 محترف تركوا للفرص مهمة الوصول إليهم." : "Join 2,400+ professionals who let the jobs come to them."}
          </p>
          <a href="#upload" className="inline-block bg-white text-[#FF4D2D] font-syne font-bold text-lg px-12 py-5 rounded-2xl hover:scale-105 transition-all">
            {isRtl ? "انضم الآن مجاناً ←" : "Join the Talent Pool →"}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
