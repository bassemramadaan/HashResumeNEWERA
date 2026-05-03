import { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

type IconSize = 'xs' | 'sm' | 'md' | 'lg'

const sizes: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

interface IconProps {
  icon: LucideIcon
  size?: IconSize
  className?: string
  /** بعض الـ icons لازم تتعكس في RTL (arrows, chevrons) */
  flipInRTL?: boolean
}

export function Icon({ icon: LucideIcon, size = 'md', className, flipInRTL }: IconProps) {
  return (
    <LucideIcon
      className={cn(
        sizes[size],
        flipInRTL && 'rtl:rotate-180',
        className
      )}
    />
  )
}
