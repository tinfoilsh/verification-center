'use client'

import type { AnimationItem } from 'lottie-web'
import lottie from 'lottie-web'
import { useEffect, useRef } from 'react'

const animationDataPromise =
  typeof window !== 'undefined'
    ? fetch('/logo-loading-loop.json').then(response => response.json())
    : Promise.resolve(null)

export function LogoLoading({ size = 80 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isUnmounted = false

    animationDataPromise
      .then(animationData => {
        if (!animationData || isUnmounted) return

        animationRef.current = lottie.loadAnimation({
          container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData,
        })
      })
      .catch(() => {})

    return () => {
      isUnmounted = true
      animationRef.current?.destroy()
      animationRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="tinfoil-logo-loading" style={{ width: size, height: size }} />
}
