import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const SIZE_MAP: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
}

interface IconProps {
  icon: LucideIcon
  size?: IconSize
  className?: string
  flipInRTL?: boolean
  strokeWidth?: number
}

export function Icon({
  icon: LucideComponent,
  size = 'md',
  className,
  flipInRTL = false,
  strokeWidth = 1.75,
}: IconProps) {
  return (
    <LucideComponent
      strokeWidth={strokeWidth}
      className={cn(
        SIZE_MAP[size],
        flipInRTL && 'rtl:rotate-180 transition-transform',
        className
      )}
    />
  )
}
