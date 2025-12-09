import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

export const ServerIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        width: sizeValue,
        height: sizeValue,
        backgroundColor: 'currentColor',
        maskImage: 'url(/icons/server.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/icons/server.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      role="img"
      aria-label="Server"
    />
  );
};
