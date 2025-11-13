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
  const [profileId, setProfileId] = useState("")
  const [collegeId, setCollegeId] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ kind: "error" | "success"; message: string } | null>(null)

  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)

    if (!email.trim() || !profileId.trim() || !collegeId.trim()) {
      setStatus({ kind: "error", message: "Email, profile ID, and college ID are required." })
      return
    }

    if (!password.trim()) {
      setStatus({ kind: "error", message: "Password is required." })
      return
    }

    setSubmitting(true)
    try {
      const now = new Date().toISOString()
      login({
        username: profileId.trim(),
        profileId: profileId.trim(),
        collegeId: collegeId.trim(),
        collegeName: "Developer College",
        skills: [],
        role: "student",
        joinedAt: now,
        email: email.trim(),
      })
      setStatus({ kind: "success", message: "Signed in successfully." })
      router.push("/")
    } catch (error) {
      console.error("Login failed", error)
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "An unexpected error occurred." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0f] to-[#1a1a1c] flex items-center justify-center px-4 py-8">
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
              {status && (
                <p
                  className={`rounded-xl px-4 py-3 text-sm font-inter ${
                    status.kind === "error"
                      ? "border border-red-400/40 bg-red-400/10 text-red-100"
                      : "border border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                  }`}
                >
                  {status.message}
                </p>
              )}

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

              {/* Profile ID */}
              <div className="space-y-2">
                <Label htmlFor="profileId" className="text-white font-inter">
                  Profile ID
                </Label>
                <Input
                  id="profileId"
                  placeholder="syncin@ABC123"
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-inter focus:border-white/40"
                />
              </div>

              {/* College ID */}
              <div className="space-y-2">
                <Label htmlFor="collegeId" className="text-white font-inter text-sm">
                  College ID
                </Label>
                <Input
                  id="collegeId"
                  placeholder="e.g., NITD123"
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-inter focus:border-white/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-inter text-sm">
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

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90 font-inter font-semibold py-6 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                disabled={submitting}
              >
                {submitting ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center text-xs text-white/60 font-inter space-y-1">
                <p>
                  <Link href="/forgot-password" className="text-white/80 hover:text-white underline">
                    Forgot your password?
                  </Link>
                </p>
                <p>
                  <Link href="/recover-credentials" className="text-white/80 hover:text-white underline">
                    Lost your profile or college ID?
                  </Link>
                </p>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-white/70 font-inter text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-white hover:underline font-semibold">
                Create one
              </Link>
            </div>
          </div>
        </GlareHover>
      </div>
    </div>
  )
}
