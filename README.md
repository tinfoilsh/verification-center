# Tinfoil Verification Center

Next.js application for the Tinfoil verification center, providing an iframe-embeddable verification UI.

## Project Structure

```text
tinfoil-verification-center/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Main iframe page
│   ├── dev/                      # Development playground
│   │   ├── page.tsx             # Interactive demo page
│   │   ├── fake-document.ts     # Mock verification data
│   │   └── app.css              # Demo page styles
│   ├── globals.css              # Global styles and theme
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── verification-center/     # Verification center components
│   │   ├── verifier.tsx         # Main component
│   │   ├── verifier-header.tsx  # Header component
│   │   ├── verifier-footer.tsx  # Footer component
│   │   ├── verification-initial-state.tsx
│   │   ├── texture-grid.tsx     # Background texture
│   │   └── tabs/                # Tab components (key, code, chip, etc.)
│   ├── tinfoil-badge/           # Tinfoil badge component
│   └── icons/                   # Icon components
├── lib/                          # Shared utilities
│   ├── constants/               # Constants (colors, fonts, etc.)
│   ├── types/                   # TypeScript types
│   └── utils/                   # Utility functions
├── public/                       # Static assets
│   ├── fonts/                   # Custom fonts
│   └── icons/                   # SVG icons
└── tailwind.config.ts
```

## Usage

### iframe Integration

The verification center is designed to be embedded as an iframe in your application.

```html
<iframe
  id="tinfoil-verification"
  src="https://verification-center.tinfoil.sh"
  style="width: 420px; height: 100vh; border: none;"
></iframe>
```

#### URL Parameters

- `darkMode` - `true` or `false` (default: `false`)
- `showHeader` - `true` or `false` (default: `true`)

Example:

```html
<iframe
  src="https://verification-center.tinfoil.sh?darkMode=true&showHeader=false"
  ...
></iframe>
```

#### postMessage API

**Send verification document to iframe:**

```javascript
const iframe = document.getElementById('tinfoil-verification')

iframe.contentWindow.postMessage({
  type: 'TINFOIL_VERIFICATION_DOCUMENT',
  document: verificationDocument
}, '*')
```

**Listen for iframe events:**

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'TINFOIL_VERIFICATION_CENTER_READY') {
    // Iframe is ready, send verification document
  }

  if (event.data.type === 'TINFOIL_REQUEST_VERIFICATION_DOCUMENT') {
    // Iframe is requesting verification document
  }
})
```

## Development

```bash
npm install
npm run dev
```

Visit:

- <http://localhost:3001> - Main iframe page
- <http://localhost:3001/dev> - Interactive development playground

## Components

The verification center is built as a pure React component (`VerificationCenter`) that can be:

- Embedded in iframes (via `/` route)
- Used directly in React applications
- Tested in the development playground (via `/dev` route)

### Using in React

```tsx
import { VerificationCenter } from '@/components/verification-center/verifier'

<VerificationCenter
  verificationDocument={document}
  isDarkMode={true}
  showHeader={true}
/>
```

#### Props

- `verificationDocument?: VerificationDocument` - The verification document to display
- `isDarkMode?: boolean` - Dark mode toggle (default: `true`)
- `showHeader?: boolean` - Whether to show the header (default: `true`)

## Deployment

Production: <https://verification-center.tinfoil.sh>
