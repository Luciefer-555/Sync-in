"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GlareHover from "@/components/effects/glare-hover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    branch: "",
    year: "",
    skills: "",
    project: "",
    linkedin: "",
  })

  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleYearChange = (value: string) => {
    setFormData((prev) => ({ ...prev, year: value }))
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.fullName &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    ) {
      login()
      router.push("/")
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
          <h2 className="text-2xl font-bold text-white mb-6 font-inter">Join SyncIn</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white font-inter text-sm">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-inter focus:border-white/40"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-inter text-sm">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-inter focus:border-white/40"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-inter text-sm">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-inter focus:border-white/40"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white font-inter text-sm">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-inter focus:border-white/40"
              />
            </div>

            {/* College */}
            <div className="space-y-2">
              <Label htmlFor="college" className="text-white font-inter text-sm">
                College / University Name
              </Label>
              <Input
                id="college"
                name="college"
                placeholder="Your college"
                value={formData.college}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-inter focus:border-white/40"
              />
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label htmlFor="branch" className="text-white font-inter text-sm">
                Branch / Major
              </Label>
              <Input
                id="branch"
                name="branch"
                placeholder="Computer Science"
                value={formData.branch}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-inter focus:border-white/40"
              />
            </div>

            {/* Year of Study */}
            <div className="space-y-2">
              <Label htmlFor="year" className="text-white font-inter text-sm">
                Year of Study
              </Label>
              <Select value={formData.year} onValueChange={handleYearChange}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white font-inter">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1c] border-white/20">
                  <SelectItem value="1st">1st Year</SelectItem>
                  <SelectItem value="2nd">2nd Year</SelectItem>
                  <SelectItem value="3rd">3rd Year</SelectItem>
                  <SelectItem value="4th">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-white font-inter text-sm">
                Skills / Interests
              </Label>
              <Input
                id="skills"
                name="skills"
                placeholder="e.g., Web Dev, AI, Design"
                value={formData.skills}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-inter focus:border-white/40"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-white/90 font-inter font-semibold py-6 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 mt-6"
            >
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-white/70 font-inter text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline font-semibold">
              Log In
            </Link>
          </div>
        </div>
        </GlareHover>
      </div>
    </div>
  )
}
