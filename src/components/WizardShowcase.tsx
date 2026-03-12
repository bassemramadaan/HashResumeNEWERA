import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, FileText, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';

export default function WizardShowcase() {
  const { language } = useLanguageStore();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: language === 'ar' ? 'أدخل بياناتك الأساسية' : '1. Enter Your Details',
      desc: language === 'ar' ? 'املأ معلوماتك الشخصية في نماذج ذكية وسهلة الاستخدام.' : 'Fill in your personal info using our smart, intuitive forms.',
      icon: User,
      color: 'bg-orange-500',
      shadow: 'shadow-orange-500/30'
    },
    {
      id: 1,
      title: language === 'ar' ? 'أضف خبراتك بذكاء' : '2. Add Experience',
      desc: language === 'ar' ? 'احصل على اقتراحات مدعومة بالذكاء الاصطناعي لكتابة مهامك.' : 'Get AI-powered suggestions to perfectly describe your past roles.',
      icon: Briefcase,
      color: 'bg-red-500',
      shadow: 'shadow-red-500/30'
    },
    {
      id: 2,
      title: language === 'ar' ? 'حمل سيرتك الذاتية' : '3. Download & Apply',
      desc: language === 'ar' ? 'احصل على ملف PDF بتنسيق مثالي وجاهز للتقديم فوراً.' : 'Export a perfectly formatted PDF, ready to land your next job.',
      icon: FileText,
      color: 'bg-amber-500',
      shadow: 'shadow-amber-500/30'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* Background glow effects and graphics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/10 dark:bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Floating Abstract Shapes */}
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} 
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[5%] -z-10 hidden lg:block opacity-40 dark:opacity-20"
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 0L80 40L40 80L0 40L40 0Z" stroke="url(#paint0_linear_wizard)" strokeWidth="2" strokeDasharray="4 4"/>
          <defs>
            <linearGradient id="paint0_linear_wizard" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f16529" />
              <stop offset="1" stopColor="#e44d26" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }} 
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-[5%] -z-10 hidden lg:block opacity-30 dark:opacity-10"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="28" stroke="url(#paint1_linear_wizard)" strokeWidth="4"/>
          <defs>
            <linearGradient id="paint1_linear_wizard" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" />
              <stop offset="1" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#f16529] dark:text-orange-400 font-medium text-sm mb-6 border border-orange-200 dark:border-orange-800/50">
            <Sparkles size={16} />
            {language === 'ar' ? 'عملية مبسطة' : 'Streamlined Process'}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">
            {language === 'ar' ? 'بناء السيرة الذاتية أصبح أسهل' : 'Resume Building Made Simple'}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {language === 'ar' 
              ? 'شاهد كيف يمكنك إنشاء سيرة ذاتية احترافية في دقائق معدودة.' 
              : 'See how you can create a professional resume in just a few minutes with our intuitive, step-by-step wizard.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Steps Navigation */}
          <div className="w-full lg:w-5/12 space-y-6 relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-10 bottom-10 w-1 bg-slate-200 dark:bg-slate-800 hidden md:block rounded-full overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 w-full bg-[#f16529] rounded-full"
                animate={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-500 flex items-start gap-6 group relative z-10 ${
                  activeStep === index 
                    ? 'bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 scale-[1.02]' 
                    : 'bg-transparent hover:bg-white/50 dark:hover:bg-slate-900/50 border border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-white transition-all duration-500 shadow-lg relative ${
                  activeStep === index ? `${step.color} ${step.shadow}` : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-none'
                }`}>
                  <step.icon size={28} className={activeStep === index ? "animate-pulse" : ""} />
                  {activeStep === index && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className={`font-bold text-xl mb-2 transition-colors duration-300 ${activeStep === index ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-base transition-colors duration-300 ${activeStep === index ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'}`}>
                    {step.desc}
                  </p>
                </div>
                {activeStep === index && (
                  <motion.div 
                    layoutId="active-arrow" 
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[#f16529] hidden sm:block"
                  >
                    <ArrowRight size={24} />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          {/* Visual Preview */}
          <div className="w-full lg:w-7/12 relative h-[450px] md:h-[550px] bg-slate-200/50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-4 md:p-8 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
            <div className="absolute inset-0 bg-grid-slate-300/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.8))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.8))]"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                className="w-full h-full bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col relative z-10"
              >
                {/* Fake Browser Header */}
                <div className="h-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400 dark:bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400 dark:bg-emerald-500"></div>
                  <div className="ml-4 flex-1 h-6 bg-white dark:bg-slate-950 rounded-md border border-slate-200 dark:border-slate-800 flex items-center px-3">
                    <div className="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                  </div>
                </div>

                {/* Content based on step */}
                <div className="flex-1 p-8 md:p-10 overflow-hidden relative bg-white dark:bg-slate-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  {activeStep === 0 && (
                    <div className="space-y-8 animate-pulse">
                      <div className="flex gap-6 items-center">
                        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border-4 border-white dark:border-slate-950 shadow-md shrink-0"></div>
                        <div className="space-y-4 flex-1">
                          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                          <div className="h-10 bg-slate-50 dark:bg-slate-900 rounded-xl w-full border border-slate-200 dark:border-slate-800"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                          <div className="h-10 bg-slate-50 dark:bg-slate-900 rounded-xl w-full border border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                          <div className="h-10 bg-slate-50 dark:bg-slate-900 rounded-xl w-full border border-slate-200 dark:border-slate-800"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
                        <div className="h-32 bg-slate-50 dark:bg-slate-900 rounded-xl w-full border border-slate-200 dark:border-slate-800"></div>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                        <div className="px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-800/50">
                          <Sparkles size={16} />
                          {language === 'ar' ? 'مساعد الذكاء الاصطناعي' : 'AI Assist'}
                        </div>
                      </div>
                      {[1, 2].map((i) => (
                        <div key={i} className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 space-y-4 hover:border-red-300 dark:hover:border-red-700 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 w-2/3">
                              <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
                              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                            </div>
                            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-24"></div>
                          </div>
                          <div className="space-y-3 pl-5 border-l-2 border-red-200 dark:border-red-800/50 pt-2">
                            <div className="h-2.5 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-2.5 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
                            <div className="h-2.5 bg-slate-300 dark:bg-slate-700 rounded w-4/5"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="flex h-full gap-8 items-center justify-center">
                      <div className="w-1/2 space-y-6 opacity-40 blur-[2px] hidden md:block">
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                        <div className="h-40 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full"></div>
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                        <div className="h-40 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full"></div>
                      </div>
                      <div className="w-full md:w-1/2 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 rounded-xl p-6 transform md:rotate-3 md:scale-110 origin-center transition-transform relative">
                        <div className="absolute -top-4 -right-4 bg-amber-500 text-white p-3 rounded-full shadow-lg">
                          <Check size={24} />
                        </div>
                        <div className="space-y-5">
                          <div className="flex gap-4 items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-slate-800 dark:bg-slate-200 rounded w-2/3"></div>
                              <div className="h-3 bg-slate-400 dark:bg-slate-500 rounded w-1/2"></div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                            <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                            <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                            <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
                          </div>
                          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-amber-700 dark:text-amber-400">
                            <div className="flex items-center gap-2 font-bold">
                              <Sparkles size={18} />
                              {language === 'ar' ? 'تقييم ATS: 98/100' : 'ATS Score: 98/100'}
                            </div>
                            <div className="text-xs uppercase tracking-wider font-semibold">{language === 'ar' ? 'ممتاز' : 'Excellent'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
