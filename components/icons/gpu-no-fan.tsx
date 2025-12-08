import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const GpuNoFanIcon: React.FC<IconProps> = ({ size = 28, className = '', style }) => {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  return (
    <img
      src="/icons/gpu-no-fan.svg"
      alt="GPU (No Fan)"
      width={sizeValue}
      height={sizeValue}
      className={className}
      style={{ display: 'inline-block', ...style }}
    />
  );
};
