import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LayoutTemplate, CheckCircle2, Eye, X } from 'lucide-react';
import Logo from '../components/Logo';
import { useLanguageStore } from '../store/useLanguageStore';
import { useResumeStore, ResumeData } from '../store/useResumeStore';
import ResumePreview from '../components/preview/ResumePreview';
import { cn } from '../utils/index';

const dummyData: ResumeData = {
  personalInfo: {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Product Designer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    portfolio: 'alexmorgan.design',
    summary: 'Award-winning Product Designer with 8+ years of experience creating user-centric digital products. Proven track record of leading design teams and increasing user engagement by 40%. Passionate about accessibility and design systems.',
  },
  experience: [
    {
      id: '1',
      company: 'TechNova Solutions',
      position: 'Lead Product Designer',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: '• Led the redesign of the core SaaS platform, resulting in a 35% increase in user retention.\n• Established and maintained a comprehensive design system used by 50+ developers.\n• Mentored a team of 4 junior designers and conducted weekly design critiques.',
    },
    {
      id: '2',
      company: 'CreativePulse Agency',
      position: 'UX/UI Designer',
      startDate: 'Mar 2016',
      endDate: 'Dec 2019',
      description: '• Designed responsive web applications for Fortune 500 clients in fintech and healthcare.\n• Conducted user research and usability testing with over 100 participants.\n• Reduced onboarding drop-off rate by 25% through UX improvements.',
    }
  ],
  education: [
    {
      id: '1',
      institution: 'California College of the Arts',
      degree: 'BFA in Interaction Design',
      startDate: 'Sep 2012',
      endDate: 'May 2016',
      description: 'Graduated with Honors. Senior thesis focused on accessible design patterns.',
    }
  ],
  skills: ['UI/UX Design', 'Figma', 'Design Systems', 'User Research', 'Prototyping', 'HTML/CSS', 'Agile Methodology'],
  projects: [],
  certifications: [],
  settings: {
    template: 'modern',
    themeColor: '#2563EB',
    language: 'en',
    isFreshGrad: false,
  },
  jobDescription: '',
  isPremium: false,
  coverLetter: {
    fullName: '',
    jobTitle: '',
    companyName: '',
    hiringManager: '',
    jobDescription: '',
    skills: '',
    generatedContent: '',
  },
};

type Template = {
  id: ResumeData['settings']['template'];
  name: string;
  description: string;
  image: string;
  color: string;
  categories: string[];
};

const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with a focus on readability.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
    color: '#2563EB',
    categories: ['Technology', 'Business']
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional format perfect for corporate and formal roles.',
    image: 'https://images.unsplash.com/photo-1612441804231-77a36b284856?q=80&w=600&auto=format&fit=crop',
    color: '#1E293B',
    categories: ['Business', 'Healthcare', 'Academic']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with a unique layout designed for creative fields.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop',
    color: '#F97316',
    categories: ['Creative']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple, elegant, and straight to the point.',
    image: 'https://images.unsplash.com/photo-1586282391129-76a6df230234?q=80&w=600&auto=format&fit=crop',
    color: '#475569',
    categories: ['Business', 'Academic']
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Optimized for software engineers and IT professionals.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    color: '#10B981',
    categories: ['Technology']
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium layout for senior management and leadership roles.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    color: '#8B5CF6',
    categories: ['Business']
  },
  {
    id: 'medical',
    name: 'Medical',
    description: 'Specialized format for healthcare professionals and doctors.',
    image: 'https://images.unsplash.com/photo-1505751172107-5739a00723a5?q=80&w=600&auto=format&fit=crop',
    color: '#0EA5E9',
    categories: ['Healthcare']
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Multi-page optimized CV for researchers and educators.',
    image: 'https://images.unsplash.com/photo-1523050335392-93851179ae22?q=80&w=600&auto=format&fit=crop',
    color: '#64748B',
    categories: ['Academic']
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Formal and authoritative design for legal professionals.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop',
    color: '#0F172A',
    categories: ['Business']
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Versatile and polished layout for any industry.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=600&auto=format&fit=crop',
    color: '#334155',
    categories: ['Business', 'Technology']
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with refined typography.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop',
    color: '#BE185D',
    categories: ['Creative', 'Business']
  },
  {
    id: 'arabic',
    name: 'Arabic (RTL)',
    description: 'Optimized for Arabic language with full RTL support.',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dc8c?q=80&w=600&auto=format&fit=crop',
    color: '#059669',
    categories: ['Business', 'Technology']
  },
  {
    id: 'engineering',
    name: 'Engineering',
    description: 'Technical and structured layout for engineers.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop',
    color: '#0284C7',
    categories: ['Engineering', 'Technology']
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Professional and data-focused layout for finance roles.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
    color: '#0F766E',
    categories: ['Finance', 'Business']
  }
];

const categories = ['All', 'Technology', 'Business', 'Creative', 'Healthcare', 'Academic', 'Engineering', 'Finance'] as const;
type Category = typeof categories[number];

export default function TemplatesPage() {
  const { language } = useLanguageStore();
  const { data, updateSettings, resetData } = useResumeStore();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [previewTemplate, setPreviewTemplate] = useState<typeof templates[number] | null>(null);

  const handleSelectTemplate = (templateId: ResumeData['settings']['template']) => {
    resetData();
    updateSettings({ template: templateId });
    navigate('/editor');
  };

  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(t => (t.categories as string[]).includes(activeCategory));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
      {/* Header */}
      <header 
        className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-all duration-500 ease-in-out"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ms-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft size={20} className="rtl:rotate-180" />
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-[#ff4d2d]" />
              <span className="font-display font-bold text-xl hidden sm:block">Hash Resume</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-900/30 text-[#ff4d2d] font-medium text-sm mb-6"
          >
            <LayoutTemplate size={16} />
            {language === 'ar' ? 'مكتبة القوالب' : language === 'fr' ? 'Bibliothèque de modèles' : 'Template Library'}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display mb-6 tracking-tight"
          >
            {language === 'ar' ? 'اختر قالب سيرتك الذاتية' : language === 'fr' ? 'Choisissez votre modèle de CV' : 'Choose Your Resume Template'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            {language === 'ar' 
              ? 'جميع قوالبنا مصممة باحترافية ومتوافقة مع أنظمة تتبع المتقدمين (ATS) لضمان وصول سيرتك الذاتية للمدراء.' 
              : language === 'fr'
              ? 'Tous nos modèles sont conçus par des professionnels et optimisés pour les ATS afin de garantir que votre CV parvienne aux recruteurs.'
              : 'All our templates are professionally designed and ATS-optimized to ensure your resume gets past the bots and into the hands of hiring managers.'}
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === category
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template) => {
              const isSelected = data.settings.template === template.id;
              
              return (
                <motion.div
                  layout
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl flex flex-col ${
                    isSelected 
                      ? 'border-[#ff4d2d] shadow-lg shadow-orange-500/10' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 end-4 z-20 bg-[#ff4d2d] text-white p-2 rounded-full shadow-md">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                  
                  <div className="aspect-[1/1.414] relative overflow-hidden bg-slate-100 dark:bg-slate-800 @container group cursor-pointer" onClick={() => setPreviewTemplate(template)}>
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10"></div>
                    
                    {/* Real Resume Preview - Scaled to fit */}
                    <div 
                      className="absolute top-0 start-0 w-[800px] origin-top-left transition-transform duration-500"
                      style={{ transform: 'scale(calc(100cqi / 800))' }}
                    >
                      <ResumePreview 
                        data={{
                          ...dummyData,
                          settings: {
                            ...dummyData.settings,
                            template: template.id,
                            themeColor: template.color
                          }
                        }} 
                      />
                    </div>

                    {/* Bottom Fade */}
                    <div className="absolute bottom-0 start-0 end-0 h-24 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-10 opacity-60"></div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/20 md:bg-slate-900/20 backdrop-blur-[2px] md:backdrop-blur-[2px]">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTemplate(template.id);
                        }}
                        className="bg-[#ff4d2d] text-white px-6 py-4 rounded-full font-bold shadow-lg transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#e63e1d] hover:scale-105 min-w-[160px] active:scale-95"
                      >
                        {isSelected 
                          ? (language === 'ar' ? 'محدد حالياً' : language === 'fr' ? 'Sélectionné' : 'Currently Selected')
                          : (language === 'ar' ? 'استخدم هذا القالب' : language === 'fr' ? 'Utiliser ce modèle' : 'Use This Template')
                        }
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template);
                        }}
                        className="bg-white text-slate-900 px-6 py-4 rounded-full font-bold shadow-lg transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:bg-slate-100 hover:scale-105 min-w-[160px] flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Eye size={18} />
                        {language === 'ar' ? 'معاينة' : 'Preview'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{template.name}</h3>
                      <div className="flex gap-1">
                        {template.categories.slice(0, 2).map(cat => (
                          <span key={cat} className="text-[10px] uppercase font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{template.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* Full Screen Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-100 dark:bg-slate-900 w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Sidebar Info */}
              <div className="w-full md:w-80 bg-white dark:bg-slate-950 p-8 border-e border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-y-auto">
                <div className="flex justify-between items-center mb-8 md:hidden">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{previewTemplate.name}</h2>
                  <button onClick={() => setPreviewTemplate(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 hidden md:block">{previewTemplate.name}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  {previewTemplate.description}
                </p>

                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Best For</h3>
                    <div className="flex flex-wrap gap-2">
                      {previewTemplate.categories.map(cat => (
                        <span key={cat} className="px-4 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        ATS-Friendly Layout
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        Professional Typography
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        Optimized Spacing
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <button 
                    onClick={() => handleSelectTemplate(previewTemplate.id)}
                    className="w-full bg-[#ff4d2d] hover:bg-[#e63e1d] text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {language === 'ar' ? 'استخدم هذا القالب' : 'Use This Template'}
                  </button>
                  <button 
                    onClick={() => setPreviewTemplate(null)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors hidden md:block"
                  >
                    Close Preview
                  </button>
                </div>
              </div>

              {/* Preview Area */}
              <div className="flex-1 bg-slate-200/50 dark:bg-slate-900/50 overflow-y-auto p-8 flex justify-center">
                <div className="w-full max-w-[210mm] bg-white shadow-2xl min-h-[297mm]">
                  <ResumePreview 
                    data={{
                      ...dummyData,
                      settings: {
                        ...dummyData.settings,
                        template: previewTemplate.id,
                        themeColor: previewTemplate.color
                      }
                    }} 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
