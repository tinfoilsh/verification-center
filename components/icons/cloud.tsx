import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

export const CloudIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => {
  const sizeValue = typeof size === 'number' ? `${size * 1.15}px` : size;

  return (
    <img
      src="/icons/cloud.svg"
      alt="Cloud"
      width={sizeValue}
      height={sizeValue}
      className={className}
      style={{ display: 'inline-block', aspectRatio: '1', color: 'inherit' }}
    />
  );
};
