import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

export const GpuIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => {
  const sizeValue = typeof size === 'number' ? size : 28;
  const width = typeof size === 'number' ? `${size * 1.94}px` : size;
  const height = typeof size === 'number' ? `${size}px` : size;

  return (
    <img
      src="/icons/gpu.svg"
      alt="GPU"
      width={width}
      height={height}
      className={className}
      style={{ display: 'inline-block', aspectRatio: '1', color: 'inherit' }}
    />
  );
};
