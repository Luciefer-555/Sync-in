"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/providers"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between rounded-full mx-auto max-w-6xl backdrop-blur-xl border border-white/15 bg-white/10 dark:bg-black/20 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <Link href="/" className="font-alata text-2xl font-bold text-white drop-shadow-[0_4px_30px_rgba(82,39,255,0.55)]">
          SyncIn
        </Link>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <Button className="bg-white text-black hover:bg-white/90 font-inter font-semibold transition-all duration-200 hover:scale-105 active:scale-95">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-white text-black hover:bg-white/90 font-inter font-semibold transition-all duration-200 hover:scale-105 active:scale-95">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              className="bg-white text-black hover:bg-white/90 font-inter font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Log Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
