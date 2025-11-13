"use client"

import { useMemo } from "react"

import { useAuth } from "@/app/providers"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, IdCard, GraduationCap, LogOut } from "lucide-react"

function formatDate(value?: string) {
  if (!value) return "--"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export default function Profile() {
  const { user, logout } = useAuth()

  const primarySkills = useMemo(() => {
    if (!user?.skills?.length) return []
    return user.skills.slice(0, 12)
  }, [user?.skills])

  if (!user) {
    return (
      <div className="pt-24 px-8 pb-8">
        <div className="mx-auto max-w-xl space-y-6">
          <Card className="border-dashed border-foreground/30 bg-background/60 p-8 text-center">
            <h1 className="font-alata text-3xl font-bold text-foreground">Sign in to view your profile</h1>
            <p className="mt-4 font-inter text-sm text-muted-foreground">
              Create an account or sign in with your SyncIn profile ID to see your verified college identity, skills, and contributions.
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 px-8 pb-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex flex-col gap-2">
          <h1 className="font-alata text-4xl font-bold text-foreground">Profile</h1>
          <p className="font-inter text-sm text-muted-foreground">
            Your SyncIn identity is college-verified. Emails and phone numbers stay private while peers connect via profile IDs.
          </p>
        </header>

        <Card className="space-y-6 border-border/70 bg-card/70 p-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-alata text-2xl font-semibold text-foreground">{user.username}</h2>
                <Badge variant="outline" className="border-primary/40 text-primary">
                  {user.role}
                </Badge>
              </div>
              <div className="flex flex-col gap-1 text-sm font-inter text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {user.email ?? "Hidden"}
                </span>
                <span className="flex items-center gap-2">
                  <IdCard className="h-4 w-4" /> {user.profileId}
                </span>
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" /> {user.collegeName} ({user.collegeId})
                </span>
              </div>
              <p className="font-inter text-xs text-muted-foreground/80">
                Joined SyncIn on {formatDate(user.joinedAt)}
              </p>
            </div>
            <Button variant="secondary" className="gap-2 rounded-full" onClick={logout}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </Card>

        <Card className="border-border/70 bg-card/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-inter text-lg font-semibold text-foreground">Skills</h3>
              <p className="text-xs text-muted-foreground">Shared with classmates to help collaborators find you.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {primarySkills.length > 0 ? (
              primarySkills.map((skill) => (
                <Badge key={skill} variant="outline" className="border-foreground/20 text-foreground">
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="font-inter text-sm text-muted-foreground">Add skills during registration to showcase your strengths.</span>
            )}
          </div>
        </Card>

        <Card className="border-border/70 bg-card/70 p-6">
          <h3 className="font-inter text-lg font-semibold text-foreground">Community presence</h3>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>
              • Posts and comments are visible only to members of <strong>{user.collegeName}</strong>.
            </p>
            <p>
              • Share your profile ID (<code className="rounded bg-foreground/10 px-1 py-0.5 text-xs">{user.profileId}</code>) to connect with peers without exposing your email or phone.
            </p>
            <p>• Need to update your college or skills? Re-register with updated information to refresh your profile.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
