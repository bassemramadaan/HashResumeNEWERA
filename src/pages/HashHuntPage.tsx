import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Briefcase, Building2, Search, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import Logo from '../components/Logo';

export default function HashHuntPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative">
        <div className="flex items-center gap-6 flex-1">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden sm:block">Back to Resume Builder</Link>
        </div>
        
        {/* Centered Logo */}
        <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
          <Logo className="w-12 h-12 text-indigo-600" />
        </div>

        <div className="flex items-center justify-end gap-6 flex-1">
          <a 
            href="https://forms.gle/5kEp1zSjMz3f4HyJ9" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            Submit Resume <ExternalLink size={16} />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/80 backdrop-blur-sm text-indigo-800 text-sm font-medium mb-8 border border-indigo-200"
          >
            <Briefcase size={16} />
            Exclusive Job Opportunities
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 font-display"
          >
            Let the jobs <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">find you.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10"
          >
            Upload your resume to Hash Hunt and get matched with top companies actively hiring. We partner directly with employers to fast-track your application.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a 
              href="https://forms.gle/5kEp1zSjMz3f4HyJ9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group"
            >
              Upload Your Resume
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">How Hash Hunt Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Your next career move is just a few clicks away.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-slate-100 -z-10"></div>
            
            {[
              { icon: Briefcase, title: "1. Build Your Resume", desc: "Use Hash Resume to create a professional, ATS-friendly CV." },
              { icon: Search, title: "2. Submit to Hash Hunt", desc: "Upload your resume to our secure talent pool via our quick form." },
              { icon: Building2, title: "3. Get Matched", desc: "Our team matches your profile with partner companies looking for your skills." }
            ].map((item, i) => (
              <div key={i} className="text-center relative group">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 group-hover:border-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6 shadow-sm transition-colors">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-900 rounded-3xl p-8 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center gap-12 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
            
            <div className="flex-1 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">Why join Hash Hunt?</h2>
              <ul className="space-y-4">
                {[
                  "Direct access to hiring managers, skipping the ATS black hole.",
                  "Personalized job matching based on your unique skills.",
                  "100% free for candidates. We only charge employers.",
                  "Exclusive roles not posted on public job boards."
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-indigo-100">
                    <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <a 
                  href="https://forms.gle/5kEp1zSjMz3f4HyJ9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg shadow-emerald-500/30"
                >
                  Join the Talent Pool
                  <ArrowRight size={20} />
                </a>
              </div>
            </div>
            
            <div className="flex-1 relative z-10 hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="Team collaboration" 
                className="rounded-2xl shadow-2xl border-4 border-indigo-800/50"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <Logo className="w-10 h-10 text-indigo-500 mb-2" />
            <span className="text-2xl font-black text-white font-display">Hash Resume</span>
          </div>
          <p className="text-sm mb-8">Professional resumes, simplified. Built with privacy in mind.</p>
          <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Hash Resume. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-white transition-colors">Resume Builder</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
