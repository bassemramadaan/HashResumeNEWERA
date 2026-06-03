import { AnimatePresence, motion } from "motion/react"
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguageStore } from "../../store/useLanguageStore"

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface AutosaveIndicatorProps {
  state: SaveState
  className?: string
}

const T_SAVING = {
  ar: "جاري الحفظ...",
  en: "Saving...",
  fr: "Enregistrement..."
};

const T_SAVED = {
  ar: "تم الحفظ تلقائيًا",
  en: "Autosaved to Cloud",
  fr: "Enregistré automatiquement"
};

const T_ERROR = {
  ar: "فشل الحفظ — تحقق من الاتصال",
  en: "Save failed — check connection",
  fr: "Échec — vérifiez la connexion"
};

export function AutosaveIndicator({ state, className }: AutosaveIndicatorProps) {
  const { language } = useLanguageStore();
  const lang = language === "ar" ? "ar" : language === "fr" ? "fr" : "en";

  if (state === 'idle') return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn('flex items-center gap-1.5 text-[11px] font-semibold', className)}
      >
        {state === 'saving' && (
          <>
            <Loader2 className="w-3 h-3 text-neutral-400 animate-spin" />
            <span className="text-neutral-400">{T_SAVING[lang]}</span>
          </>
        )}
        {state === 'saved' && (
          <>
            <CheckCircle className="w-3 h-3" style={{ color: 'var(--color-success)' }} />
            <span className="text-neutral-400">{T_SAVED[lang]}</span>
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="w-3 h-3" style={{ color: 'var(--color-danger)' }} />
            <span style={{ color: 'var(--color-danger)' }}>{T_ERROR[lang]}</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
