import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { blogPosts } from '../data/blogPosts';
import Navbar from '../components/Navbar';

export default function BlogPostPage() {
  const { id } = useParams();
  const { language } = useLanguageStore();
  
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 mt-32">
        {/* Header */}
        <header className="py-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6"
          >
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {post.date}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {post.readTime[language]}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black font-display text-slate-900 dark:text-white mb-8 leading-tight"
          >
            {post.title[language]}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-12"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold">
              {post.author[language].charAt(0)}
            </div>
            <div className="text-left rtl:text-right">
              <p className="font-bold text-slate-900 dark:text-white">{post.author[language]}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'ar' ? 'محرر' : 'Editor'}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl overflow-hidden shadow-lg mb-12"
          >
            <img 
              src={post.image} 
              alt={post.title[language]} 
              className="w-full h-[400px] object-cover"
            />
          </motion.div>
        </header>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg prose-indigo dark:prose-invert max-w-none prose-headings:font-display prose-img:rounded-xl prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:text-indigo-700 dark:hover:prose-a:text-indigo-300"
        >
          <ReactMarkdown>
            {post.content[language]}
          </ReactMarkdown>
        </motion.div>

        {/* Share */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-bold text-slate-900 dark:text-white">
            {language === 'ar' ? 'شارك هذا المقال:' : 'Share this article:'}
          </p>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Facebook size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Twitter size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Linkedin size={20} />
            </button>
            <button 
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
