import { ArrowLeft, Sparkles, Star, Users, FileCheck } from 'lucide-react'

interface HeroSectionProps {
  onOpenAuth: () => void
}

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">

      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-primary-50 to-transparent" />
        <div className="absolute top-20 start-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 end-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container-main w-full py-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>مدعوم بالذكاء الاصطناعي</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight mb-6">
            أنشئ سيرتك الذاتية
            <br />
            <span className="text-primary-600">في دقائق</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            منصة ذكية لإنشاء سير ذاتية احترافية باللغة العربية والإنجليزية.
            قوالب أنيقة، تصميم متجاوب، وتحميل فوري بصيغة PDF.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onOpenAuth}
              className="btn-primary btn-lg flex items-center gap-2 w-full sm:w-auto"
            >
              <Sparkles className="w-5 h-5" />
              ابدأ مجاناً الآن
              <ArrowLeft className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
            </button>
            <a
              href="#templates"
              className="btn-ghost btn-lg w-full sm:w-auto"
            >
              شاهد القوالب
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>تقييم 4.9/5</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              <span>+5,000 مستخدم</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary-500" />
              <span>+12,000 سيرة ذاتية</span>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="card-elevated rounded-3xl overflow-hidden border border-border/50">
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
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto" />
                <div className="h-3 bg-white/40 rounded-full" />
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
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
