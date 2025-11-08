"use client"

import { useState } from "react"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"

// Dynamically import the HeroSection with no SSR
const HeroSection = dynamic(
  () => import('./home/hero-section'),
  { ssr: false }
)

// Dynamically import the ChatInterface with no SSR to avoid hydration issues
const ChatInterface = dynamic(
  () => import('./chat/ChatInterface'),
  { ssr: false }
)

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-black">
      <HeroSection />

      {/* Floating chat widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {isChatOpen && (
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-black/80 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <p className="text-sm font-semibold tracking-wide uppercase text-white/80">SyncIn Assistant</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                onClick={() => setIsChatOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[420px] bg-black/40">
              <ChatInterface />
            </div>
          </div>
        )}

        <Button
          type="button"
          size="icon"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_20px_45px_rgba(82,39,255,0.35)] transition-transform duration-200 hover:scale-105 active:scale-95"
          onClick={() => setIsChatOpen((prev) => !prev)}
          aria-expanded={isChatOpen}
          aria-label={isChatOpen ? "Close SyncIn Assistant" : "Open SyncIn Assistant"}
        >
          {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  )
}
