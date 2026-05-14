import { Link } from "react-router-dom";
import { useLanguageStore } from "../store/useLanguageStore";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

export default function NotFoundPage() {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-md mx-auto flex flex-col items-center">
        <h1 className="text-9xl font-black text-brand-500 mb-4 tracking-tighter">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          {isAr ? "عذراً، الصفحة غير موجودة!" : "Oops! Page not found"}
        </h2>
        
        <p className="text-slate-600 mb-8 text-lg">
          {isAr 
            ? "يبدو أنك وصلت إلى رابط غير صحيح أو تم نقل هذه الصفحة لمكان آخر."
            : "It seems you've followed a broken link or entered a URL that doesn't exist on this site."}
        </p>

        <Link 
          to="/" 
          className="btn-primary inline-flex items-center gap-2 group px-8 py-3"
        >
          <Home className="w-5 h-5" />
          {isAr ? "العودة للرئيسية" : "Back to Home"}
          {isAr ? (
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          ) : (
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          )}
        </Link>
      </div>
    </div>
  );
}
