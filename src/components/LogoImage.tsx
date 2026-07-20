import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";

interface LogoImageProps {
  src: string;
  alt: string;
  className?: string;
}

const FALLBACK_SRC = "https://i.ibb.co/qFFjyH8V/IN-LOGO-icon-3.png";

export const LogoImage: React.FC<LogoImageProps> = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

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
