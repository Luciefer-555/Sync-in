"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface PublicUser {
  username: string
  profileId: string
  collegeId: string
  collegeName: string
  skills: string[]
  role: string
  joinedAt: string
  email?: string
}

interface AuthContextType {
  isLoggedIn: boolean
  user: PublicUser | null
  login: (user: PublicUser) => void
  logout: () => void
}

const STORAGE_KEY = "syncin_user"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as PublicUser
        setUser(parsed)
      }
    } catch (error) {
      console.error("Failed to parse stored user", error)
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const login = (nextUser: PublicUser) => {
    setUser(nextUser)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    } catch (error) {
      console.error("Failed to persist user", error)
    }
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: Boolean(user), user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
