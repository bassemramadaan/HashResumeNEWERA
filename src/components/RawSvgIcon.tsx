import React from "react";

export const RawSvgIcon = ({ fill = "currentColor", className = "" }: { fill?: string; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="80 60 108 140"
    className={className}
    aria-hidden="true"
  >
    <polygon points="80,200 105,60 130,60 105,200" fill={fill} />
    <polygon points="115,200 140,60 162,60 137,200" fill={fill} />
    <path d="M 170 100 L 188 100 L 168 200 L 150 200 L 158.4 158 L 172 150 L 161 145 Z" fill={fill} />
  </svg>
);