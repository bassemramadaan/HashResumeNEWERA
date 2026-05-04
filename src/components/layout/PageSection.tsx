import { cn } from '@/lib/utils'

interface PageSectionProps {
  children: React.ReactNode
  className?: string
  bg?: 'default' | 'white' | 'muted' | 'dark'
  id?: string
}

export function PageSection({ children, className, bg = 'default', id }: PageSectionProps) {
  const bgClass = {
    default: 'bg-neutral-50',
    white:   'bg-neutral-0',
    muted:   'bg-neutral-100',
    dark:    'bg-neutral-900',
  }[bg]

  return (
    <section id={id} className={cn('page-section', bgClass, className)}>
      <div className="container-page">
        {children}
      </div>
    </section>
  )
}

interface SectionHeadingProps {
  label?: string
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeading({
  label,
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-12', centered && 'text-center', className)}>
      {label && (
        <span className="badge badge-brand mb-3">{label}</span>
      )}
      <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-3 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-neutral-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
