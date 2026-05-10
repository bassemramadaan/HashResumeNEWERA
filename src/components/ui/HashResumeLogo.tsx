interface HashResumeLogoProps {
  showText?: boolean
  height?: number
  dark?: boolean
}

export function HashResumeLogo({ showText = true, height = 36, dark = false }: HashResumeLogoProps) {
  const dark292 = dark ? '#FFFFFF' : '#292828'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg
        height={height}
        viewBox="0 0 150 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="skewX(-8)">
          <rect x="2" y="5" width="22" height="110" rx="2" fill={dark292}/>
          <rect x="2" y="50" width="56" height="20" rx="2" fill={dark292}/>
          <rect x="36" y="5" width="22" height="110" rx="2" fill={dark292}/>
          <rect x="68" y="5" width="22" height="110" rx="2" fill={dark292}/>
          <rect x="90" y="5" width="22" height="50" rx="2" fill={dark292}/>
          <path d="M90 55 L112 55 Q135 55 135 30 Q135 5 112 5 L90 5 Z" fill={dark292}/>
          <path d="M100 55 L125 115 L103 115 L80 55 Z" fill={dark292}/>
        </g>
        <path d="M 118 5 Q 150 5 150 37 Q 150 5 118 5 Z" fill="#FF4D2D"/>
        <path d="M 118 5 L 150 5 L 150 37 Q 138 20 118 5 Z" fill="#FF4D2D"/>
      </svg>

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
