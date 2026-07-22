import { ArrowLeft, Sparkles, Star, FileCheck, FileText, Layout, Download } from 'lucide-react'

interface HeroSectionProps {
  onOpenAuth: () => void
}

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
  return (
    <section className="relative flex items-center overflow-hidden pb-0 pt-16">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-primary-50 to-transparent" />
        <div className="absolute top-20 start-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 end-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container-main w-full py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-[#000a1b] border border-primary-200 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span>مُشغَّل بالذكاء الاصطناعي Gemini</span>
            <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">NEW</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight mb-6">
            ابنِ سيرتك الذاتية بتقنية ATS{' '}
            <br />
            <span className="text-primary-600">في دقائق</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            ابنِ سيرتك الذاتية الاحترافية باللغة العربية والإنجليزية. ادفع لكل سيرة ذاتية شاملة باقة الخدمات المتكاملة (ATS + AI) فقط عند تنزيل الملف بصيغة PDF. بدون اشتراكات.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              onClick={onOpenAuth}
              className="btn-primary btn-lg flex items-center gap-2 w-full sm:w-auto shadow-[0_0_20px_rgba(234,88,12,0.4),0_4px_15px_rgba(234,88,12,0.3)] hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5" />
              ابدأ تصميم سيرتك الآن
              <ArrowLeft className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
            </button>
            <a
              href="#templates"
              className="btn-ghost btn-lg w-full sm:w-auto"
            >
              القوالب المتاحة
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-text-muted mb-8">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </span>
              <span>تصميم احترافي</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </span>
              <span>بدون اشتراك</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </span>
              <span>خصوصيتك محفوظة</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>تقييم 4.9/5</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                <div className="w-7 h-7 rounded-full bg-primary-400 border-2 border-white" />
                <div className="w-7 h-7 rounded-full bg-purple-400 border-2 border-white" />
                <div className="w-7 h-7 rounded-full bg-green-400 border-2 border-white" />
                <div className="w-7 h-7 rounded-full bg-orange-400 border-2 border-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-primary-500" />
                <span>+14,000 سيرة ذاتية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div
            className="card-elevated rounded-3xl overflow-hidden border border-border/50"
            style={{ animation: 'float 3s ease-in-out infinite' }}
          >
            {/* Fake Browser Bar */}
            <div className="bg-surface-3 border-b border-border px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4 bg-surface rounded-lg px-3 py-1 text-xs text-text-muted text-center">
                hashresume.com/editor
              </div>
            </div>

            {/* Fake Resume Preview */}
            <div className="bg-surface p-8 grid grid-cols-3 gap-6 min-h-64">
              {/* Left Panel */}
              <div className="col-span-1 bg-primary-600 rounded-2xl p-4 flex flex-col gap-3">
                <div className="h-3 bg-white/40 rounded-full mx-auto" />
                <div className="h-2 bg-white/25 rounded-full" />
                <div className="h-2 bg-white/25 rounded-full" />
                <div className="h-2 bg-white/25 rounded-full w-3/4 mx-auto" />
                <div className="mt-4 space-y-2">
                  <div className="h-2 bg-white/30 rounded-full" />
                  <div className="h-2 bg-white/20 rounded-full" />
                  <div className="h-2 bg-white/20 rounded-full w-2/3" />
                </div>
              </div>
              {/* Right Panel */}
              <div className="col-span-2 flex flex-col gap-4">
                <div className="space-y-2">
                  <div className="h-3 bg-primary-100 rounded-full w-1/3" />
                  <div className="h-2 bg-surface-3 rounded-full" />
                  <div className="h-2 bg-surface-3 rounded-full w-4/5" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-primary-100 rounded-full w-1/4" />
                  <div className="h-2 bg-surface-3 rounded-full" />
                  <div className="h-2 bg-surface-3 rounded-full w-3/4" />
                  <div className="h-2 bg-surface-3 rounded-full w-5/6" />
                </div>
                <div className="flex gap-2 flex-wrap mt-auto">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-6 w-16 bg-primary-50 border border-primary-200 rounded-full" />
                  ))}
                </div>
                {/* ATS Score Badge */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-1.5 rounded-full font-semibold">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ATS Score: 98% Excellent
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3">كيف يعمل؟</h2>
            <p className="text-text-secondary">3 خطوات بسيطة للحصول على سيرة ذاتية احترافية</p>
          </div>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 start-1/6 end-1/6 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: FileText, step: '01', title: 'أدخل بياناتك', desc: 'أضف معلوماتك المهنية بسهولة في النموذج الذكي' },
                { icon: Layout, step: '02', title: 'اختر القالب', desc: 'تصفح العديد من القوالب الاحترافية وجرب التوافق المباشر' },
                { icon: Download, step: '03', title: 'نزّل ملفك', desc: 'ادفع مرة واحدة فقط وحمّل ملف PDF أو Word عالي الجودة' },
              ].map(({ icon: Icon, step, title, desc }) => (
                <div key={step} className="flex flex-col items-center text-center gap-4 relative">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-primary-50 border-2 border-primary-100 flex items-center justify-center shadow-sm">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="absolute -top-3 -end-3 w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                      {step}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-text text-lg mb-1">{title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  )
}