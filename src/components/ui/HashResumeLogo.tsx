import { LOGO_URL } from '@/constants'
import { LogoImage } from "../LogoImage";

interface HashResumeLogoProps {
  showText?: boolean
  height?: number
  dark?: boolean
  className?: string
  style?: React.CSSProperties
}

export function HashResumeLogo({ 
  showText = true, 
  height = 64, 
  dark = false,
  className,
  style
}: HashResumeLogoProps) {
  const dark292 = dark ? '#FFFFFF' : '#292828'

  return (
    <div 
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: 8, height, ...style }}
    >
      <LogoImage
        src={LOGO_URL}
        alt="Hash Resume"
        className="h-full w-auto"
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
          Hash<span style={{ color: '#001639' }}>Resume</span>
        </span>
      )}
    </div>
  )
}
