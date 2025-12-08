# Tinfoil Icons

React icon components for the Tinfoil Verification Center. These components are designed to be portable and work as drop-in replacements for `react-icons`.

## Usage

```tsx
import { LockIcon, ShieldIcon } from './icons'

// Basic usage (uses currentColor)
<LockIcon size={24} />

// With custom color
<LockIcon color="#10b981" size={32} />

// With style object
<LockIcon style={{ color: 'red' }} size={24} />

// With className (for Tailwind, etc.)
<LockIcon className="text-blue-500" size={24} />
```

## API

All icons accept the following props:

```tsx
interface IconProps {
  className?: string
  style?: CSSProperties
  color?: string
  size?: number | string  // Default: 24
}
```

## Available Icons

- `LockIcon` - Lock icon (from `/public/icons/lock.svg`)
- `ShieldIcon` - Shield with checkmark (from `/public/icons/shield-check.svg`)

## Adding New Icons

1. Find the SVG file in `/public/icons/`
2. Create a new component file (e.g., `MyIcon.tsx`)
3. Follow the template:

```tsx
import type { IconProps } from './types'

export function MyIcon({
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
      viewBox="0 0 24 24"  // Adjust to match your SVG
      fill={iconColor}
    >
      {/* SVG paths here */}
    </svg>
  )
}
```

4. Export it from `index.ts`:

```ts
export { MyIcon } from './MyIcon'
```

## Porting to Other Projects

This icons folder is self-contained and can be copied to other projects:

1. Copy the entire `icons/` folder
2. Update import paths if needed
3. All dependencies are standard React types

No external dependencies required!
