import { motion } from 'motion/react';
import { useLanguageStore } from '../store/useLanguageStore';

export default function ResumeShowcase() {
  const { language } = useLanguageStore();

  const resumes = [
    {
      name: "Sarah Jenkins",
      role: "Product Designer",
      color: "bg-rose-50",
      accent: "bg-rose-500"
    },
    {
      name: "Omar Farooq",
      role: "Software Engineer",
      color: "bg-blue-50",
      accent: "bg-blue-500"
    },
    {
      name: "Layla Mahmoud",
      role: "Marketing Specialist",
      color: "bg-emerald-50",
      accent: "bg-emerald-500"
    }
  ];

  return (
    <section className="py-24 bg-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">
            {language === 'ar' ? 'نماذج حقيقية، نجاح حقيقي' : 'Real Resumes, Real Success'}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'انضم إلى آلاف المحترفين الذين حصلوا على وظائفهم باستخدام Hash Resume.' 
              : 'Join thousands of professionals who landed their jobs using Hash Resume.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {resumes.map((resume, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-slate-900/5 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <div className={`relative bg-white p-2 rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[400px] hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2`}>
                {/* Mini Resume Mockup */}
                <div className="h-full w-full bg-white flex flex-col p-6 text-[8px] leading-relaxed select-none pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <div className="text-lg font-bold text-slate-900 mb-1">{resume.name}</div>
                      <div className={`text-xs font-semibold ${resume.accent.replace('bg-', 'text-')}`}>{resume.role}</div>
                    </div>
                    <div className={`w-8 h-8 rounded-full ${resume.accent} opacity-20`}></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 h-full">
                    <div className="col-span-1 space-y-4 border-r border-slate-100 pr-2">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 uppercase tracking-wider">Contact</div>
                        <div className="h-1 bg-slate-200 rounded w-full"></div>
                        <div className="h-1 bg-slate-200 rounded w-3/4"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 uppercase tracking-wider">Skills</div>
                        <div className="flex flex-wrap gap-1">
                          {[1,2,3,4,5].map(k => (
                            <div key={k} className="h-3 bg-slate-100 rounded w-full"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-4">
                      <div className="space-y-2">
                        <div className="font-bold text-slate-900 uppercase tracking-wider">Experience</div>
                        {[1,2].map(k => (
                          <div key={k} className="space-y-1">
                            <div className="flex justify-between">
                              <div className="font-bold text-slate-800">Senior Role</div>
                              <div className="text-slate-400">2020 - Present</div>
                            </div>
                            <div className="h-1 bg-slate-200 rounded w-full"></div>
                            <div className="h-1 bg-slate-200 rounded w-full"></div>
                            <div className="h-1 bg-slate-200 rounded w-5/6"></div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="font-bold text-slate-900 uppercase tracking-wider">Education</div>
                        <div className="space-y-1">
                          <div className="font-bold text-slate-800">University Name</div>
                          <div className="h-1 bg-slate-200 rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-50"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
