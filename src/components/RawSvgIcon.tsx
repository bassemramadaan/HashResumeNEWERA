import React from "react";

export const RawSvgIcon = ({ fill = "currentColor", className = "" }: { fill?: string; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="330 300 480 310"
    className={className}
    aria-hidden="true"
    id="raw-logo-icon"
  >
    <g fill={fill}>
      {/* New Icon Slashes */}
      <path d="M 437.5 306 L 534.5 306 L 535 308.5 L 436 605 L 337.5 605 L 337 603.5 L 435 309.5 L 437.5 306 Z" />
      <path d="M 584 306 L 682.5 306 L 683 308.5 L 584 605 L 485.5 605 L 485 603.5 L 584 306 Z" />
      <path d="M 728 383 L 802 383.5 L 777 458.5 L 775.5 460 L 759.5 448 L 757.5 448 L 707 483 L 710.5 488 L 756 521.5 L 728 605 L 655.5 605 L 655 602.5 L 728 383 Z" />
    </g>
  </svg>
);
