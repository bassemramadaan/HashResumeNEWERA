import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';

export default function Pricing() {
  const { language } = useLanguageStore();

  const plans = [
    {
      name: language === 'ar' ? 'مجاني' : 'Free',
      price: '0',
      description: language === 'ar' ? 'مثالي للبدء في بناء سيرتك الذاتية.' : 'Perfect for getting started with your resume.',
      features: [
        language === 'ar' ? 'بناء سيرة ذاتية واحدة' : 'Build 1 Resume',
        language === 'ar' ? 'قوالب أساسية' : 'Basic Templates',
        language === 'ar' ? 'تصدير PDF' : 'PDF Export',
        language === 'ar' ? 'تخزين محلي' : 'Local Storage',
      ],
      notIncluded: [
        language === 'ar' ? 'قوالب احترافية' : 'Premium Templates',
        language === 'ar' ? 'توليد بالذكاء الاصطناعي' : 'AI Generation',
        language === 'ar' ? 'تدقيق ATS متقدم' : 'Advanced ATS Audit',
      ],
      cta: language === 'ar' ? 'ابدأ الآن' : 'Start Now',
      popular: false,
    },
    {
      name: language === 'ar' ? 'احترافي' : 'Pro',
      price: '9.99',
      period: language === 'ar' ? '/ شهر' : '/ month',
      description: language === 'ar' ? 'كل ما تحتاجه للحصول على وظيفتك التالية.' : 'Everything you need to land your next job.',
      features: [
        language === 'ar' ? 'سير ذاتية غير محدودة' : 'Unlimited Resumes',
        language === 'ar' ? 'جميع القوالب الاحترافية' : 'All Premium Templates',
        language === 'ar' ? 'توليد محتوى بالذكاء الاصطناعي' : 'AI Content Generation',
        language === 'ar' ? 'تدقيق ATS متقدم' : 'Advanced ATS Audit',
        language === 'ar' ? 'تصدير DOCX و TXT' : 'DOCX & TXT Export',
        language === 'ar' ? 'خطابات تقديم غير محدودة' : 'Unlimited Cover Letters',
      ],
      notIncluded: [],
      cta: language === 'ar' ? 'احصل على Pro' : 'Get Pro',
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">
            {language === 'ar' ? 'خطط أسعار بسيطة' : 'Simple Pricing Plans'}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {language === 'ar' 
              ? 'ابدأ مجانًا وقم بالترقية لفتح المزيد من الميزات القوية.' 
              : 'Start for free and upgrade to unlock more powerful features.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-2xl ${
                plan.popular 
                  ? 'border-[#f16529] shadow-xl shadow-orange-500/10 scale-105 z-10' 
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#f16529] text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider">
                  {language === 'ar' ? 'الأكثر شيوعاً' : 'Most Popular'}
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900 dark:text-white">${plan.price}</span>
                {plan.period && <span className="text-slate-500 dark:text-slate-400 font-medium">{plan.period}</span>}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                {plan.description}
              </p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-400 dark:text-slate-600 font-medium">
                    <X className="shrink-0" size={20} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.popular 
                    ? 'bg-[#f16529] hover:bg-[#e44d26] text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
