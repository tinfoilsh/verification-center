# Tinfoil Verification Center

**Live at:** <https://verification-center.tinfoil.sh>

An embeddable iframe that shows users the result of Tinfoil's enclave verification. Tinfoil Chat and third-party apps embed it and feed it the verification document produced by a Tinfoil SDK. See the [Verification center UI guide](https://docs.tinfoil.sh/guides/verification-center) for a full integration.

## iframe contract

URL parameters:

- `darkMode`: `true` or `false` (default `false`)
- `showHeader`: `true` or `false` (default `true`)
- `type`: `chat` for AI chat wording, otherwise generic container wording (default)

Messages to the iframe:

- `{ type: 'TINFOIL_VERIFICATION_DOCUMENT', document }`: displays `document`, a `VerificationDocument` from the SDK

Messages from the iframe (posted to the parent with target origin `*`, so check `event.origin`):

- `TINFOIL_VERIFICATION_CENTER_READY`: the iframe is ready to receive a document
- `TINFOIL_REQUEST_VERIFICATION_DOCUMENT`: the iframe asks for a fresh document

## React component

`VerificationCenter` in `components/verification-center/verifier.tsx` takes:

- `verificationDocument?: VerificationDocument`: shows a loading state while unset
- `isDarkMode?: boolean` (default `true`)
- `showHeader?: boolean` (default `true`)
- `type?: 'chat' | 'default'` (default `'default'`)

## Development

```bash
npm install
npm run dev     # http://localhost:3001, demo playground at /dev
npx playwright install chromium
npm test        # builds the static export and tests it under the production CSP
```

## Reporting Vulnerabilities

Please report security vulnerabilities by either:

- Emailing [security@tinfoil.sh](mailto:security@tinfoil.sh)
- Opening an issue on GitHub on this repository

We aim to respond to (legitimate) security reports within 24 hours.
