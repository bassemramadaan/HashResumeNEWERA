import React, { useState } from "react";
import { cn } from "../lib/utils";

const FALLBACK_SRC = "/logos/hash-resume-black.png";

interface LogoImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const LogoImage: React.FC<LogoImageProps> = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

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
