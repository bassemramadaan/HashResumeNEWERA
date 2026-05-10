import React from "react";
import { LOGO_URL } from "../constants";

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
    <img
      src={LOGO_URL}
      alt="Hash Resume Logo"
      style={{ width, height, objectFit: 'contain' }}
      className={className}
      id="app-logo"
    />
  );
};

export default Logo;
