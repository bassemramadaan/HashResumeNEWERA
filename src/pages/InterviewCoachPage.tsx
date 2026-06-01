import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "../components/Footer";
import InterviewCoach from "../components/InterviewCoach";
import { useLanguageStore } from "../store/useLanguageStore";
import { Sparkles, AlertCircle, Award, Target, Trophy } from "lucide-react";

export default function InterviewCoachPage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans relative overflow-hidden ${isAr ? "rtl" : "ltr"}`}>
      
      {/* Premium Background Mesh Elements */}
      <div className="absolute top-[10%] left-[-20%] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/[0.04] to-[#FF4D2D]/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-orange-400/[0.03] to-indigo-600/[0.03] rounded-full blur-3xl pointer-events-none" />

      <Helmet>
        <title>
          {isAr
            ? "مستشار الاستعداد للمقابلات الشخصية بالذكاء الاصطناعي | Hash Resume"
            : "AI Interview Coach & Practice | Hash Resume"}
        </title>
        <meta
          name="description"
          content={
            isAr
              ? "استعد لمقابلتك الشخصية القادمة مع مستشار ذكي يولد أسئلة مخصصة لمهاراتك وتخصصك مع إجابات نموذجية بصيغة STAR."
              : "Master your upcoming job interview with an intelligent AI coach generating custom situational questions tailormade for you."
          }
        />
      </Helmet>

      <Navbar />

      {/* Hero Header Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-8 py-20 mt-10 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 select-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest mb-4 border border-white/10 shadow-xs">
            <Sparkles size={11} className="text-[#FF4D2D] animate-pulse" />
            <span>{isAr ? "ميزة فائقة وحصرية بالذكاء الاصطناعي" : "EXCLUSIVELY PREMIUM AI TOOL"}</span>
          </div>
          
          <h1 className="text-3xl sm:text-[42px] font-black text-slate-900 tracking-tight leading-none">
            {isAr ? (
              <>
                تجاوز مقابلة عملك القادمة <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D2D] to-indigo-600">بثقة تامة</span>
              </>
            ) : (
              <>
                Ape Your Upcoming Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D2D] to-indigo-600">With Confidence</span>
              </>
            )}
          </h1>
          
          <p className="text-slate-550 text-xs sm:text-[13px] font-bold leading-relaxed mt-4 max-w-lg mx-auto">
            {isAr
              ? "لا داعي للخوف من أسئلة مقابلات التوظيف بعد اليوم. تدرّب على محاكاة ذكية للمقابلات السلوكية والفنية المخصصة لمسيرتك واكتسب مهارة الإجابة النموذجية."
              : "Banish interview stage fright forever. Practice answering context-aware behavioral challenges constructed specifically for your technical and professional track."}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10 select-none text-start">
          <div className="bg-white border border-slate-150 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs transition-all hover:border-[#FF4D2D]/30 hover:shadow-xs hover:-translate-y-0.5 duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <Target size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black text-indigo-600 tracking-wider block uppercase">
                {isAr ? "قوة الذكاء الاصطناعي" : "AI Alignment"}
              </span>
              <span className="font-bold text-slate-850 text-xs sm:text-[13px]">
                {isAr ? "دقة تحليلية متناهية" : "High contextual accuracy"}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-150 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs transition-all hover:border-[#FF4D2D]/30 hover:shadow-xs hover:-translate-y-0.5 duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Award size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-600 tracking-wider block uppercase">
                {isAr ? "هيكلية الإجابات" : "STAR Standard"}
              </span>
              <span className="font-bold text-slate-850 text-xs sm:text-[13px]">
                {isAr ? "منهجية معتمدة عالمياً" : "Standardized model tips"}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-150 rounded-2xl p-4 flex items-center gap-3.5 shadow-3xs transition-all hover:border-[#FF4D2D]/30 hover:shadow-xs hover:-translate-y-0.5 duration-300">
            <div className="w-10 h-10 rounded-xl bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center shrink-0 border border-[#FF4D2D]/15">
              <Trophy size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#FF4D2D] tracking-wider block uppercase">
                {isAr ? "نسبة القبول" : "Admission Rate"}
              </span>
              <span className="font-bold text-slate-850 text-xs sm:text-[13px]">
                {isAr ? "زيادة قدرها 3 أضعاف" : "Up to 3x selection increase"}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Coach Component Wrapper */}
        <div className="relative mb-10">
          <InterviewCoach />
        </div>

        {/* Pro advice notice block */}
        <div className="max-w-3xl mx-auto bg-[#FF4D2D]/5 border border-[#FF4D2D]/15 rounded-2xl p-5 flex gap-4 text-start select-none">
          <AlertCircle size={18} className="text-[#FF4D2D] mt-0.5 shrink-0" />
          <div className="text-xs text-slate-700 font-medium space-y-1.5 leading-relaxed">
            <h5 className="font-black text-slate-900 flex items-center gap-1.5 text-sm">
              {isAr ? "كيف تحقق الاستفادة القصوى من هذا المستشار؟" : "How to get the absolute most out of this tool:"}
            </h5>
            <p>
              {isAr
                ? "عند توليد الأسئلة، قم بصياغة إجابتك أولاً بصوتٍ عالٍ كأنك بالمقابلة الحقيقية، ثم طابق إقرارك مع تلميحات مسؤول التوظيف وهيئة الـ STAR المقترحة. التدريب المتكرر يرفع كفاءة تواصلك بنسبة تتخطى الـ 90%."
                : "When questions are generated, verbalize your answer out loud first to build vocal confidence! Then, cross-examine your details with our Recruiter hint and the suggested STAR formulation."}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

