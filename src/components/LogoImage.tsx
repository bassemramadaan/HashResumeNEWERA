import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";

interface LogoImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const LogoImage: React.FC<LogoImageProps> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src) {
    return <span className="font-extrabold tracking-tight text-slate-950">Hash Resume</span>;
  }

  if (error) {
    return (
      <span className="font-black tracking-tight text-slate-950 text-xl font-sans whitespace-nowrap">
        Hash Resume
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-contain", className)}
      onError={() => {
        console.warn(`Failed to load logo image: ${src}`);
        setError(true);
      }}
      referrerPolicy="no-referrer"
    />
  );
};
