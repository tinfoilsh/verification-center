# Tinfoil Verification Center (iframe embeddable)

Embeddable Tinfoil verification center for iframe integration.

## Usage

### As iframe

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

**Send verification document to iframe:**
```javascript
iframe.contentWindow.postMessage({
  type: 'TINFOIL_VERIFICATION_DOCUMENT',
  document: verificationDocument
}, '*')
```

**Open/close the verification center:**
```javascript
// Open
iframe.contentWindow.postMessage({
  type: 'TINFOIL_VERIFICATION_CENTER_OPEN'
}, '*')

// Close
iframe.contentWindow.postMessage({
  type: 'TINFOIL_VERIFICATION_CENTER_CLOSE'
}, '*')
```

**Listen for events from iframe:**
```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'TINFOIL_VERIFICATION_CENTER_READY') {
    // Center is ready, send verification document
  }

  if (event.data.type === 'TINFOIL_VERIFICATION_CENTER_CLOSED') {
    // User closed the verification center
  }

  if (event.data.type === 'TINFOIL_REQUEST_VERIFICATION_DOCUMENT') {
    // Center is requesting a fresh verification document
    // Fetch and send it back
  }
})
```

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:3001

## Deployment

Deployed at: https://verification-center.tinfoil.sh
