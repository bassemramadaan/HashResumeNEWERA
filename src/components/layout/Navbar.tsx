import { useState, useEffect } from 'react'
import { Menu, X, FileText, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface NavbarProps {
  onOpenAuth: () => void
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  const { user, signOut } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-surface/90 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 font-bold text-xl text-text">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span>
              Hash<span className="text-primary-600">Resume</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <a href="#features" className="px-4 py-2 text-sm text-text-secondary hover:text-text rounded-lg hover:bg-surface-3 transition-colors">
              المميزات
            </a>
            <a href="#templates" className="px-4 py-2 text-sm text-text-secondary hover:text-text rounded-lg hover:bg-surface-3 transition-colors">
              القوالب
            </a>
            <a href="#pricing" className="px-4 py-2 text-sm text-text-secondary hover:text-text rounded-lg hover:bg-surface-3 transition-colors">
              الأسعار
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <a href="/editor" className="btn-primary btn-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  لوحة التحكم
                </a>
                <button onClick={signOut} className="btn-ghost btn-sm">
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <button onClick={onOpenAuth} className="btn-ghost btn-sm">
                  تسجيل الدخول
                </button>
                <button onClick={onOpenAuth} className="btn-primary btn-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  ابدأ مجاناً
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-3 transition-colors"
            aria-label="القائمة"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border px-4 py-4 flex flex-col gap-2">
          <a href="#features" className="px-4 py-3 text-sm text-text-secondary hover:text-text rounded-xl hover:bg-surface-3 transition-colors">
            المميزات
          </a>
          <a href="#templates" className="px-4 py-3 text-sm text-text-secondary hover:text-text rounded-xl hover:bg-surface-3 transition-colors">
            القوالب
          </a>
          <a href="#pricing" className="px-4 py-3 text-sm text-text-secondary hover:text-text rounded-xl hover:bg-surface-3 transition-colors">
            الأسعار
          </a>
          <hr className="border-border my-1" />
          {user ? (
            <>
              <a href="/editor" className="btn-primary text-center">لوحة التحكم</a>
              <button onClick={signOut} className="btn-ghost">تسجيل الخروج</button>
            </>
          ) : (
            <>
              <button onClick={onOpenAuth} className="btn-ghost">تسجيل الدخول</button>
              <button onClick={onOpenAuth} className="btn-primary">ابدأ مجاناً</button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
