# Tinfoil Verification Center

Next.js application for the Tinfoil verification center, providing an iframe-embeddable verification UI.

## Project Structure

```text
tinfoil-verification-center/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Main iframe page
│   ├── dev/                      # Development playground (unindexed)
│   │   ├── page.tsx             # Interactive demo page
│   │   ├── fake-document.ts     # Mock verification data
│   │   └── app.css              # Demo page styles
│   ├── globals.css              # Global styles and theme
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   └── verification-center/     # Verification center components
│       ├── verifier.tsx         # Main verification center component
│       ├── verification-status.tsx
│       ├── verification-initial-state.tsx
│       ├── steps/               # Process step components
│       ├── types/               # TypeScript types
│       └── utils/               # Utility functions
├── public/                       # Static assets
│   ├── fonts/                   # Custom fonts
│   └── icons/                   # SVG icons
├── tailwind.config.ts           # Tailwind configuration
└── package.json
```

## Usage

### iframe Integration

Embed the verification center in your application:

```html
<iframe
  id="verification-center"
  src="https://verification-center.tinfoil.sh?darkMode=false&showVerificationFlow=true&open=true"
  width="100%"
  height="100%"
  frameborder="0"
  scrolling="no"
  style="position: fixed; top: 0; left: 0; z-index: 9999"
></iframe>
```

### URL Parameters

- `darkMode` - `true` or `false` (default: `false`)
- `showVerificationFlow` - `true` or `false` (default: `true`)
- `open` - `true` or `false` (default: `true`)

### postMessage API

**Send verification document:**
```javascript
iframe.contentWindow.postMessage({
  type: 'TINFOIL_VERIFICATION_DOCUMENT',
  document: verificationDocument
}, '*')
```

**Control visibility:**
```javascript
iframe.contentWindow.postMessage({
  type: 'TINFOIL_VERIFICATION_CENTER_OPEN'
}, '*')

iframe.contentWindow.postMessage({
  type: 'TINFOIL_VERIFICATION_CENTER_CLOSE'
}, '*')
```

**Listen for events:**
```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'TINFOIL_VERIFICATION_CENTER_READY') {
    // Center is ready, send verification document
  }

  if (event.data.type === 'TINFOIL_VERIFICATION_CENTER_CLOSED') {
    // User closed the verification center
  }

  if (event.data.type === 'TINFOIL_REQUEST_VERIFICATION_DOCUMENT') {
    // Center is requesting verification document
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
  onRequestVerificationDocument={handleRequest}
  isDarkMode={true}
  fillContainer={true}
  compact={true}
  showInitialState={true}
/>
```

## Deployment

Production: <https://verification-center.tinfoil.sh>
