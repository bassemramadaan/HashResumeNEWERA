import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, FileText, CheckCircle2, ArrowRight, MessageCircle, Facebook, Instagram, AtSign } from 'lucide-react';
import Logo from '../components/Logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      {/* WhatsApp Support Banner */}
      <div className="bg-indigo-600 text-white text-sm py-2 px-4 flex items-center justify-center gap-2 font-medium">
        <MessageCircle size={16} />
        <span>Need help? Chat with us on WhatsApp</span>
        <a href="https://wa.me/201101007965" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-100 ml-2">Contact Support</a>
      </div>

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative">
        <div className="flex items-center gap-6 flex-1">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden sm:block">Features</a>
          <a href="#process" className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden sm:block">How it works</a>
          <Link to="/hash-hunt" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hidden sm:block">Hash Hunt Jobs</Link>
        </div>
        
        {/* Centered Logo */}
        <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
          <Logo className="w-12 h-12 text-indigo-600" />
        </div>

        <div className="flex items-center justify-end gap-6 flex-1">
          {/* Removed Go to Editor button */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 font-display"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 block mb-2 md:mb-4 text-4xl md:text-5xl">Hash Resume</span>
            Professional Resumes.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Simplified.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10"
          >
            Build an ATS-friendly, beautifully designed resume in minutes. No sign-up required, completely free, and your data stays on your device.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/editor" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group">
              Build My Resume
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-100">
              <ShieldCheck size={16} />
              Your data never leaves your device — 100% private
            </div>
            <div className="text-sm text-slate-500 font-medium">
              <span className="font-bold text-indigo-600">Hash Resume</span> is a part of Hash Social Media Marketing Agency
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Cards */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Everything you need to land the job</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Powerful features designed to make your resume stand out to both recruiters and applicant tracking systems.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Instant Generation", desc: "See your changes in real-time. No waiting, no loading screens." },
              { icon: ShieldCheck, title: "100% Private", desc: "Your data is stored locally on your device. We never see your info." },
              { icon: FileText, title: "ATS Ready", desc: "Templates optimized to pass through Applicant Tracking Systems." },
              { icon: CheckCircle2, title: "Smart Suggestions", desc: "Built-in tips and examples to help you write better content." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow hover:border-indigo-100 group">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">How it works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Three simple steps to your next career move.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-slate-100 -z-10"></div>
            
            {[
              { step: "01", title: "Fill Data", desc: "Enter your details. Our smart forms make it quick and painless." },
              { step: "02", title: "Audit & Refine", desc: "Check your ATS score in real-time and use our suggestions to improve your content." },
              { step: "03", title: "Export & Apply", desc: "Download as a pixel-perfect PDF and start applying to your dream jobs immediately." }
            ].map((item, i) => (
              <div key={i} className="text-center relative group">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 group-hover:border-indigo-50 rounded-full flex items-center justify-center text-3xl font-black text-slate-200 group-hover:text-indigo-600 mb-6 shadow-sm transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="flex flex-col items-start mb-6">
                <Logo className="w-10 h-10 text-indigo-500 mb-2" />
                <span className="text-2xl font-black text-white font-display">Hash Resume</span>
                <span className="text-sm text-slate-500 mt-1">A part of Hash Social Media Marketing Agency</span>
              </div>
              <p className="text-sm max-w-sm">Professional resumes, simplified. Built with privacy in mind.</p>
            </div>
            <div className="flex flex-col md:items-end">
              <h4 className="text-white font-semibold mb-4">Connect with us</h4>
              <div className="flex gap-4 mb-8">
                <a href="https://www.facebook.com/hashsocialmarketing" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-500 transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://www.instagram.com/hashsocialmarketing/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://www.threads.com/@hashsocialmarketing" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Threads">
                  <AtSign size={20} />
                </a>
                <a href="https://wa.me/201101007965" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-green-500 transition-colors" aria-label="WhatsApp">
                  <MessageCircle size={20} />
                </a>
              </div>

              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm md:text-right">
                <li><Link to="/editor" className="hover:text-white transition-colors">Resume Builder</Link></li>
                <li><Link to="/cover-letter" className="hover:text-white transition-colors">Cover Letter Builder</Link></li>
                <li><Link to="/hash-hunt" className="hover:text-white transition-colors">Hash Hunt Jobs</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Hash Resume. All rights reserved.</p>
            <div className="flex gap-4">
              <p>100% Private. Your data stays on your device.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
