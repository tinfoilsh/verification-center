import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
}

export const TerminalIcon: React.FC<IconProps> = ({ size, className = '' }) => {
  const sizeValue = size ? (typeof size === 'number' ? `${size}px` : size) : undefined;

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        ...(sizeValue && { width: sizeValue, height: sizeValue }),
        backgroundColor: 'currentColor',
        maskImage: 'url(/icons/terminal.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/icons/terminal.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      role="img"
      aria-label="Terminal"
    />
  );
};
