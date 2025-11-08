"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type Problem = {
  id: number | string
  title: string
  category: string
  difficulty: string
  description?: string
  source?: string
}

export default function ProblemStatements() {
  const hackathonProblems: Problem[] = [
    {
      id: 'h1',
      title: 'Digital Learning Platform for Rural Students',
      category: 'AI/Education',
      difficulty: 'Hard',
      description: 'AI-based educational platform designed to provide accessible and personalized learning experiences for students in rural areas with limited resources.',
      source: 'https://sih.gov.in'
    },
    {
      id: 'h2',
      title: 'Smart Classroom & Timetable Scheduler',
      category: 'AI/Productivity',
      difficulty: 'Medium',
      description: 'AI-powered system to optimize class schedules, room allocations, and resource management for educational institutions.',
      source: 'https://sih.gov.in'
    },
    {
      id: 'h3',
      title: 'Authenticity Validator for Academia',
      category: 'Blockchain',
      difficulty: 'Hard',
      description: 'Blockchain and AI solution to verify academic credentials and prevent certificate forgery in educational institutions.',
      source: 'https://sih.gov.in'
    },
    {
      id: 'h4',
      title: 'Gamified Learning Platform for Rural Education',
      category: 'Gamification',
      difficulty: 'Medium',
      description: 'Adaptive gamification system using AI to create engaging educational content for students in rural areas.',
      source: 'https://sih.gov.in'
    },
    {
      id: 'h5',
      title: 'AI-Powered Student Talent Assessment',
      category: 'AI/Education',
      difficulty: 'Hard',
      description: 'Mobile platform using computer vision and AI to assess and nurture student talents in sports and co-curricular activities.',
      source: 'https://sih.gov.in'
    },
    {
      id: 'h6',
      title: 'AI-Based Career Guidance System',
      category: 'AI/Career',
      difficulty: 'Medium',
      description: 'Personalized career recommendation engine using AI to guide students based on their skills and interests.',
      source: 'https://sih.gov.in'
    },
    {
      id: 'h7',
      title: 'Smart Attendance System Using Face Recognition',
      category: 'Computer Vision',
      difficulty: 'Medium',
      description: 'Contactless attendance system using facial recognition to streamline classroom management.',
      source: 'https://sih.gov.in'
    }
  ]

  const otherProblems: Problem[] = [
    { id: 1, title: "AI-Powered Chatbot for Technical Education", category: "AI/ML", difficulty: "Hard" },
    { id: 2, title: "Smart Street Parking Management", category: "IoT/AI", difficulty: "Hard" },
    { id: 3, title: "Blockchain-Based Legal Record Management", category: "Blockchain", difficulty: "Hard" },
    { id: 4, title: "AI for Rain Prediction", category: "AI/ML", difficulty: "Medium" },
    { id: 5, title: "Smart Competency Diagnostic Tool", category: "AI/ML", difficulty: "Medium" },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "Hard":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const ProblemCard = ({ problem, isHackathon = false }: { problem: Problem, isHackathon?: boolean }) => (
    <Card className="bg-gray-900 border-gray-800 p-6 rounded-xl hover:border-[#1DB954]/50 transition-colors">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-alata font-bold text-white text-lg mb-2">{problem.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-300">{problem.category}</span>
                <Badge className={`${getDifficultyColor(problem.difficulty)} border-0 text-xs`}>
                  {problem.difficulty}
                </Badge>
                {isHackathon && (
                  <Badge className="bg-[#1DB954]/20 text-[#1DB954] border-0 text-xs">
                    Hackathon
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {problem.description && (
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {problem.description}
            </p>
          )}
        </div>
        
        {isHackathon && problem.source && (
          <Link 
            href={problem.source} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-[#1DB954] text-white rounded-md hover:bg-opacity-90 transition-colors text-sm font-medium w-full text-center"
          >
            View on SIH
            <svg 
              className="w-4 h-4 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </Link>
        )}
      </div>
    </Card>
  )

  return (
    <div className="pt-24 px-4 md:px-8 pb-12 bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-alata text-4xl font-bold text-white mb-2">Problem Statements</h1>
        <p className="text-gray-400 mb-8">Explore and contribute to these challenges</p>
        
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <svg 
              className="w-8 h-8 text-[#1DB954]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
              />
            </svg>
            <h2 className="text-2xl font-bold text-white font-alata">Hackathon Challenges</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hackathonProblems.map((problem) => (
              <ProblemCard key={`hack-${problem.id}`} problem={problem} isHackathon={true} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6 font-alata">Other Problem Statements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherProblems.map((problem) => (
              <ProblemCard key={`other-${problem.id}`} problem={problem} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
