import React from "react";
import { UserCheck, Cloud, Shield, Laptop } from "lucide-react";
import Navbar from "../components/Navbar";
import { useLanguageStore } from "../store/useLanguageStore";

export default function WhyNoSignupPage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 font-sans"
      dir={isAr ? "rtl" : "ltr"}
    >
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCheck className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-display mb-6">
            {isAr
              ? "لماذا نستخدم تسجيل الدخول؟"
              : "Why Do We Use Sign-In?"}
          </h1>
          <p className="text-xl text-slate-600">
            {isAr
              ? "نحن نستخدم تسجيل الدخول عبر جوجل لضمان أفضل تجربة ممكنة لك. إليك الأسباب."
              : "We use Google Sign-In to ensure the best possible experience for you. Here is why."}
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-emerald-100 rounded-xl text-emerald-600">
                <Cloud size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {isAr ? "المزامنة السحابية" : "Cloud Sync"}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {isAr
                    ? "عند تسجيل الدخول، يتم حفظ سيرتك الذاتية تلقائياً في السحابة. هذا يعني أنك لن تفقد بياناتك أبداً حتى لو قمت بمسح بيانات المتصفح."
                    : "When you sign in, your resume is automatically saved in the cloud. This means you will never lose your data even if you clear your browser data."}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                <Laptop size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {isAr ? "الوصول من أي جهاز" : "Access from Any Device"}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {isAr
                    ? "يمكنك البدء في كتابة سيرتك الذاتية على الكمبيوتر وإكمالها لاحقاً من هاتفك المحمول بمجرد تسجيل الدخول بنفس الحساب."
                    : "You can start writing your resume on your computer and finish it later from your mobile phone just by signing in with the same account."}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-amber-100 rounded-xl text-amber-600">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {isAr ? "الأمان والخصوصية" : "Security and Privacy"}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {isAr
                    ? "نحن نستخدم تسجيل دخول جوجل الآمن. بياناتك مشفرة ومحمية، ولا يمكن لأحد غيرك الوصول إليها."
                    : "We use secure Google Sign-In. Your data is encrypted and protected, and no one but you can access it."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
