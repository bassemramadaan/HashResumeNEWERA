import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { blogPosts } from '../data/blogPosts';
import Navbar from '../components/Navbar';

export default function BlogPage() {
  const { language } = useLanguageStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Navbar />

      {/* Header */}
      <header className="py-20 text-center px-4 mt-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black font-display text-slate-900 dark:text-white mb-6"
        >
          {language === 'ar' ? 'مدونة Hash Resume' : 'Hash Resume Blog'}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
        >
          {language === 'ar' 
            ? 'نصائح وأسرار لكتابة سيرة ذاتية احترافية والحصول على وظيفة أحلامك.' 
            : 'Tips, tricks, and secrets to writing a professional resume and landing your dream job.'}
        </motion.p>
      </header>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800 flex flex-col"
            >
              <Link to={`/blog/${post.id}`} className="block overflow-hidden h-48 relative group">
                <img 
                  src={post.image} 
                  alt={post.title[language]} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {post.readTime[language]}
                  </span>
                </div>
                <Link to={`/blog/${post.id}`} className="block mb-3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
                    {post.title[language]}
                  </h2>
                </Link>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                  {post.excerpt[language]}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                      {post.author[language].charAt(0)}
                    </div>
                    {post.author[language]}
                  </div>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="text-indigo-600 dark:text-indigo-400 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    {language === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                    <ArrowRight size={16} className="rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
