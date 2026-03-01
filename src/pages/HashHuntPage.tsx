import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Briefcase, Building2, Search, ArrowRight, CheckCircle2, ExternalLink, MapPin, Clock, DollarSign } from 'lucide-react';
import Logo from '../components/Logo';
import React, { useState, useEffect } from 'react';

interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  postedAt?: string;
  description?: string;
  url?: string;
  logo?: string;
  code?: string;
}

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const applyUrl = "https://forms.gle/h1UNQfD55dc2o8wM6";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:border-indigo-100 group flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xl overflow-hidden shrink-0 border border-slate-100 group-hover:border-indigo-100 transition-colors shadow-sm">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
            ) : (
              job.company.charAt(0)
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">{job.title}</h3>
            <p className="text-sm text-slate-500 font-medium">{job.company}</p>
          </div>
        </div>
        {job.postedAt && (
          <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">{job.postedAt}</span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-5 relative z-10">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-indigo-50/50 group-hover:text-indigo-700 group-hover:border-indigo-100 transition-colors">
          <MapPin size={14} className="text-slate-400 group-hover:text-indigo-500" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-indigo-50/50 group-hover:text-indigo-700 group-hover:border-indigo-100 transition-colors">
          <Briefcase size={14} className="text-slate-400 group-hover:text-indigo-500" />
          {job.type}
        </div>
        {job.code && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 font-mono">
            #{job.code}
          </div>
        )}
      </div>

      {job.description && (
        <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-grow leading-relaxed relative z-10">
          {job.description}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50 relative z-10">
        <span className="text-xs font-medium text-slate-500">
          Use code <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded ml-1">{job.code || 'N/A'}</span>
        </span>
        <a 
          href={applyUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 z-20 group/btn"
        >
          Apply Now 
          <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </motion.div>
  );
}

export default function HashHuntPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const apiUrl = import.meta.env.VITE_JOBS_API;
        if (!apiUrl) {
          throw new Error('API URL not configured');
        }
        
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        
        const data = await res.json();
        if (!data) {
          throw new Error('No data received');
        }
        // Ensure data is an array, handle potential API response variations
        const jobsArray = Array.isArray(data) ? data : (data.jobs || []);
        setJobs(jobsArray);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

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
      <section className="relative pt-20 pb-20 overflow-hidden">
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
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8"
          >
            Browse exclusive roles from our partner companies or upload your resume to get matched automatically.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-4">
              <a 
                href="https://forms.gle/5kEp1zSjMz3f4HyJ9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-indigo-600 text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                Submit Resume <ExternalLink size={20} />
              </a>
            </div>

            {!loading && (
              <div className="flex items-center gap-2 text-slate-500 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <span className="font-medium text-slate-700">{jobs.length}</span>
                <span>active opportunities available now</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Jobs List Section */}
      <section className="py-12 bg-white border-t border-slate-200 min-h-[400px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 font-display">Latest Opportunities</h2>
            <div className="text-sm text-slate-500">
              {loading ? 'Loading jobs...' : `${jobs.length} jobs found`}
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 animate-pulse h-64">
                  <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                    <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-indigo-600 font-medium hover:underline"
              >
                Try refreshing the page
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-500">No jobs found at the moment. Check back later!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.jobId} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
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
