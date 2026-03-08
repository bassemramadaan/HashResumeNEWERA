import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  Shield, 
  Star,
  Users,
  Briefcase,
  Layout,
  Cpu,
  Menu,
  X,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import { blogPosts } from '../data/blogPosts';

export default function LandingPage() {
  const { language, setLanguage } = useLanguageStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userCount, setUserCount] = useState(2990);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Realistic counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly increment by 1 every 3-8 seconds to simulate live signups
      if (Math.random() > 0.7) {
        setUserCount(prev => prev + 1);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Sparkles className="text-amber-500" />,
      title: { en: "AI-Powered Writing", ar: "كتابة مدعومة بالذكاء الاصطناعي" },
      description: { en: "Generate professional summaries and bullet points in seconds.", ar: "أنشئ ملخصات احترافية ونقاطًا في ثوانٍ." }
    },
    {
      icon: <Layout className="text-blue-500" />,
      title: { en: "ATS-Friendly Templates", ar: "قوالب متوافقة مع ATS" },
      description: { en: "Designs optimized for Applicant Tracking Systems.", ar: "تصاميم محسنة لأنظمة تتبع المتقدمين." }
    },
    {
      icon: <Cpu className="text-emerald-500" />,
      title: { en: "Real-time Analysis", ar: "تحليل في الوقت الفعلي" },
      description: { en: "Get instant feedback on your resume's strength.", ar: "احصل على تعليقات فورية حول قوة سيرتك الذاتية." }
    },
    {
      icon: <Globe className="text-indigo-500" />,
      title: { en: "Multi-language Support", ar: "دعم متعدد اللغات" },
      description: { en: "Create resumes in English, Arabic, and French.", ar: "أنشئ سير ذاتية بالإنجليزية والعربية والفرنسية." }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                H
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Hash Resume</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {language === 'ar' ? 'المميزات' : 'Features'}
              </a>
              <Link to="/templates" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {language === 'ar' ? 'القوالب' : 'Templates'}
              </Link>
              <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {language === 'ar' ? 'الأسعار' : 'Pricing'}
              </a>
              <a href="#blog" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {language === 'ar' ? 'المدونة' : 'Blog'}
              </a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-full transition-colors"
              >
                <Globe size={16} />
                {language === 'ar' ? 'English' : 'العربية'}
              </button>
              <Link to="/editor" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:scale-105 active:scale-95">
                {language === 'ar' ? 'أنشئ سيرتك الذاتية' : 'Build Resume'}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-4 shadow-lg animate-in slide-in-from-top-5">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-slate-600 dark:text-slate-300 font-medium p-2" onClick={() => setMobileMenuOpen(false)}>
                {language === 'ar' ? 'المميزات' : 'Features'}
              </a>
              <Link to="/templates" className="text-slate-600 dark:text-slate-300 font-medium p-2" onClick={() => setMobileMenuOpen(false)}>
                {language === 'ar' ? 'القوالب' : 'Templates'}
              </Link>
              <a href="#pricing" className="text-slate-600 dark:text-slate-300 font-medium p-2" onClick={() => setMobileMenuOpen(false)}>
                {language === 'ar' ? 'الأسعار' : 'Pricing'}
              </a>
              <a href="#blog" className="text-slate-600 dark:text-slate-300 font-medium p-2" onClick={() => setMobileMenuOpen(false)}>
                {language === 'ar' ? 'المدونة' : 'Blog'}
              </a>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
              <button 
                onClick={() => {
                  setLanguage(language === 'ar' ? 'en' : 'ar');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium p-2"
              >
                <Globe size={18} />
                {language === 'ar' ? 'Switch to English' : 'تغيير للعربية'}
              </button>
              <Link to="/editor" className="bg-indigo-600 text-white text-center py-3 rounded-xl font-bold" onClick={() => setMobileMenuOpen(false)}>
                {language === 'ar' ? 'أنشئ سيرتك الذاتية' : 'Build Resume'}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Background Graphics */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#f16529] opacity-20 blur-[100px] animate-pulse"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500 opacity-10 blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left Column: Text & CTA */}
            <div className="flex-1 text-center lg:text-start rtl:lg:text-right">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-indigo-100 dark:border-indigo-800/50">
                  <Sparkles size={16} />
                  {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي GPT-4' : 'Powered by GPT-4 AI'}
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
                  {language === 'ar' ? 'اصنع سيرة ذاتية' : 'Build a Resume'} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                    {language === 'ar' ? 'تضمن لك الوظيفة' : 'That Gets You Hired'}
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {language === 'ar' 
                    ? 'أنشئ سيرة ذاتية احترافية متوافقة مع ATS في دقائق. دع الذكاء الاصطناعي يكتب عنك، واحصل على وظيفة أحلامك بشكل أسرع.' 
                    : 'Create a professional, ATS-friendly resume in minutes. Let AI write for you, and land your dream job faster.'}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                  <Link to="/editor" className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20">
                    {language === 'ar' ? 'ابدأ الآن مجاناً' : 'Start Now for Free'}
                    <ArrowRight size={20} />
                  </Link>
                  <Link to="/templates" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-lg hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    {language === 'ar' ? 'تصفح القوالب' : 'View Templates'}
                  </Link>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-slate-900 dark:text-white font-bold tabular-nums">{userCount.toLocaleString()}+</span>
                      <span className="text-xs">{language === 'ar' ? 'مستخدم سعيد' : 'Happy Users'}</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <span className="text-slate-900 dark:text-white font-bold">4.9/5</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Preview Image */}
            <div className="flex-1 relative w-full max-w-[600px] lg:max-w-none">
              <motion.div 
                style={{ opacity, scale }}
                className="relative z-10 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/20 border border-slate-200 dark:border-slate-800 p-2 md:p-4 rotate-2 hover:rotate-0 transition-transform duration-500"
              >
                <img 
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=2000" 
                  alt="Resume Builder Interface" 
                  className="rounded-xl w-full h-auto object-cover aspect-[4/3]"
                />
                
                {/* Floating Badge 1 */}
                <div className="absolute -left-4 top-10 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-bounce-slow">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">ATS Score</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">92/100</div>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -right-6 bottom-20 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-bounce-slow delay-700">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Suggestions</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Optimized</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">
              {language === 'ar' ? 'كل ما تحتاجه للنجاح' : 'Everything You Need to Succeed'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'أدوات قوية مصممة لمساعدتك في الحصول على مقابلات عمل أكثر، بجهد أقل.' 
                : 'Powerful tools designed to help you land more interviews, with less effort.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group"
              >
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {React.cloneElement(feature.icon as React.ReactElement<{ size: number }>, { size: 28 })}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {language === 'ar' ? feature.title.ar : feature.title.en}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'ar' ? feature.description.ar : feature.description.en}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing Section */}
      <Pricing />

      {/* Cover Letter Generator Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-600 blur-[100px] opacity-20 rounded-full"></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-10">
                  {/* Cover Letter Preview */}
                  <div className="space-y-6 font-serif text-slate-800 dark:text-slate-300 text-sm leading-relaxed opacity-90">
                    <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                      <div>
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                        <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800 rounded"></div>
                      </div>
                      <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-5/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                    <div className="pt-4">
                      <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-2"></div>
                      <div className="h-3 w-40 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>

                  {/* Floating AI Badge */}
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-pulse">
                    <Sparkles size={24} />
                    <div className="font-bold">
                      <div className="text-xs opacity-80">AI Generated</div>
                      <div>Cover Letter</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2 text-center lg:text-start rtl:lg:text-right">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">
                {language === 'ar' ? 'ليس مجرد سيرة ذاتية' : 'Not Just a Resume'}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                {language === 'ar' 
                  ? 'أنشئ خطابات تقديم مخصصة لكل وظيفة تتقدم إليها. يقوم الذكاء الاصطناعي الخاص بنا بتحليل الوصف الوظيفي وكتابة خطاب يبرز مهاراتك.' 
                  : 'Create tailored cover letters for every job you apply to. Our AI analyzes the job description and writes a letter that highlights your skills.'}
              </p>
              <Link to="/editor" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:gap-3 transition-all">
                {language === 'ar' ? 'جرب منشئ الخطابات' : 'Try Cover Letter Generator'}
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-display tracking-tight">
                {language === 'ar' ? 'أحدث المقالات' : 'Latest Insights'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {language === 'ar' ? 'نصائح وإرشادات مهنية لمساعدتك في مسيرتك.' : 'Career advice and tips to help you advance.'}
              </p>
            </div>
            <Link to="/blog" className="hidden md:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:gap-3 transition-all">
              {language === 'ar' ? 'عرض الكل' : 'View All'}
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[16/10]">
                  <img 
                    src={post.image} 
                    alt={language === 'ar' ? post.title.ar : post.title.en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{language === 'ar' ? post.readTime.ar : post.readTime.en}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {language === 'ar' ? post.title.ar : post.title.en}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                  {language === 'ar' ? post.excerpt.ar : post.excerpt.en}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-indigo-500/20 blur-[120px] rounded-full"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
            {language === 'ar' ? 'جاهز لبناء مستقبلك؟' : 'Ready to Build Your Future?'}
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {language === 'ar' 
              ? 'انضم إلى الآلاف من الباحثين عن عمل الذين حصلوا على وظائفهم بفضل Hash Resume.' 
              : 'Join thousands of job seekers who landed their dream jobs with Hash Resume.'}
          </p>
          <Link to="/editor" className="inline-block px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-xl hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
            {language === 'ar' ? 'أنشئ سيرتي الذاتية الآن' : 'Build My Resume Now'}
          </Link>
          <p className="mt-6 text-sm text-slate-400">
            {language === 'ar' ? 'لا حاجة لبطاقة ائتمان • مجاني للاستخدام' : 'No credit card required • Free to use'}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  H
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Hash Resume</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                {language === 'ar' 
                  ? 'أداة بناء السيرة الذاتية الأذكى المدعومة بالذكاء الاصطناعي. صُممت لمساعدتك في الحصول على الوظيفة التي تستحقها.' 
                  : 'The smartest AI-powered resume builder. Designed to help you get the job you deserve.'}
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Github size={20} /></a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Linkedin size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">{language === 'ar' ? 'المنتج' : 'Product'}</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link to="/editor" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'بناء السيرة الذاتية' : 'Resume Builder'}</Link></li>
                <li><Link to="/templates" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'القوالب' : 'Templates'}</Link></li>
                <li><a href="#pricing" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'الأسعار' : 'Pricing'}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">{language === 'ar' ? 'الموارد' : 'Resources'}</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link to="/blog" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'المدونة' : 'Blog'}</Link></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'أمثلة السيرة الذاتية' : 'Resume Examples'}</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'نصائح مهنية' : 'Career Advice'}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">{language === 'ar' ? 'الشركة' : 'Company'}</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'من نحن' : 'About Us'}</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'اتصل بنا' : 'Contact'}</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">{language === 'ar' ? 'الخصوصية' : 'Privacy'}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              © 2026 Hash Resume. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
