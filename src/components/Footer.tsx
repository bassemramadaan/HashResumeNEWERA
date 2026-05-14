import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, MessageCircle, Linkedin, Twitter } from "lucide-react";
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
      <footer className="bg-zinc-900 text-slate-500 py-10 border-t border-zinc-800 pb-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
            <div className="sm:col-span-2 lg:col-span-4">
              <div className="flex flex-col items-start mb-4">
                <Link to="/" className="inline-block transform origin-left rtl:origin-right hover:scale-105 transition-transform mb-2">
                  <img src="https://i.ibb.co/tPN2Wtwd/IN-LOGO-icon-with-tag-3.png" alt="Hash Resume" className="h-[46px] md:h-[58px] w-auto object-contain pointer-events-none" />
                </Link>
              </div>
              <p className="text-sm max-w-sm mb-4">{t.footerDesc}</p>
              <div className="text-sm text-slate-500 space-y-1">
                <p>
                  <span className="font-semibold text-slate-400">{t.emailLabel}</span> support@hashresume.com
                </p>
                <p>
                  <span className="font-semibold text-slate-300">{t.phoneLabel}</span> +20 110 100 7965
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:col-span-2">
              <h4 className="text-white font-semibold mb-4">{t.aboutUs}</h4>
              <p dir="auto" className="text-sm text-slate-400 leading-relaxed">
                {t.aboutUsDesc}
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
                    onClick={(e) => {
                      e.preventDefault();
                      setShowFeedbackModal(true);
                    }}
                    className="hover:text-white transition-colors text-start w-full"
                  >
                    {t.feedback}
                  </button>
                </li>
              </ul>
            </div>

            <div className="flex flex-col lg:col-span-3">
              <h4 className="text-white font-semibold mb-4">
                {t.trustAndSafety}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/trust"
                    className="hover:text-white transition-colors"
                  >
                    {t.trustAndTransparency}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    {t.privacyPolicy}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-white transition-colors"
                  >
                    {t.termsOfService}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-ats-works"
                    className="hover:text-white transition-colors"
                  >
                    {t.howAtsWorks}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="hover:text-white transition-colors"
                  >
                    {t.faq}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col lg:col-span-2">
              <h4 className="text-white font-semibold mb-4">{t.connect}</h4>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.linkedin.com/company/hashresume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-[#0077b5] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://twitter.com/hashresume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-[#1DA1F2] transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://www.facebook.com/hashsocialmarketing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-[#1877F2] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/hashsocialmarketing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-[#E4405F] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://wa.me/201101007965"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-[#25D366] transition-colors relative group"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={20} />
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-zinc-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
                    {t.whatsappTooltip}
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <p>
                © {new Date().getFullYear()} {t.rightsReserved}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <LanguageSwitcher
                  size={16}
                  variant="ghost"
                  className="px-0 py-0"
                />
              </div>
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
