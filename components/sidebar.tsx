"use client"

import { useEffect, useRef } from "react"

import { gsap } from "gsap"
import { LayoutDashboard, TrendingUp, FileText, Trophy, Users, BookOpen, MessageSquare, User, Info } from "lucide-react"

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "progress-tracker", label: "Progress Tracker", icon: TrendingUp },
  { id: "problem-statements", label: "Problem Statements", icon: FileText },
  { id: "hackathons", label: "Hackathons", icon: Trophy },
  { id: "collaboration-hub", label: "Collaboration Hub", icon: Users },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "community", label: "Community", icon: MessageSquare },
  { id: "profile", label: "Profile", icon: User },
  { id: "about", label: "About SyncIn", icon: Info },
]

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([])
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([])
  const hoverLabelRefs = useRef<Array<HTMLSpanElement | null>>([])
  const timelines = useRef<Array<gsap.core.Timeline | null>>([])
  const activeTweens = useRef<Array<gsap.core.Tween | null>>([])

  const ease = "power3.out"

  useEffect(() => {
    if (typeof window === "undefined") return

    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        const pill = buttonRefs.current[index]
        if (!circle || !pill) return

        const rect = pill.getBoundingClientRect()
        const { width: w, height: h } = rect
        if (w === 0 || h === 0) return

        const R = ((w * w) / 4 + h * h) / (2 * h)
        const D = Math.ceil(2 * R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        const originY = D - delta

        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        })

        const label = labelRefs.current[index]
        const hoverLabel = hoverLabelRefs.current[index]

        if (label) gsap.set(label, { y: 0 })
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 })

        timelines.current[index]?.kill()
        const tl = gsap.timeline({ paused: true })

        tl.to(circle, { scale: 1.15, duration: 0.6, ease, overwrite: "auto" }, 0)

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 0.6, ease, overwrite: "auto" }, 0)
        }

        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 })
          tl.to(hoverLabel, { y: 0, opacity: 1, duration: 0.6, ease, overwrite: "auto" }, 0)
        }

        timelines.current[index] = tl
      })

      // ensure active item is highlighted after recalculating
      timelines.current.forEach((tl, index) => {
        if (!tl) return
        activeTweens.current[index]?.kill()
        if (menuItems[index]?.id === currentPage) {
          tl.progress(1)
        } else {
          tl.progress(0)
        }
      })
    }

    layout()

    const handleResize = () => layout()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      timelines.current.forEach((tl) => tl?.kill())
      activeTweens.current.forEach((tween) => tween?.kill())
    }
  }, [currentPage, ease])

  useEffect(() => {
    timelines.current.forEach((tl, index) => {
      if (!tl) return
      activeTweens.current[index]?.kill()
      if (menuItems[index]?.id === currentPage) {
        tl.progress(1)
      } else {
        tl.progress(0)
      }
    })
  }, [currentPage])

  const handleEnter = (index: number) => {
    const tl = timelines.current[index]
    if (!tl) return
    activeTweens.current[index]?.kill()
    activeTweens.current[index] = tl.tweenTo(tl.duration(), {
      duration: 0.35,
      ease,
      overwrite: "auto",
    })
  }

  const handleLeave = (index: number) => {
    if (menuItems[index]?.id === currentPage) return
    const tl = timelines.current[index]
    if (!tl) return
    activeTweens.current[index]?.kill()
    activeTweens.current[index] = tl.tweenTo(0, {
      duration: 0.25,
      ease,
      overwrite: "auto",
    })
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="p-6 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              ref={(el) => {
                buttonRefs.current[index] = el
              }}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => handleEnter(index)}
              onMouseLeave={() => handleLeave(index)}
              className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-left font-microsoft transition-transform duration-200 hover:translate-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                isActive ? "text-black" : "text-sidebar-foreground"
              }`}
            >
              <span
                ref={(el) => {
                  circleRefs.current[index] = el
                }}
                className="pointer-events-none absolute left-1/2 bottom-0 block -z-10 rounded-full bg-white/90 shadow-[0_10px_30px_rgba(255,255,255,0.25)]"
              />
              <Icon
                className={`relative z-10 h-5 w-5 transition-colors duration-300 ${
                  isActive ? "text-black" : "text-sidebar-foreground group-hover:text-black"
                }`}
              />
              <span className="relative z-10 inline-block leading-none">
                <span
                  ref={(el) => {
                    labelRefs.current[index] = el
                  }}
                  className="pill-label block text-base font-semibold tracking-tight"
                >
                  {item.label}
                </span>
                <span
                  ref={(el) => {
                    hoverLabelRefs.current[index] = el
                  }}
                  className="pill-label-hover absolute left-0 top-0 block text-base font-semibold tracking-tight text-black"
                  aria-hidden="true"
                >
                  {item.label}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
