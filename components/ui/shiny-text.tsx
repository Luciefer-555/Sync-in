'use client'

import React from 'react'

import { cn } from '@/lib/utils'

interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
}

export default function ShinyText({ text, disabled = false, speed = 5, className }: ShinyTextProps) {
  const animationDuration = `${speed}s`

  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent',
        disabled ? 'text-white/80' : 'animate-shine',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 60%)',
        backgroundSize: '200% 100%',
        animationDuration,
        WebkitBackgroundClip: 'text',
      }}
    >
      {text}
    </span>
  )
}
