import React from "react";
import { LOGO_URL } from "../constants";

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
      src={LOGO_URL}
      alt="Hash Resume Logo"
      style={{ width, height, objectFit: 'contain' }}
      className={className}
      id="app-logo"
      loading={loading}
      referrerPolicy="no-referrer"
    />
  );
};

export default Logo;
