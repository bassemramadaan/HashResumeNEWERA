import React from 'react';
import { cn } from '../lib/utils';

interface HashResumeLogoProps {
  className?: string;
  variant?: 'black' | 'white';
}

export const HashResumeLogo: React.FC<HashResumeLogoProps> = ({ className, variant = 'black' }) => {
  const color = variant === 'white' ? '#ffffff' : '#0f172a';
  
  return (
    <svg
      viewBox="0 0 180 36"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-9 w-auto', className)}
      fill={color}
    >
      <text
        x="0"
        y="27"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="24"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        #HashResume
      </text>
    </svg>
  );
};

export default HashResumeLogo;
