import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Search,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
  Zap,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HashHuntPage() {
  const { language, dir } = useLanguageStore();
  const t = translations[language].hashHunt;

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900 transition-colors duration-300"
      dir={dir}
    >
      <Helmet>
        <title>{t.heroTitlePart1} {t.heroTitlePart2} | Hash Hunt</title>
        <meta name="description" content={t.heroSubtitle} />
      </Helmet>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute start-1/2 top-0 -translate-x-1/2 -z-10 h-[800px] w-[800px] rounded-full bg-indigo-500/10 blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Hero Text */}
            <div className="flex-1 text-center lg:text-start">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
              >
                <Sparkles size={14} className="text-indigo-500" />
                {t.heroBadge}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]"
              >
                {t.heroTitlePart1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  {t.heroTitlePart2}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              >
                {t.heroSubtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <a
                  href="https://forms.gle/5kEp1zSjMz3f4HyJ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/25"
                >
                  {t.joinTalentPool}
                  <ArrowRight size={20} className="rtl:rotate-180" />
                </a>
              </motion.div>
            </div>

            {/* Hero Mockup */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none relative perspective-1000">
              <motion.div
                initial={{ opacity: 0, rotateY: 20, rotateX: 10, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: -5, rotateX: 5, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                className="relative z-10 w-full transform-style-3d"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 rounded-[2rem] blur-2xl -z-10 animate-pulse"></div>
                
                {/* Main Card */}
                <div className="bg-slate-50 rounded-3xl shadow-2xl border border-slate-100 p-6 relative overflow-hidden">
                  <div className="absolute top-0 end-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      JD
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">John Doe</h3>
                      <p className="text-sm text-white0">Senior Frontend Developer</p>
                    </div>
                    <div className="ms-auto">
                      <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Top 5% Match
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "95%" }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                      />
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span>ATS Score</span>
                      <span className="text-emerald-600">95/100</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {["React", "TypeScript", "Next.js", "Tailwind CSS"].map((skill) => (
                      <span key={skill} className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 shadow-sm">
                      <Building2 size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">Interview Request</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">TechCorp is interested in your profile for a Senior Developer role.</p>
                    </div>
                  </div>
                </div>

                {/* Floating Element */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -start-6 bg-slate-50 p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-20"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Fast Track</p>
                    <p className="text-sm font-bold text-slate-900">Direct to Hiring Manager</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bento Grid */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              {t.whyJoinTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: t.benefit1,
                color: "bg-orange-50 text-orange-600 border-orange-100",
                span: "md:col-span-2 lg:col-span-2",
              },
              {
                icon: Zap,
                title: t.benefit2,
                color: "bg-indigo-50 text-indigo-600 border-indigo-100",
                span: "md:col-span-1 lg:col-span-1",
              },
              {
                icon: ShieldCheck,
                title: t.benefit3,
                color: "bg-emerald-50 text-emerald-600 border-emerald-100",
                span: "md:col-span-1 lg:col-span-1",
              },
              {
                icon: Users,
                title: t.benefit4,
                color: "bg-violet-50 text-violet-600 border-violet-100",
                span: "md:col-span-2 lg:col-span-4",
              },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${benefit.span} flex flex-col justify-center items-start group`}
              >
                <div className={`w-14 h-14 rounded-2xl ${benefit.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-relaxed">
                  {benefit.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
            >
              {t.howItWorksTitle}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              {t.howItWorksSubtitle}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 start-[15%] end-[15%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 -z-10"></div>

            {[
              {
                icon: Briefcase,
                title: t.step1Title,
                desc: t.step1Desc,
                color: "text-indigo-600 bg-indigo-50",
              },
              {
                icon: Search,
                title: t.step2Title,
                desc: t.step2Desc,
                color: "text-violet-600 bg-violet-50",
              },
              {
                icon: Building2,
                title: t.step3Title,
                desc: t.step3Desc,
                color: "text-emerald-600 bg-emerald-50",
              },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                className="bg-slate-50 p-8 sm:p-10 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group hover:-translate-y-2 relative"
              >
                <div className="absolute -top-4 -start-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-100 ${item.color} group-hover:scale-110 transition-all duration-500`}>
                  <item.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 end-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 start-0 w-64 h-64 bg-violet-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Ready to get discovered?
              </h2>
              <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-10">
                Join Hash Hunt today and let top employers find you. It's 100% free for candidates.
              </p>
              <a
                href="https://forms.gle/5kEp1zSjMz3f4HyJ9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-slate-50 text-indigo-900 rounded-full font-bold text-lg hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
              >
                {t.joinTalentPool}
                <ArrowRight size={24} className="rtl:rotate-180" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
