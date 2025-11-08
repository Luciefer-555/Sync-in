'use client'

import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Dynamically import the GradientBlinds effect with no SSR (depends on WebGL)
const GradientBlinds = dynamic(
  () => import('@/components/effects/gradient-blinds'),
  { ssr: false },
)

export default function HeroSection() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Gradient blinds background */}
      <div className="absolute inset-0 z-0">
        <GradientBlinds
          className="opacity-90"
          gradientColors={["#5227FF", "#FF9FFC", "#B19EEF", "#5EDFFF"]}
          blindCount={18}
          blindMinWidth={80}
          mouseDampening={0.2}
          spotlightRadius={0.65}
          spotlightSoftness={1.35}
          spotlightOpacity={0.85}
          distortAmount={6}
          shineDirection="right"
          mixBlendMode="screen"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-sm font-nunito-extrabold text-white/80 text-center py-4">Sep 5, 2025</div>

          {/* Hero Title */}
          <div className="space-y-4 mb-8">
            <h1 className="font-alata text-5xl md:text-6xl font-bold text-white text-center drop-shadow-[0_15px_40px_rgba(82,39,255,0.35)]">
              Introducing <span className="text-white">SyncIn</span>
            </h1>
          </div>

          <div className="font-inter text-lg text-white/90 mx-auto text-justify space-y-6 mb-12 backdrop-blur-sm bg-black/20 p-8 rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <p className="font-sans">A collaborative space to track your academic journey and connect through projects, skills, and growth.</p>
            <p>
              SyncIn engages in a practical yet inspiring way — helping you track your progress, discover opportunities,
              and grow alongside peers.
            </p>
            <p>
              Unlike traditional student platforms, SyncIn is designed with depth: it guides, connects, and adapts.
              Through features like academic tracking, personalized dashboards, problem statement discovery, hackathon
              spaces, and a rich library of question papers and research resources, SyncIn empowers students to move
              forward with clarity.
            </p>
            <p>We're excited to introduce SyncIn and invite you to explore, contribute, and collaborate.</p>
            <p className="mb-0">
              Your feedback will guide us in shaping SyncIn into a reliable, insightful, and community-driven companion
              for your college journey. During this early preview, SyncIn is free to try.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full hover:bg-white/10 font-inter font-semibold text-lg rounded-full transition-all duration-200 hover:scale-105 active:scale-95 text-white bg-transparent border border-white/30 shadow-lg hover:border-white/50 py-6 px-8">
                Try SyncIn
              </Button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button className="w-full font-inter font-semibold text-lg rounded-full transition-all duration-200 hover:scale-105 active:scale-95 bg-white text-black hover:bg-white/90 py-6 px-8">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
