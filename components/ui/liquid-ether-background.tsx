'use client'

import type { CSSProperties } from 'react'

export interface LiquidEtherBackgroundProps {
  className?: string
  style?: CSSProperties
}

export default function LiquidEtherBackground({
  className = '',
  style = {},
}: LiquidEtherBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 -z-10 overflow-hidden ${className}`}
      style={style}
      aria-hidden
    />
  )
}
