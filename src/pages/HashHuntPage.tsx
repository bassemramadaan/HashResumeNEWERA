import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Search,
  ArrowRight,
  CheckCircle2,
  Sparkles,
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
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute start-1/2 top-0 -translate-x-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px]"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
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
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {t.heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50/50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 end-0 w-1/2 h-full bg-indigo-50/50 -skew-x-12 translate-x-1/4 -z-10"></div>
        
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
            {/* Inner decorative blur */}
            <div className="absolute -top-24 -start-24 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl"></div>

            <div className="flex-1 relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]"
              >
                {t.whyJoinTitle}
              </motion.h2>
              <ul className="space-y-5">
                {[t.benefit1, t.benefit2, t.benefit3, t.benefit4].map(
                  (benefit, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4 text-slate-700 group"
                    >
                      <div className="w-8 h-8 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100/50 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors duration-300">
                        <CheckCircle2 size={16} className="text-indigo-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-base font-medium leading-relaxed pt-1">
                        {benefit}
                      </span>
                    </motion.li>
                  ),
                )}
              </ul>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <a
                  href="https://forms.gle/5kEp1zSjMz3f4HyJ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-slate-900 text-white hover:bg-indigo-600 px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95 group"
                >
                  {t.joinTalentPool}
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex-1 w-full lg:w-auto relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-3xl -rotate-3 scale-105 -z-10 blur-sm"></div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Team collaboration"
                className="rounded-3xl shadow-2xl border border-white/50"
                referrerPolicy="no-referrer"
                fetchpriority="high"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-6">
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

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 start-[15%] end-[15%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 -z-10"></div>

            {[
              {
                icon: Briefcase,
                title: t.step1Title,
                desc: t.step1Desc,
              },
              {
                icon: Search,
                title: t.step2Title,
                desc: t.step2Desc,
              },
              {
                icon: Building2,
                title: t.step3Title,
                desc: t.step3Desc,
              },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                className="bg-white p-8 sm:p-12 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group hover:-translate-y-2 relative"
              >
                <div className="absolute -top-4 -start-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-100 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
