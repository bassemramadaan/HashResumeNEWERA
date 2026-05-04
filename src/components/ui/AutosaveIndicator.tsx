import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface AutosaveIndicatorProps {
  state: SaveState
  className?: string
}

export function AutosaveIndicator({ state, className }: AutosaveIndicatorProps) {
  if (state === 'idle') return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn('flex items-center gap-1.5 text-xs', className)}
      >
        {state === 'saving' && (
          <>
            <Loader2 className="w-3 h-3 text-neutral-400 animate-spin" />
            <span className="text-neutral-400">جاري الحفظ...</span>
          </>
        )}
        {state === 'saved' && (
          <>
            <CheckCircle className="w-3 h-3" style={{ color: 'var(--color-success)' }} />
            <span className="text-neutral-400">تم الحفظ تلقائيًا</span>
          </>
        )}
        {state === 'error' && (
          <>
            <AlertCircle className="w-3 h-3" style={{ color: 'var(--color-danger)' }} />
            <span style={{ color: 'var(--color-danger)' }}>فشل الحفظ — تحقق من الاتصال</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
