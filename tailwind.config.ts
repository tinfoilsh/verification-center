import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-sans, Inter)',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        '4xl': '2rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        brand: {
          dark: 'hsl(var(--color-brand-dark) / <alpha-value>)',
          light: 'hsl(var(--color-brand-light) / <alpha-value>)',
          'accent-dark': 'hsl(var(--color-accent-dark) / <alpha-value>)',
          'accent-dark-darker': 'hsl(var(--color-accent-dark-darker) / <alpha-value>)',
          'accent-light': 'hsl(var(--color-accent-light) / <alpha-value>)',
          'accent-light-darker': 'hsl(var(--color-accent-light-darker) / <alpha-value>)',
        },
        surface: {
          background: 'hsl(var(--surface-background) / <alpha-value>)',
          chat: 'hsl(var(--surface-chat) / <alpha-value>)',
          'chat-background': 'hsl(var(--surface-chat-background) / <alpha-value>)',
          sidebar: 'hsl(var(--surface-sidebar) / <alpha-value>)',
          'sidebar-button': 'hsl(var(--surface-sidebar-button) / <alpha-value>)',
          'sidebar-button-hover': 'hsl(var(--surface-sidebar-button-hover) / <alpha-value>)',
          settings: 'hsl(var(--surface-settings) / <alpha-value>)',
          input: 'hsl(var(--surface-input) / <alpha-value>)',
          thinking: 'hsl(var(--surface-thinking) / <alpha-value>)',
          'message-user': 'hsl(var(--surface-message-user) / <alpha-value>)',
          'message-assistant': 'hsl(var(--surface-message-assistant) / <alpha-value>)',
          card: 'hsl(var(--surface-card) / <alpha-value>)',
        },
        content: {
          primary: 'hsl(var(--content-primary) / <alpha-value>)',
          secondary: 'hsl(var(--content-secondary) / <alpha-value>)',
          muted: 'hsl(var(--content-muted) / <alpha-value>)',
          inverse: 'hsl(var(--content-inverse) / <alpha-value>)',
        },
        gray: {
          50: 'hsl(var(--gray-50) / <alpha-value>)',
          100: 'hsl(var(--gray-100) / <alpha-value>)',
          200: 'hsl(var(--gray-200) / <alpha-value>)',
          300: 'hsl(var(--gray-300) / <alpha-value>)',
          400: 'hsl(var(--gray-400) / <alpha-value>)',
          500: 'hsl(var(--gray-500) / <alpha-value>)',
          600: 'hsl(var(--gray-600) / <alpha-value>)',
          700: 'hsl(var(--gray-700) / <alpha-value>)',
          800: 'hsl(var(--gray-800) / <alpha-value>)',
          900: 'hsl(var(--gray-900) / <alpha-value>)',
          950: 'hsl(var(--gray-950) / <alpha-value>)',
        },
        button: {
          'send-background': 'hsl(var(--button-send-background) / <alpha-value>)',
          'send-foreground': 'hsl(var(--button-send-foreground) / <alpha-value>)',
        },
        'border-subtle': 'hsl(var(--border-subtle) / <alpha-value>)',
        'border-strong': 'hsl(var(--border-strong) / <alpha-value>)',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'move-x': {
          '0%': { transform: 'translateX(var(--move-x-from))' },
          '100%': { transform: 'translateX(var(--move-x-to))' },
        },
      },
      animation: {
        'move-x': 'move-x 1s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
    require('tailwindcss/plugin')(function ({ addUtilities }: any) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      })
    }),
  ],
}

export default config
