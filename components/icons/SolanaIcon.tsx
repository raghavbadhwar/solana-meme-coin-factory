
import React from 'react';

export const SolanaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    fill="none"
    {...props}
  >
    <g clipPath="url(#clip0_320_5803)">
      <path
        fill="url(#paint0_linear_320_5803)"
        d="M1024 341.333H682.667L853.333 170.667H170.667L0 341.333H341.333L170.667 512H853.333L1024 341.333Z"
      />
      <path
        fill="url(#paint1_linear_320_5803)"
        d="M0 682.667H341.333L170.667 853.333H853.333L1024 682.667H682.667L853.333 512H170.667L0 682.667Z"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_320_5803"
        x1="0"
        x2="1024"
        y1="341.333"
        y2="341.333"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9945FF" />
        <stop offset="1" stopColor="#14F195" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_320_5803"
        x1="0"
        x2="1024"
        y1="682.667"
        y2="682.667"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9945FF" />
        <stop offset="1" stopColor="#14F195" />
      </linearGradient>
      <clipPath id="clip0_320_5803">
        <path fill="#fff" d="M0 0H1024V1024H0z" />
      </clipPath>
    </defs>
  </svg>
);
