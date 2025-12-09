import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

export const KeyIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        width: sizeValue,
        height: sizeValue,
        backgroundColor: 'currentColor',
        maskImage: 'url(/icons/key.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/icons/key.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      role="img"
      aria-label="Key"
    />
  );
};
