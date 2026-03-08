import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, LayoutTemplate, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';
import { useLanguageStore } from '../store/useLanguageStore';
import { useResumeStore, ResumeData } from '../store/useResumeStore';
import ResumePreview from '../components/preview/ResumePreview';

const dummyData: ResumeData = {
  personalInfo: {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Product Designer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: '',
    portfolio: '',
    summary: 'Award-winning Product Designer with 8+ years of experience creating user-centric digital products. Proven track record of leading design teams and increasing user engagement by 40%. Passionate about accessibility and design systems.',
  },
  coverLetter: {
    fullName: '',
    jobTitle: '',
    companyName: '',
    hiringManager: '',
    jobDescription: '',
    skills: '',
    generatedContent: '',
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
};

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with a focus on readability.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
    color: '#2563EB'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional format perfect for corporate and formal roles.',
    image: 'https://images.unsplash.com/photo-1612441804231-77a36b284856?q=80&w=600&auto=format&fit=crop',
    color: '#1E293B'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with a unique layout designed for creative fields.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop',
    color: '#F97316'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple, elegant, and straight to the point.',
    image: 'https://images.unsplash.com/photo-1586282391129-76a6df230234?q=80&w=600&auto=format&fit=crop',
    color: '#475569'
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Optimized for software engineers and IT professionals.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    color: '#10B981'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium layout for senior management and leadership roles.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    color: '#8B5CF6'
  }
] as const;

export default function TemplatesPage() {
  const { language } = useLanguageStore();
  const { data, updateSettings } = useResumeStore();
  const navigate = useNavigate();

  const handleSelectTemplate = (templateId: typeof templates[number]['id']) => {
    updateSettings({ template: templateId });
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
      <Helmet>
        <title>Resume Templates - Hash Resume</title>
        <meta name="description" content="Browse our collection of professional, ATS-friendly resume templates." />
      </Helmet>

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft size={20} className="rtl:rotate-180" />
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-[#f16529]" />
              <span className="font-display font-bold text-xl hidden sm:block">Hash Resume</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-900/30 text-[#f16529] font-medium text-sm mb-6"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => {
            const isSelected = data.settings.template === template.id;
            
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                  isSelected 
                    ? 'border-[#f16529] shadow-lg shadow-orange-500/10' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 z-20 bg-[#f16529] text-white p-1.5 rounded-full shadow-md">
                    <CheckCircle2 size={20} />
                  </div>
                )}
                
                <div className="aspect-[1/1.414] relative overflow-hidden bg-slate-100 dark:bg-slate-800 @container">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Real Resume Preview */}
                  <div 
                    className="absolute top-0 left-0 w-[800px] origin-top-left transition-transform duration-500 opacity-90 group-hover:opacity-100"
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

                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => handleSelectTemplate(template.id)}
                      className="bg-[#f16529] text-white px-6 py-3 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#e44d26] hover:scale-105"
                    >
                      {isSelected 
                        ? (language === 'ar' ? 'محدد حالياً' : language === 'fr' ? 'Sélectionné' : 'Currently Selected')
                        : (language === 'ar' ? 'استخدم هذا القالب' : language === 'fr' ? 'Utiliser ce modèle' : 'Use This Template')
                      }
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{template.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{template.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
