"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

export default function CollaborationHub() {
  const projects = [
    { id: 1, name: "AI Chat Application", members: 4, status: "Active" },
    { id: 2, name: "E-commerce Platform", members: 6, status: "Active" },
    { id: 3, name: "Data Analytics Tool", members: 3, status: "Planning" },
  ]

  return (
    <div className="pt-24 px-8 pb-8 bg-black text-white min-h-screen">
      <h1 className="font-alata text-4xl font-bold text-white mb-8">Collaboration Hub</h1>

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="bg-gray-900 border-gray-700 p-6 rounded-2xl hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-inter font-semibold text-white text-lg">{project.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-gray-300 font-inter text-sm">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>{project.members} members</span>
                  <span className="text-gray-500">•</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${project.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="border-blue-400 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 bg-transparent hover:border-blue-300 transition-colors"
              >
                View Project
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
