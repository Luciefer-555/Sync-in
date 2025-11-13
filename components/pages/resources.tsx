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
    <div className="min-h-screen bg-black pt-24 pb-12 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <h1 className="font-alata text-4xl font-bold">Resources</h1>

        <div className="space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-800 bg-gray-950/70 text-primary">
                <BookOpenText className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold">Research Papers</h2>
            </div>
            <Card className="border border-gray-800 bg-gray-900/80 p-6 text-gray-200">
              <ResearchPaperLibrary />
            </Card>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-800 bg-gray-950/70 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold">Learning Resources</h2>
            </div>
            <div className="space-y-4">
              {resources.map((resource) => (
                <Card
                  key={resource.id}
                  className="cursor-pointer rounded-2xl border border-gray-800 bg-gray-900/80 p-6 text-gray-200 transition-colors duration-200 hover:border-primary/40 hover:bg-gray-900"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-800 bg-gray-950/70 text-primary">
                      {resource.type === "PDF" ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <BookOpen className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-inter text-base font-semibold text-white">{resource.title}</h3>
                      <p className="font-inter text-sm text-gray-400">{resource.type}</p>
                    </div>
                    <p className="font-inter text-sm text-gray-400">{resource.downloads} downloads</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
