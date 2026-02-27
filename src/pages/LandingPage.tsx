import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, FileText, CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';
import Logo from '../components/Logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      {/* WhatsApp Support Banner */}
      <div className="bg-indigo-600 text-white text-sm py-2 px-4 flex items-center justify-center gap-2 font-medium">
        <MessageCircle size={16} />
        <span>Need help? Chat with us on WhatsApp</span>
        <a href="#" className="underline hover:text-indigo-100 ml-2">Contact Support</a>
      </div>

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative">
        <div className="flex items-center gap-6 flex-1">
          <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hidden sm:block">Features</a>
          <a href="#process" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hidden sm:block">How it works</a>
          <Link to="/hash-hunt" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hidden sm:block">Hash Hunt Jobs</Link>
        </div>
        
        {/* Centered Logo */}
        <div className="flex items-center justify-center gap-3 absolute left-1/2 -translate-x-1/2">
          <Logo className="w-12 h-12 text-indigo-600" />
          <span className="text-2xl font-bold tracking-tight text-zinc-900 hidden sm:block">Hash Resume</span>
        </div>

        <div className="flex items-center justify-end gap-6 flex-1">
          <Link to="/editor" className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20">
            Go to Editor
          </Link>
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
            <ShieldCheck size={16} />
            Your data never leaves your device — 100% private
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 mb-6"
          >
            Professional Resumes.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Simplified.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-10"
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
            <div className="flex items-center gap-3 text-sm text-zinc-500 font-medium">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-zinc-50 bg-zinc-200 flex items-center justify-center overflow-hidden`}>
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div>
                <span className="text-zinc-900 font-bold block">1k+</span> 
                Resumes Exported
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-zinc-100">
            <div>
              <p className="text-3xl font-bold text-zinc-900 mb-1">2.5k+</p>
              <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Resumes This Month</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-zinc-900 mb-1">&lt; 5m</p>
              <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Avg. Build Time</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-zinc-900 mb-1">95%</p>
              <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">ATS Pass Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-zinc-900 mb-1">3x</p>
              <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Interview Success</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section id="features" className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Everything you need to land the job</h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">Powerful features designed to make your resume stand out to both recruiters and applicant tracking systems.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Instant Generation", desc: "See your changes in real-time. No waiting, no loading screens." },
              { icon: ShieldCheck, title: "100% Private", desc: "Your data is stored locally on your device. We never see your info." },
              { icon: FileText, title: "ATS Ready", desc: "Templates optimized to pass through Applicant Tracking Systems." },
              { icon: CheckCircle2, title: "Smart Suggestions", desc: "Built-in tips and examples to help you write better content." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow hover:border-indigo-100 group">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">How it works</h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">Three simple steps to your next career move.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-zinc-100 -z-10"></div>
            
            {[
              { step: "01", title: "Fill Data", desc: "Enter your details or import from LinkedIn. Our smart forms make it quick and painless." },
              { step: "02", title: "Audit & Refine", desc: "Check your ATS score in real-time and use our suggestions to improve your content." },
              { step: "03", title: "Export & Apply", desc: "Download as a pixel-perfect PDF and start applying to your dream jobs immediately." }
            ].map((item, i) => (
              <div key={i} className="text-center relative group">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-zinc-50 group-hover:border-indigo-50 rounded-full flex items-center justify-center text-3xl font-black text-zinc-200 group-hover:text-indigo-600 mb-6 shadow-sm transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{item.title}</h3>
                <p className="text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Logo className="w-10 h-10 text-indigo-500" />
                <span className="text-2xl font-bold text-white">Hash Resume</span>
              </div>
              <p className="text-sm">Professional resumes, simplified. Built with privacy in mind.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/editor" className="hover:text-white transition-colors">Resume Builder</Link></li>
                <li><Link to="/hash-hunt" className="hover:text-white transition-colors">Hash Hunt Jobs</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cover Letter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">ATS Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Advice</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Hash Resume. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
