"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GlareHover from "@/components/effects/glare-hover"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      login()
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0f] to-[#1a1a1c] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-alata text-3xl font-bold text-primary">SyncIn</h1>
        </div>

        {/* Glass Card with Glare effect */}
        <GlareHover
          width="100%"
          height="auto"
          background="rgba(255, 255, 255, 0.08)"
          borderRadius="1.5rem"
          borderColor="rgba(255, 255, 255, 0.2)"
          glareOpacity={0.35}
          glareAngle={-35}
          glareSize={220}
          transitionDuration={800}
          className="w-full place-items-stretch backdrop-blur-lg shadow-2xl"
        >
          <div className="w-full rounded-2xl border border-white/20 bg-white/5 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 font-inter">Welcome Back</h2>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-inter">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-inter focus:border-white/40"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-inter">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-inter focus:border-white/40"
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors font-inter">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90 font-inter font-semibold py-6 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Log In
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-white/70 font-inter">
              New here?{" "}
              <Link href="/signup" className="text-white hover:underline font-semibold">
                Sign Up instead
              </Link>
            </div>
          </div>
        </GlareHover>
      </div>
    </div>
  )
}
