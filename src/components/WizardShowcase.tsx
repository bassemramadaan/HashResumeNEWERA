import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Briefcase, FileText, Check, Sparkles } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';

export default function WizardShowcase() {
  const { language } = useLanguageStore();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: language === 'ar' ? 'أدخل بياناتك' : 'Enter Your Details',
      desc: language === 'ar' ? 'نماذج ذكية وسهلة الاستخدام' : 'Smart, easy-to-use forms',
      icon: User,
      color: 'bg-blue-500'
    },
    {
      id: 1,
      title: language === 'ar' ? 'أضف الخبرات' : 'Add Experience',
      desc: language === 'ar' ? 'احصل على اقتراحات مدعومة بالذكاء الاصطناعي' : 'Get AI-powered suggestions',
      icon: Briefcase,
      color: 'bg-purple-500'
    },
    {
      id: 2,
      title: language === 'ar' ? 'حمل السيرة الذاتية' : 'Download Resume',
      desc: language === 'ar' ? 'تنسيق PDF مثالي وجاهز للتقديم' : 'Perfect PDF, ready to apply',
      icon: FileText,
      color: 'bg-emerald-500'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-display">
            {language === 'ar' ? 'بناء السيرة الذاتية أصبح أسهل' : 'Resume Building Made Simple'}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'شاهد كيف يمكنك إنشاء سيرة ذاتية احترافية في دقائق معدودة.' 
              : 'See how you can create a professional resume in just a few minutes.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Steps Navigation */}
          <div className="w-full lg:w-1/3 space-y-4">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border flex items-center gap-4 group ${
                  activeStep === index 
                    ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 shadow-lg scale-105' 
                    : 'bg-slate-50 dark:bg-slate-900/50 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${
                  activeStep === index ? step.color : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400 dark:group-hover:bg-slate-600'
                }`}>
                  <step.icon size={24} />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${activeStep === index ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${activeStep === index ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                    {step.desc}
                  </p>
                </div>
                {activeStep === index && (
                  <motion.div layoutId="active-check" className="ml-auto text-indigo-600 dark:text-indigo-400">
                    <Check size={20} />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          {/* Visual Preview */}
          <div className="w-full lg:w-2/3 relative h-[400px] md:h-[500px] bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 md:p-8 overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))]"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full bg-white dark:bg-slate-950 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
              >
                {/* Fake Browser Header */}
                <div className="h-8 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400 dark:bg-emerald-500"></div>
                </div>

                {/* Content based on step */}
                <div className="flex-1 p-6 md:p-8 overflow-hidden relative bg-white dark:bg-slate-950">
                  {activeStep === 0 && (
                    <div className="space-y-6 animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                        <div className="space-y-3 flex-1">
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                          <div className="h-8 bg-slate-100 dark:bg-slate-800/50 rounded w-full border border-slate-200 dark:border-slate-800"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                          <div className="h-8 bg-slate-100 dark:bg-slate-800/50 rounded w-full border border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                          <div className="h-8 bg-slate-100 dark:bg-slate-800/50 rounded w-full border border-slate-200 dark:border-slate-800"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
                        <div className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded w-full border border-slate-200 dark:border-slate-800"></div>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                        <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <Sparkles size={16} />
                        </div>
                      </div>
                      {[1, 2].map((i) => (
                        <div key={i} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-3">
                          <div className="flex justify-between">
                            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                          </div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                          <div className="space-y-2 pl-4 border-l-2 border-slate-300 dark:border-slate-700">
                            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-center">
                        <div className="h-10 bg-indigo-600 dark:bg-indigo-500 rounded-full w-1/3 opacity-20 dark:opacity-30"></div>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="flex h-full gap-6">
                      <div className="w-1/2 space-y-4 opacity-50 blur-[1px]">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                        <div className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                        <div className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded w-full"></div>
                      </div>
                      <div className="w-1/2 bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 rounded-lg p-4 transform rotate-2 scale-105 origin-top-right transition-transform">
                        <div className="space-y-3">
                          <div className="flex gap-3 items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                            <div className="space-y-1 flex-1">
                              <div className="h-3 bg-slate-800 dark:bg-slate-200 rounded w-1/2"></div>
                              <div className="h-2 bg-slate-400 dark:bg-slate-500 rounded w-1/3"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                          </div>
                          <div className="mt-4 p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded border border-emerald-100 dark:border-emerald-800/50 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                            <Check size={12} />
                            ATS Score: 95/100
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
