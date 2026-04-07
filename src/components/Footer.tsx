import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, AtSign, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import FeedbackModal from "./FeedbackModal";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";

export default function Footer() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 pb-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
            <div className="sm:col-span-2 lg:col-span-4">
              <div className="flex flex-col items-start mb-4">
                <Logo className="w-10 h-10 text-[#ff4d2d] mb-2" />
                <span className="text-2xl font-black text-white font-display">
                  Hash Resume
                </span>
              </div>
              <p className="text-sm max-w-sm mb-4">{t.footerDesc}</p>
              <div className="text-sm text-slate-400 space-y-1">
                <p>
                  <span className="font-semibold text-slate-300">{language === "ar" ? "البريد الإلكتروني:" : "Email:"}</span> support@hashresume.com
                </p>
                <p>
                  <span className="font-semibold text-slate-300">{language === "ar" ? "الهاتف:" : "Phone:"}</span> +20 110 100 7965
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:col-span-2">
              <h4 className="text-white font-semibold mb-4">{language === "ar" ? "عن الشركة" : "About Us"}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                {language === "ar" 
                  ? "نحن فريق شغوف بمساعدة الباحثين عن عمل في الشرق الأوسط وشمال إفريقيا على بناء سير ذاتية احترافية تتوافق مع أنظمة ATS بسهولة وخصوصية تامة."
                  : "We are a passionate team dedicated to helping job seekers in the MENA region build professional, ATS-friendly resumes with ease and complete privacy."}
              </p>
            </div>

            <div className="flex flex-col lg:col-span-2">
              <h4 className="text-white font-semibold mb-4">{t.product}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/templates"
                    className="hover:text-white transition-colors"
                  >
                    {t.resumeBuilder || "Resume Builder"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cover-letter"
                    className="hover:text-white transition-colors"
                  >
                    {t.coverLetter || "Cover Letter"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="hover:text-white transition-colors"
                  >
                    {t.blog || "Blog"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/hash-hunt"
                    className="hover:text-white transition-colors"
                  >
                    {t.hashHuntJobs || "Hash Hunt"}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setShowFeedbackModal(true)}
                    className="hover:text-white transition-colors text-start w-full"
                  >
                    {t.feedback}
                  </button>
                </li>
              </ul>
            </div>

            <div className="flex flex-col lg:col-span-3">
              <h4 className="text-white font-semibold mb-4">
                {language === "ar" ? "الثقة والأمان" : "Trust & Safety"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    {language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-ats-works"
                    className="hover:text-white transition-colors"
                  >
                    {language === "ar" ? "كيف يعمل ATS" : "How ATS Works"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/why-no-signup"
                    className="hover:text-white transition-colors"
                  >
                    {language === "ar"
                      ? "لماذا لا نطلب التسجيل؟"
                      : "Why No Sign-up?"}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col lg:col-span-2">
              <h4 className="text-white font-semibold mb-4">{t.connect}</h4>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/hashsocialmarketing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-[#ff4d2d] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/hashsocialmarketing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-pink-500 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://www.threads.com/@hashsocialmarketing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Threads"
                >
                  <AtSign size={20} />
                </a>
                <a
                  href="https://wa.me/201101007965"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-green-500 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              © {new Date().getFullYear()} {t.rightsReserved}
            </p>
            <div className="flex items-center gap-6">
              <LanguageSwitcher
                size={16}
                variant="ghost"
                className="px-0 py-0"
              />
              <p>{t.privateFooter}</p>
            </div>
          </div>
        </div>
      </footer>
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </>
  );
}
