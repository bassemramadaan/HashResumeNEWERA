import React, { useState } from "react";
import { cn } from "../lib/utils";

interface LogoImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const LogoImage: React.FC<LogoImageProps> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-contain", className)}
      onError={() => setError(true)}
    />
  );
};
