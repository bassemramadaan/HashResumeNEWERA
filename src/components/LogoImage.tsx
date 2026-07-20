import React, { useState } from "react";
import { cn } from "../lib/utils";

interface LogoImageProps {
  src: string;
  alt: string;
  className?: string;
}

const FALLBACK_SRC = "/logos/hashresume-icon.svg";

export const LogoImage: React.FC<LogoImageProps> = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  if (!src) {
    return null;
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn("object-contain", className)}
      onError={() => {
        if (imgSrc !== FALLBACK_SRC) {
          setImgSrc(FALLBACK_SRC);
        }
      }}
    />
  );
};
