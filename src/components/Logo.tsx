import React from "react";
import { HERO_LOGO_URL } from "../constants";
import { cn } from "../lib/utils";

interface LogoProps {
  width?: number | string;
  height?: number | string;
  variant?: "gradient" | "solid" | "white";
  className?: string;
  iconOnly?: boolean;
  loading?: "lazy" | "eager";
}

const Logo: React.FC<LogoProps> = ({
  width = "100%",
  height = "100%",
  className = "",
  loading = "lazy",
}) => {
  return (
    <img
      src={HERO_LOGO_URL}
      alt="Hash Resume Logo"
      style={{ width: width !== "100%" ? width : undefined, height: height !== "100%" ? height : undefined, objectFit: 'contain' }}
      className={cn("max-w-none", className)}
      id="app-logo"
      loading={loading}
      referrerPolicy="no-referrer"
    />
  );
};

export default Logo;
