"use client"

import { Card } from "@/components/ui/card"
import { BookOpen, FileText, BookOpenText } from "lucide-react"
import ResearchPaperLibrary from "@/components/ResearchPaperLibrary"

export default function Resources() {
  const resources = [
    { id: 1, title: "Data Structures Handbook", type: "PDF", downloads: 1240 },
    { id: 2, title: "Web Development Best Practices", type: "Guide", downloads: 856 },
    { id: 3, title: "Machine Learning Research Papers", type: "Collection", downloads: 2103 },
    { id: 4, title: "System Design Interview Prep", type: "Course", downloads: 1567 },
  ]

  return (
    <div className="pt-24 px-8 pb-8 bg-black text-white min-h-screen">
      <h1 className="font-alata text-4xl font-bold text-white mb-8">Resources</h1>

      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpenText className="w-8 h-8 text-[#1DB954]" />
            <h2 className="text-2xl font-bold text-white">Research Papers</h2>
          </div>
          <ResearchPaperLibrary />
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-[#1DB954]" />
            <h2 className="text-2xl font-bold text-white">Learning Resources</h2>
          </div>
          <div className="space-y-4">
            {resources.map((resource) => (
              <Card
                key={resource.id}
                className="bg-gray-900 border-gray-800 p-6 rounded-2xl hover:border-[#1DB954]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    {resource.type === "PDF" ? (
                      <FileText className="w-6 h-6 text-[#1DB954]" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-[#1DB954]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-inter font-semibold text-white">{resource.title}</h3>
                    <p className="text-gray-400 font-inter text-sm">{resource.type}</p>
                  </div>
                  <p className="text-gray-400 font-inter text-sm">{resource.downloads} downloads</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
