import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

export const LockIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 445 445"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      stroke="currentColor"
      style={{ display: 'inline-block', aspectRatio: '1' }}
    >
      <defs>
        <filter id="luminosity-noclip" x="192.53" y="278.84" width="49.29" height="49.29" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feFlood floodColor="currentColor" result="bg"/>
          <feBlend in="SourceGraphic" in2="bg"/>
        </filter>
        <mask id="mask" x="192.53" y="278.84" width="49.29" height="49.29" maskUnits="userSpaceOnUse">
          <g style={{ filter: 'url(#luminosity-noclip)' }}>
            <rect x="207.02" y="293.33" width="20.29" height="20.29" transform="translate(-86.31 520.66) rotate(-90)"/>
          </g>
        </mask>
      </defs>
      <rect x="197.19" y="334.69" width="39.96" height="20.29" transform="translate(-127.67 562.01) rotate(-90)"/>
      <path d="M93.13,179.68h252.74c20.12,0,36.45,16.33,36.45,36.45v181.28c0,20.12-16.33,36.45-36.45,36.45H93.13c-20.12,0-36.45-16.33-36.45-36.45v-181.28c0-20.12,16.33-36.45,36.45-36.45Z" fill="none" strokeMiterlimit="10" strokeWidth="20"/>
      <rect x="73.14" y="94.51" width="130.06" height="20.29" transform="translate(33.51 242.83) rotate(-90)"/>
      <rect x="148.17" y="19.34" width="20.29" height="20.29"/>
      <rect x="168.46" y="-.96" width="102.08" height="20.29"/>
      <rect x="270.25" y="19.34" width="20.29" height="20.29"/>
      <rect x="235.8" y="94.51" width="130.06" height="20.29" transform="translate(196.17 405.49) rotate(-90)"/>
      <g style={{ mask: 'url(#mask)' }}>
        <circle cx="217.17" cy="303.48" r="24.64"/>
      </g>
    </svg>
  );
};
