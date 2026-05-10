import { LOGO_URL } from '@/constants'

interface HashResumeLogoProps {
  showText?: boolean
  height?: number
  dark?: boolean
  className?: string
  style?: React.CSSProperties
}

export function HashResumeLogo({ 
  showText = true, 
  height = 36, 
  dark = false,
  className,
  style
}: HashResumeLogoProps) {
  const dark292 = dark ? '#FFFFFF' : '#292828'

  return (
    <div 
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}
    >
      <img
        src={LOGO_URL}
        alt="Hash Resume"
        style={{ height, width: 'auto' }}
      />

      {showText && (
        <span style={{
          fontWeight: 700,
          fontSize: height * 0.5,
          color: dark292,
          letterSpacing: '-0.02em',
          fontFamily: 'Plus Jakarta Sans, Cairo, sans-serif',
          lineHeight: 1,
        }}>
          Hash<span style={{ color: '#FF4D2D' }}>Resume</span>
        </span>
      )}
    </div>
  )
}
