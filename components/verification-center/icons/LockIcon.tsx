import type { IconProps } from './types'

export function LockIcon({
  className,
  style,
  color,
  size = 24,
}: IconProps) {
  const iconColor = color || style?.color || 'currentColor'
  const iconSize = typeof size === 'number' ? `${size}px` : size

  return (
    <svg
      className={className}
      style={{ width: iconSize, height: iconSize, ...style }}
      viewBox="0 0 445 445"
      fill={iconColor}
      stroke={iconColor}
    >
      <rect x="200.19" y="319.69" width="39.96" height="20.29" transform="translate(-109.67 550.01) rotate(-90)"/>
      <rect x="90.98" y="168.77" width="263.03" height="223.33" rx="36.45" ry="36.45" style={{ fill: 'none', strokeMiterlimit: 10, strokeWidth: '20px' }}/>
      <circle cx="220.17" cy="276.89" r="26.91" style={{ fill: 'none', strokeMiterlimit: 10, strokeWidth: '20px' }}/>
      <rect x="101.78" y="108.87" width="78.79" height="20.29" transform="translate(22.15 260.19) rotate(-90)"/>
      <rect x="151.17" y="59.34" width="20.29" height="20.29"/>
      <rect x="171.46" y="39.04" width="102.08" height="20.29"/>
      <rect x="273.25" y="59.34" width="20.29" height="20.29"/>
      <rect x="264.44" y="108.87" width="78.79" height="20.29" transform="translate(184.81 422.85) rotate(-90)"/>
    </svg>
  )
}
