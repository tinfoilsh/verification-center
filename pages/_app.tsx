import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '../dev/dev.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
