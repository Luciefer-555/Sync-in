"use client"

import { useAuth } from "./providers"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import HomePage from "@/components/home-page"
import Dashboard from "@/components/pages/dashboard"
import ProgressTracker from "@/components/pages/progress-tracker"
import ProblemStatements from "@/components/pages/problem-statements"
import Hackathons from "@/components/pages/hackathons"
import CollaborationHub from "@/components/pages/collaboration-hub"
import Resources from "@/components/pages/resources"
import Community from "@/components/pages/community"
import Profile from "@/components/pages/profile"
import AboutSyncIn from "@/components/pages/about-syncin"
import ChatInterface from "@/components/chat/ChatInterface"
import Prep from "@/components/pages/prep"
import { useState } from "react"

export default function Page() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    if (!isLoggedIn) {
      return <HomePage />
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "progress-tracker":
        return <ProgressTracker />
      case "problem-statements":
        return <ProblemStatements />
      case "hackathons":
        return <Hackathons />
      case "collaboration-hub":
        return <CollaborationHub />
      case "resources":
        return <Resources />
      case "community":
        return <Community />
      case "prep":
        return <Prep />
      case "assistant":
        return <ChatInterface />
      case "profile":
        return <Profile />
      case "about":
        return <AboutSyncIn />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {isLoggedIn && <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />}
      <main className={`${isLoggedIn ? "ml-64" : ""} pt-16`}>{renderPage()}</main>
    </div>
  )
}
