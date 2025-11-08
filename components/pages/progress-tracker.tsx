"use client"

import { Card } from "@/components/ui/card"

export default function ProgressTracker() {
  const categories = [
    { name: "Data Structures", progress: 75, total: 20 },
    { name: "Algorithms", progress: 60, total: 15 },
    { name: "Web Development", progress: 85, total: 12 },
    { name: "Machine Learning", progress: 40, total: 10 },
  ]

  return (
    <div className="pt-24 px-8 pb-8">
      <h1 className="font-alata text-4xl font-bold text-foreground mb-8">Progress Tracker</h1>

      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category.name} className="bg-card border-border p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-inter font-semibold text-foreground">{category.name}</h3>
              <span className="text-muted-foreground font-inter text-sm">{category.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${category.progress}%` }} />
            </div>
            <p className="text-muted-foreground font-inter text-xs mt-2">
              {Math.round((category.progress / 100) * category.total)} of {category.total} completed
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
