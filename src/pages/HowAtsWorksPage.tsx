import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Target,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useLanguageStore } from "../store/useLanguageStore";

export default function HowAtsWorksPage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  return (
    <>
      <Helmet>
        <title>كيف يعمل نظام ATS | Hash Resume</title>
        <meta name="description" content="تعرف على كيفية عمل أنظمة تتبع المتقدمين ATS وكيف تكتب CV يتخطاها بنجاح." />
        <link rel="canonical" href="https://hashresume.com/how-ats-works" />
      </Helmet>
      <div
        className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-36"
        dir={isAr ? "rtl" : "ltr"}
      >
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-16 space-y-4">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-100 shadow-3xs">
            <Target className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900">
            {isAr ? "كيف يعمل تقييم ATS؟" : "How does the ATS Score Work?"}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "أنظمة تتبع المتقدمين (ATS) هي برمجيات تستخدمها الشركات الكبرى لفرز وتصفية السير الذاتية تلقائياً قبل وصولها لمسؤول التوظيف. إليك كيف نضمن تخطي ملفك لهذه العقبة بنجاح."
              : "Applicant Tracking Systems (ATS) are software engines used by major companies to automatically filter and screen resumes before they reach a human. Here is how we ensure your profile passes with flying colors."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Box 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                  <FileSearch size={22} />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  {isAr ? "تحليل الكلمات المفتاحية" : "Keyword Analysis"}
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm mb-6">
                {isAr
                  ? "يقوم محركنا الذكي بمقارنة دقيقة ومباشرة لنصوص سيرتك الذاتية مع نص الوصف الوظيفي المحدد للفرص المستهدفة، للتحقق من تواجد الكلمات الفنية الأساسية."
                  : "Our smart parsing engine performs a precise, real-time comparison of your resume text against the target job description to check for the presence of essential technical terms."}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4.5 space-y-2.5 border border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {isAr ? "محاور الفحص الأساسية" : "CORE CRITERIA WE AUDIT"}
              </span>
              <ul className="space-y-2 text-xs font-bold text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{isAr ? "تطابق المسمى الوظيفي المستهدف" : "Target job title matching"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{isAr ? "كثافة وتكرار الكلمات الفنية والمصطلحات" : "Hard skills & terminology density"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{isAr ? "توزيع المهارات الشخصية والصلبة" : "Soft & hybrid skills distribution"}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Box 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                  <CheckCircle2 size={22} />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  {isAr ? "هيكلة البيانات والتحليل الرقمي" : "Data Structuring & Machine Parsing"}
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm mb-6">
                {isAr
                  ? "تواجه الأنظمة القديمة والجديدة صعوبة بالغة في قراءة الأشكال المعقدة، الجداول ثنائية الأعمدة، والرسوم البيانية. صممنا جميع هياكلنا البرمجية لتكون مقروءة للآلات بنسبة 100%."
                  : "Traditional and modern tracking systems fail to parse complex shapes, two-column table layouts, and graphical elements. We built our codebase to be 100% machine-readable."}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4.5 space-y-2.5 border border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {isAr ? "معايير التوافق التقنية" : "TECHNICAL STANDARDS"}
              </span>
              <ul className="space-y-2 text-xs font-bold text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>{isAr ? "عناوين أقسام معيارية متطابقة عالمياً" : "Standardized heading labels"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>{isAr ? "تنسيقات تاريخ مرتبة زمنياً ومفهومة برمجياً" : "ISO chronological date parsing"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>{isAr ? "تصدير نصوص أصيلة قابلة للاستخلاص بسهولة" : "Clean vector text exports (PDF/Word)"}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Box 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
                  <AlertTriangle size={22} />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  {isAr ? "اكتشاف الأخطاء وتجنب التصفية" : "Detecting Common Rejection Triggers"}
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm mb-6">
                {isAr
                  ? "نقوم بمسح شامل لكافة النصوص لكشف الأخطاء الشائعة التي قد تتسبب برفض ملفك بصورة تلقائية، مثل استخدام صيغ خطوط غير معترف بها أو بيانات غير مكتملة."
                  : "We crawl through your input to identify and alert you of hidden red flags that might prompt automatic system filter-outs or processing crashes."}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4.5 space-y-2.5 border border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {isAr ? "مسببات الاستبعاد الشائعة" : "TYPICAL REJECTION TRIGGERS"}
              </span>
              <ul className="space-y-2 text-xs font-bold text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{isAr ? "نقص معلومات الاتصال الهامة أو البريد الإلكتروني" : "Missing essential contact or email fields"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{isAr ? "استخدام خطوط أو رموز رسومية غير معيارية" : "Non-standard system fonts or icon sets"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{isAr ? "تداخل نصوص الأقسام أو غياب التواريخ الواضحة" : "Overlapping sections or missing experience timelines"}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Box 4 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600 border border-purple-100">
                  <Search size={22} />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  {isAr ? "كيفية تحسين النتيجة والتفوق" : "Maximizing Your ATS Matching Index"}
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm mb-6">
                {isAr
                  ? "للوصول إلى درجة ممتازة تضمن المقابلة الشخصية، لا يكفي ملء البيانات فحسب، بل يتوجب تكييف محتوى الخبرات مع متطلبات كل شاغر بصورة دقيقة."
                  : "Filling your sections is just the start. To get a high matching index that secures live interviews, you must calibrate details directly to each job description."}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4.5 space-y-2.5 border border-slate-100">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {isAr ? "خطوات التحسين الموصى بها" : "RECOMMENDED STEPS"}
              </span>
              <ul className="space-y-2 text-xs font-bold text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>{isAr ? "تضمين تفاصيل كافية ومقاسة رقمياً بنسب مئوية" : "Adding measurable, quantified results"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>{isAr ? "استخدام معزز الذكاء الاصطناعي (AI Enhance) لإبراز المهارات" : "Using our smart AI Enhance integration"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>{isAr ? "الاستفادة التامة من القوالب المعيارية المجانية المتطابقة بنسبة 100%" : "Relying strictly on standard free templates"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
