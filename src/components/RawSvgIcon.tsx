import React from "react";

export const RawSvgIcon = ({ fill = "currentColor", className = "" }: { fill?: string; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="110 210 760 500"
    className={className}
    aria-hidden="true"
    id="raw-logo-icon"
  >
    <g fill={fill}>
      {/* New Icon Slashes */}
      <path d="M 274.5 222 L 432.5 222 L 433 223.5 L 275 697.5 L 273.5 699 L 115.5 699 L 115 697.5 L 273 223.5 L 274.5 222 Z" />
      <path d="M 510 222 L 668.5 222 L 669 224.5 L 511 699 L 352.5 699 L 352 696.5 L 510 222 Z" />
      <path d="M 741.5 345 L 858.5 345 L 859 346.5 L 818 469 L 788.5 448 L 707 506.5 L 786 565.5 L 742 697.5 L 740.5 699 L 623.5 699 L 623 697.5 L 740 346.5 L 741.5 345 Z" />
    </g>
  </svg>
);
