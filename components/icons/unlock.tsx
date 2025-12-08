import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

export const UnlockIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => {
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
        <filter id="luminosity-noclip-unlock" x="163.23" y="278.73" width="49.29" height="49.29" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feFlood floodColor="currentColor" result="bg"/>
          <feBlend in="SourceGraphic" in2="bg"/>
        </filter>
        <mask id="mask-unlock" x="163.23" y="278.73" width="49.29" height="49.29" maskUnits="userSpaceOnUse">
          <g style={{ filter: 'url(#luminosity-noclip-unlock)' }}>
            <rect x="177.73" y="293.23" width="20.29" height="20.29" transform="translate(-115.5 491.26) rotate(-90)"/>
          </g>
        </mask>
      </defs>
      <rect x="281" y="21.04" width="20.29" height="20.29"/>
      <rect x="301.29" y=".75" width="102.08" height="20.29"/>
      <rect x="403.37" y="21.04" width="20.29" height="20.29"/>
      <rect x="167.89" y="334.72" width="39.96" height="20.29" transform="translate(-156.99 532.74) rotate(-90)"/>
      <path d="M63.83,179.71h252.74c20.12,0,36.45,16.33,36.45,36.45v181.28c0,20.12-16.33,36.45-36.45,36.45H63.83c-20.12,0-36.45-16.33-36.45-36.45v-181.28c0-20.12,16.33-36.45,36.45-36.45Z" fill="none" strokeMiterlimit="10" strokeWidth="20"/>
      <rect x="205.97" y="96.22" width="130.06" height="20.29" transform="translate(164.63 377.36) rotate(-90)"/>
      <rect x="368.63" y="96.22" width="130.06" height="20.29" transform="translate(327.29 540.03) rotate(-90)"/>
      <g style={{ mask: 'url(#mask-unlock)' }}>
        <circle cx="187.87" cy="303.38" r="24.64"/>
      </g>
    </svg>
  );
};
