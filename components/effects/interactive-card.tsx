"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, ReactNode } from "react"

import { gsap } from "gsap"

import { cn } from "@/lib/utils"

const DEFAULT_PARTICLE_COUNT = 12
const DEFAULT_SPOTLIGHT_RADIUS = 300
const DEFAULT_GLOW_COLOR = "132, 0, 255"
const MOBILE_BREAKPOINT = 768

const MAGIC_CARD_STYLE = `
.magic-card {
  --magic-card-glow: ${DEFAULT_GLOW_COLOR};
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: ${DEFAULT_SPOTLIGHT_RADIUS}px;
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.magic-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.18);
}

.magic-card.card--border-glow::after {
  content: "";
  position: absolute;
  inset: 0;
  padding: 6px;
  border-radius: inherit;
  pointer-events: none;
  opacity: calc(var(--glow-intensity));
  background: radial-gradient(
    circle at var(--glow-x) var(--glow-y),
    rgba(var(--magic-card-glow), calc(var(--glow-intensity) * 0.9)) 0%,
    rgba(var(--magic-card-glow), calc(var(--glow-intensity) * 0.5)) 32%,
    transparent 62%
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.magic-card.card--border-glow:hover::after {
  opacity: 1;
}

.magic-card__particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(var(--magic-card-glow), 1);
  box-shadow: 0 0 6px rgba(var(--magic-card-glow), 0.6);
  pointer-events: none;
  z-index: 3;
}

.magic-card__particle::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: rgba(var(--magic-card-glow), 0.22);
  z-index: -1;
}
`

const ensureMagicCardStyles = () => {
  if (typeof document === "undefined") return
  if (document.getElementById("magic-card-styles")) return

  const style = document.createElement("style")
  style.id = "magic-card-styles"
  style.textContent = MAGIC_CARD_STYLE
  document.head.appendChild(style)
}

type MagicCardGroupOptions = {
  disableAnimations: boolean
  enableSpotlight: boolean
  spotlightRadius: number
  glowColor: string
}

type MagicCardGroupContextValue = {
  registerCard: (node: HTMLDivElement | null) => void
  unregisterCard: (node: HTMLDivElement | null) => void
  optionsRef: React.MutableRefObject<MagicCardGroupOptions>
}

const MagicCardGroupContext = createContext<MagicCardGroupContextValue | null>(null)

type MagicCardGroupProps = {
  children: ReactNode
  className?: string
  disableAnimations?: boolean
  enableSpotlight?: boolean
  spotlightRadius?: number
  glowColor?: string
  disableOnMobile?: boolean
}

type MagicCardProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  disableAnimations?: boolean
  particleCount?: number
  glowColor?: string
  enableTilt?: boolean
  enableMagnetism?: boolean
  clickEffect?: boolean
  enableBorderGlow?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
})

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect()
  const relativeX = ((mouseX - rect.left) / rect.width) * 100
  const relativeY = ((mouseY - rect.top) / rect.height) * 100

  card.style.setProperty("--glow-x", `${relativeX}%`)
  card.style.setProperty("--glow-y", `${relativeY}%`)
  card.style.setProperty("--glow-intensity", glow.toString())
  card.style.setProperty("--glow-radius", `${radius}px`)
}

const createParticleElement = (x: number, y: number, color: string): HTMLDivElement => {
  const el = document.createElement("div")
  el.className = "magic-card__particle"
  el.style.cssText = `left: ${x}px; top: ${y}px;`
  el.style.setProperty("--magic-card-glow", color)
  return el
}

export function MagicCardGroup({
  children,
  className,
  disableAnimations = false,
  enableSpotlight = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
  disableOnMobile = true,
}: MagicCardGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef(new Set<HTMLDivElement>())
  const optionsRef = useRef<MagicCardGroupOptions>({
    disableAnimations,
    enableSpotlight,
    spotlightRadius,
    glowColor,
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    ensureMagicCardStyles()
  }, [])

  useEffect(() => {
    if (!disableOnMobile) return

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [disableOnMobile])

  const resolvedDisableAnimations = disableAnimations || (disableOnMobile && isMobile)

  useEffect(() => {
    optionsRef.current = {
      disableAnimations: resolvedDisableAnimations,
      enableSpotlight,
      spotlightRadius,
      glowColor,
    }
  }, [resolvedDisableAnimations, enableSpotlight, spotlightRadius, glowColor])

  useEffect(() => {
    cardsRef.current.forEach((card) => {
      card.style.setProperty("--magic-card-glow", glowColor)
      card.style.setProperty("--glow-radius", `${spotlightRadius}px`)
    })
  }, [glowColor, spotlightRadius])

  const registerCard = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    cardsRef.current.add(node)
    node.style.setProperty("--magic-card-glow", glowColor)
    node.style.setProperty("--glow-radius", `${spotlightRadius}px`)
    if (!node.style.getPropertyValue("--glow-intensity")) {
      node.style.setProperty("--glow-intensity", "0")
    }
  }, [glowColor, spotlightRadius])

  const unregisterCard = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    cardsRef.current.delete(node)
  }, [])

  useEffect(() => {
    if (resolvedDisableAnimations || !enableSpotlight) return

    const spotlight = document.createElement("div")
    spotlight.className = "magic-card__spotlight"
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      mix-blend-mode: screen;
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 18%,
        rgba(${glowColor}, 0.04) 30%,
        rgba(${glowColor}, 0.02) 45%,
        transparent 70%
      );
    `

    document.body.appendChild(spotlight)

    const handleMouseLeave = () => {
      cardsRef.current.forEach((card) => {
        card.style.setProperty("--glow-intensity", "0")
      })

      gsap.to(spotlight, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const handleMouseMove = (event: MouseEvent) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      if (!inside) {
        handleMouseLeave()
        return
      }

      const radius = optionsRef.current.spotlightRadius ?? DEFAULT_SPOTLIGHT_RADIUS
      const { proximity, fadeDistance } = calculateSpotlightValues(radius)

      let minDistance = Infinity

      cardsRef.current.forEach((card) => {
        const cardRect = card.getBoundingClientRect()
        const centerX = cardRect.left + cardRect.width / 2
        const centerY = cardRect.top + cardRect.height / 2
        const distance =
          Math.hypot(event.clientX - centerX, event.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2
        const effectiveDistance = Math.max(0, distance)

        let glowIntensity = 0
        if (effectiveDistance <= proximity) {
          glowIntensity = 1
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity)
        }

        minDistance = Math.min(minDistance, effectiveDistance)

        updateCardGlowProperties(card, event.clientX, event.clientY, glowIntensity, radius)
      })

      gsap.to(spotlight, {
        left: event.clientX,
        top: event.clientY,
        duration: 0.12,
        ease: "power2.out",
      })

      const targetOpacity =
        minDistance <= proximity
          ? 0.82
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.82
            : 0

      gsap.to(spotlight, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.15 : 0.3,
        ease: "power2.out",
      })
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      spotlight.remove()
    }
  }, [enableSpotlight, glowColor, resolvedDisableAnimations])

  const contextValue = useMemo<MagicCardGroupContextValue>(
    () => ({
      registerCard,
      unregisterCard,
      optionsRef,
    }),
    [registerCard, unregisterCard],
  )

  return (
    <MagicCardGroupContext.Provider value={contextValue}>
      <div ref={containerRef} className={cn("magic-card-group relative", className)}>
        {children}
      </div>
    </MagicCardGroupContext.Provider>
  )
}

export function MagicCard({
  children,
  className,
  style,
  disableAnimations,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  enableBorderGlow = true,
  ...rest
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const isHoveredRef = useRef(false)
  const memoizedParticles = useRef<HTMLDivElement[]>([])
  const particlesInitialized = useRef(false)
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null)

  const context = useContext(MagicCardGroupContext)
  const groupOptions = context?.optionsRef.current

  const resolvedGlowColor = glowColor ?? groupOptions?.glowColor ?? DEFAULT_GLOW_COLOR
  const resolvedDisableAnimations = disableAnimations ?? groupOptions?.disableAnimations ?? false
  const resolvedSpotlightRadius = groupOptions?.spotlightRadius ?? DEFAULT_SPOTLIGHT_RADIUS

  useEffect(() => {
    ensureMagicCardStyles()
  }, [])

  useEffect(() => {
    const node = cardRef.current
    if (!node || !context) return

    context.registerCard(node)
    return () => {
      context.unregisterCard(node)
    }
  }, [context])

  useEffect(() => {
    const node = cardRef.current
    if (!node) return

    node.style.setProperty("--magic-card-glow", resolvedGlowColor)
    node.style.setProperty("--glow-radius", `${resolvedSpotlightRadius}px`)
    if (!node.style.getPropertyValue("--glow-intensity")) {
      node.style.setProperty("--glow-intensity", "0")
    }
  }, [resolvedGlowColor, resolvedSpotlightRadius])

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    timeoutsRef.current = []

    magnetismAnimationRef.current?.kill()
    magnetismAnimationRef.current = null

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          particle.parentNode?.removeChild(particle)
        },
      })
    })

    particlesRef.current = []
  }, [])

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return

    const { width, height } = cardRef.current.getBoundingClientRect()
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, resolvedGlowColor),
    )
    particlesInitialized.current = true
  }, [particleCount, resolvedGlowColor])

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return

    if (!particlesInitialized.current) {
      initializeParticles()
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return

        const clone = particle.cloneNode(true) as HTMLDivElement
        clone.style.setProperty("--magic-card-glow", resolvedGlowColor)
        cardRef.current.appendChild(clone)
        particlesRef.current.push(clone)

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
        )

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        })

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        })
      }, index * 120)

      timeoutsRef.current.push(timeoutId)
    })
  }, [initializeParticles, resolvedGlowColor])

  useEffect(() => {
    if (resolvedDisableAnimations || !cardRef.current) return

    const element = cardRef.current

    const handleMouseEnter = () => {
      isHoveredRef.current = true
      animateParticles()

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 6,
          rotateY: -6,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        })
      }
    }

    const handleMouseLeave = () => {
      isHoveredRef.current = false
      clearAllParticles()

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return

      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -12
        const rotateY = ((x - centerX) / centerX) * 12

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.12,
          ease: "power2.out",
          transformPerspective: 1000,
        })
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.06
        const magnetY = (y - centerY) * 0.06

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    const handleClick = (event: MouseEvent) => {
      if (!clickEffect) return

      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      )

      const ripple = document.createElement("div")
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${resolvedGlowColor}, 0.4) 0%, rgba(${resolvedGlowColor}, 0.18) 35%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 4;
      `

      element.appendChild(ripple)

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      )
    }

    element.addEventListener("mouseenter", handleMouseEnter)
    element.addEventListener("mouseleave", handleMouseLeave)
    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("click", handleClick)

    return () => {
      isHoveredRef.current = false
      element.removeEventListener("mouseenter", handleMouseEnter)
      element.removeEventListener("mouseleave", handleMouseLeave)
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("click", handleClick)
      clearAllParticles()
    }
  }, [
    animateParticles,
    clearAllParticles,
    resolvedDisableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    resolvedGlowColor,
  ])

  useEffect(() => {
    if (!resolvedDisableAnimations) return

    const node = cardRef.current
    if (!node) return

    clearAllParticles()
    gsap.set(node, { rotateX: 0, rotateY: 0, x: 0, y: 0 })
  }, [resolvedDisableAnimations, clearAllParticles])

  const mergedStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    ...style,
  }

  return (
    <div
      ref={cardRef}
      className={cn("magic-card", enableBorderGlow && "card--border-glow", className)}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </div>
  )
}
