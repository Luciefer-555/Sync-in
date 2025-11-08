"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

export default function Profile() {
  return (
    <div className="pt-24 px-8 pb-8">
      <h1 className="font-alata text-4xl font-bold text-foreground mb-8">Profile</h1>

      <div className="max-w-2xl space-y-6">
        <Card className="bg-card border-border p-8 rounded-2xl">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="font-alata text-2xl font-bold text-foreground">Student Name</h2>
              <p className="text-muted-foreground font-inter">student@university.edu</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6 rounded-2xl">
          <h3 className="font-inter font-semibold text-foreground mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {["React", "TypeScript", "Python", "Data Structures", "Web Dev"].map((skill) => (
              <Badge key={skill} className="bg-primary/20 text-primary border-0">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="bg-card border-border p-6 rounded-2xl">
          <h3 className="font-inter font-semibold text-foreground mb-4">Achievements</h3>
          <div className="space-y-3 font-inter text-muted-foreground">
            <p>🏆 Completed 50 problems</p>
            <p>🔥 12-day streak</p>
            <p>🎯 Participated in 3 hackathons</p>
            <p>👥 Collaborated on 5 projects</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
