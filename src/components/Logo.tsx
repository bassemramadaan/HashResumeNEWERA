import React from "react";

interface LogoProps {
  width?: number | string;
  height?: number | string;
  variant?: "gradient" | "solid" | "white";
  className?: string;
  iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  width = "100%",
  height = "100%",
  variant = "gradient",
  className = "",
  iconOnly = false,
}) => {
  const iconColor =
    variant === "white"
      ? "#ffffff"
      : variant === "solid"
      ? "#FF4D1C"
      : "url(#iconGrad)";

  const textColor =
    variant === "white"
      ? "#ffffff"
      : variant === "solid"
      ? "#FF4D1C"
      : "url(#textGrad)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconOnly ? "80 60 108 140" : "0 0 400 300"}
      width={width}
      height={height}
      className={className}
      aria-label="Hash Resume Logo"
      role="img"
    >
      <defs>
        <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8C00" stopOpacity="1" />
          <stop offset="100%" stopColor="#FF2D00" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF2D00" stopOpacity="1" />
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* الشريط الأول */}
      <polygon points="80,200 105,60 130,60 105,200" fill={iconColor} />
      {/* الشريط الثاني */}
      <polygon points="115,200 140,60 162,60 137,200" fill={iconColor} />
      {/* الشريط الثالث (المعدل ليتوافق مع الصورة) */}
      <path d="M 170 100 L 188 100 L 168 200 L 150 200 L 158.4 158 L 172 150 L 161 145 Z" fill={iconColor} />

      {/* النص */}
      {!iconOnly && (
        <text
          x="200"
          y="175"
          fontFamily="Inter, Plus Jakarta Sans, sans-serif"
          fontSize="52"
          fontWeight="bold"
          fill={textColor}
          textAnchor="middle"
          letterSpacing="-1"
        >
          Hash Resume
        </text>
      )}
    </svg>
  );
};

export default Logo;
