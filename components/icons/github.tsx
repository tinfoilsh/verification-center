import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

export const GithubIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        width: sizeValue,
        height: sizeValue,
        backgroundColor: 'currentColor',
        maskImage: 'url(/icons/github.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/icons/github.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      role="img"
      aria-label="GitHub"
    />
  );
};
