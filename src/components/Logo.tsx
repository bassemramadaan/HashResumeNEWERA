import React from "react";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 810 809.999993"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <clipPath id="4f3c6b0056">
            <path
              d="M 174 157 L 639 157 L 639 582 L 174 582 Z M 174 157 "
              clipRule="nonzero"
            />
          </clipPath>
          <clipPath id="b1944c20e2">
            <path
              d="M 421.1875 157.480469 L 651 559.996094 L 282.355469 770.472656 L 52.542969 367.957031 Z M 421.1875 157.480469 "
              clipRule="nonzero"
            />
          </clipPath>
          <clipPath id="2f489adca9">
            <path
              d="M 421.1875 157.480469 L 651 559.996094 L 282.355469 770.472656 L 52.542969 367.957031 Z M 421.1875 157.480469 "
              clipRule="nonzero"
            />
          </clipPath>
        </defs>
        <rect x="-81" width="972" fill="#ffffff" y="-80.999999" height="971.999992" fillOpacity="1" />
        <rect x="-81" width="972" fill="#ff4d2d" y="-80.999999" height="971.999992" fillOpacity="1" />
        <g clipPath="url(#4f3c6b0056)">
          <g clipPath="url(#b1944c20e2)">
            <g clipPath="url(#2f489adca9)">
              <path
                fill="#fdfcf8"
                d="M 321.152344 581.359375 L 272.148438 581.140625 L 346.265625 454.195312 L 321.964844 411.632812 L 223.136719 580.90625 L 174.125 580.671875 L 421.1875 157.480469 L 445.472656 200.050781 L 346.652344 369.300781 L 370.953125 411.859375 L 469.777344 242.585938 L 494.0625 285.15625 Z M 369.261719 580.082031 L 517.480469 326.171875 L 638.976562 538.9375 L 638.9375 538.9375 L 638.945312 538.953125 L 614.265625 581.261719 L 565.238281 581.039062 L 565.246094 581.015625 L 542.46875 541.121094 L 516.246094 580.769531 L 516.257812 580.785156 L 516.242188 580.796875 L 467.269531 580.558594 L 491.964844 538.242188 L 467.664062 495.679688 L 418.257812 580.324219 L 418.265625 580.339844 L 418.25 580.347656 Z M 492.378906 453.351562 L 540.945312 538.453125 L 589.941406 538.695312 L 589.957031 538.6875 L 589.949219 538.671875 L 517.066406 411.019531 Z M 492.378906 453.351562 "
                fillOpacity="1"
                fillRule="nonzero"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
