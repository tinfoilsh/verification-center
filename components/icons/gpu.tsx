import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

export const GpuIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => {
  const width = typeof size === 'number' ? `${size * 1.94}px` : size;
  const height = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        width: width,
        height: height,
        backgroundColor: 'currentColor',
        maskImage: 'url(/icons/gpu.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/icons/gpu.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      role="img"
      aria-label="GPU"
    />
  );
};
