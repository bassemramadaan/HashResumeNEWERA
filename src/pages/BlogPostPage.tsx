import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";
import {
  Calendar,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { blogPosts } from "../data/blogPosts";
import { Navbar } from "@/components/layout/Navbar";

export default function BlogPostPage() {
  const { id } = useParams();
  const { language } = useLanguageStore();

  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const shareUrl = window.location.href;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title[language],
    "image": post.image,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author[language]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-300">
      <Helmet>
        <title>{post.title[language]} | Hash Resume</title>
        <meta name="description" content={post.excerpt[language]} />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 mt-32">
        {/* Header */}
        <header className="py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 text-sm text-white0 mb-6"
          >
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {post.date}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {post.readTime[language]}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black font-display text-slate-900 mb-8 leading-tight"
          >
            {post.title[language]}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {post.author[language].charAt(0)}
            </div>
            <div className="text-start rtl:text-end">
              <p className="font-bold text-slate-900">
                {post.author[language]}
              </p>
              <p className="text-xs text-slate-500">
                {language === "ar" ? "محرر" : "Editor"}
              </p>
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
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg prose-indigo max-w-none prose-headings:font-display prose-img:rounded-xl prose-a:text-indigo-600 hover:prose-a:text-indigo-700 mt-8"
        >
          <ReactMarkdown>{post.content[language]}</ReactMarkdown>
        </motion.div>

        {/* Call to Action Editor */}
        <div className="my-16 bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 p-8 md:p-12 rounded-3xl flex flex-col items-center text-center shadow-sm">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 font-display">
            {language === "ar" ? "جاهز لإنشاء سيرتك الذاتية؟" : "Ready to build your resume?"}
          </h3>
          <p className="text-slate-600 mb-8 max-w-xl text-lg">
            {language === "ar" 
              ? "استخدم الذكاء الاصطناعي لإنشاء سيرة ذاتية متوافقة مع أنظمة التتبع (ATS) في دقائق قليلة." 
              : "Use AI to create an ATS-friendly resume in just a few minutes."}
          </p>
          <Link 
            to="/editor" 
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-lg shadow-indigo-600/20"
          >
            {language === "ar" ? "ابدأ الآن" : "Start now"}
          </Link>
        </div>

        {/* Share */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-bold text-slate-900">
            {language === "ar" ? "شارك هذا المقال:" : "Share this article:"}
          </p>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <Facebook size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <Twitter size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <Linkedin size={20} />
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
