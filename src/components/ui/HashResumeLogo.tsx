import React from 'react';

interface HashResumeLogoProps {
  showText?: boolean;
  height?: number;
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function HashResumeLogo({
  showText = true,
  height = 80,
  dark = false,
  className,
  style
}: HashResumeLogoProps) {
  const textColor = dark ? '#FFFFFF' : '#0f172a';
  const hashColor = dark ? '#FF6B6B' : '#e11d48';
  
  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: 8, height, ...style }}
    >
      <svg
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: '100%', width: 'auto' }}
        fill="none"
      >
        <rect width="36" height="36" rx="8" fill={hashColor} />
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
          fontSize="20"
          fontWeight="800"
          fill="white"
        >
          H
        </text>
      </svg>
      {showText && (
        <span style={{
          fontWeight: 700,
          fontSize: height * 0.35,
          color: textColor,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          Hash<span style={{ color: hashColor }}>Resume</span>
        </span>
      )}
    </div>
  );
}
