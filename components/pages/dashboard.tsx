"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { MagicCard, MagicCardGroup } from "@/components/effects/interactive-card"
import { BookOpen, Trophy, TrendingUp, Users } from "lucide-react"

type StatKey = "problemsSolved" | "streakDays" | "hackathons" | "collaborations"

type StatConfig = {
  key: StatKey
  label: string
  icon: typeof BookOpen
  color: string
}

type RecentActivity = {
  achievement: string
  timeframe: string
  reward?: string
}

type HackathonEntry = {
  name: string
  idea: string
  link: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<Record<StatKey, number>>({
    problemsSolved: 0,
    streakDays: 0,
    hackathons: 0,
    collaborations: 0,
  })

  const [progressForm, setProgressForm] = useState({
    problemsSolved: "",
    streakDays: "",
    hackathons: "",
    collaborations: "",
  })

  const [recentActivityForm, setRecentActivityForm] = useState({
    achievement: "",
    timeframe: "",
    reward: "",
  })

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])

  const [hackathonForm, setHackathonForm] = useState({
    name: "",
    idea: "",
    link: "",
  })

  const [hackathonsAttended, setHackathonsAttended] = useState<HackathonEntry[]>([])

  const [engagementPrefs, setEngagementPrefs] = useState({
    trackLanguages: false,
    showPerformanceGraph: false,
    streakReminders: false,
  })

  const [personalization, setPersonalization] = useState({
    platform: "",
    summaryFrequency: "week",
    motivationFocus: "consistency",
  })

  const statConfig: StatConfig[] = useMemo(
    () => [
      { key: "problemsSolved", label: "Problems Solved", icon: BookOpen, color: "text-blue-400" },
      { key: "streakDays", label: "Streak Days", icon: TrendingUp, color: "text-green-400" },
      { key: "hackathons", label: "Hackathons", icon: Trophy, color: "text-yellow-400" },
      { key: "collaborations", label: "Collaborations", icon: Users, color: "text-purple-400" },
    ],
    [],
  )

  const handleProgressSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setStats((prev) => {
      const next: Record<StatKey, number> = { ...prev }

      statConfig.forEach(({ key }) => {
        const value = Number(progressForm[key])
        if (!Number.isNaN(value) && progressForm[key] !== "") {
          next[key] = Math.max(0, value)
        }
      })

      return next
    })

    setProgressForm({
      problemsSolved: "",
      streakDays: "",
      hackathons: "",
      collaborations: "",
    })
  }

  const handleRecentActivitySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!recentActivityForm.achievement || !recentActivityForm.timeframe) {
      return
    }

    setRecentActivities((prev) => [
      {
        achievement: recentActivityForm.achievement,
        timeframe: recentActivityForm.timeframe,
        reward: recentActivityForm.reward || undefined,
      },
      ...prev,
    ])

    setRecentActivityForm({ achievement: "", timeframe: "", reward: "" })
  }

  const handleHackathonSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!hackathonForm.name || !hackathonForm.idea) {
      return
    }

    setHackathonsAttended((prev) => [
      {
        name: hackathonForm.name,
        idea: hackathonForm.idea,
        link: hackathonForm.link,
      },
      ...prev,
    ])

    setStats((prev) => ({
      ...prev,
      hackathons: prev.hackathons + 1,
    }))

    setHackathonForm({ name: "", idea: "", link: "" })
  }

  return (
    <div className="pt-24 px-8 pb-8 bg-black text-white">
      <h1 className="font-alata text-4xl font-bold text-white mb-8">Dashboard</h1>
      <MagicCardGroup className="space-y-8" glowColor="132, 0, 255">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statConfig.map((stat) => {
            const Icon = stat.icon
            return (
              <MagicCard
                key={stat.key}
                className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
                enableMagnetism
                enableTilt
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 font-inter text-sm mb-2">{stat.label}</p>
                    <p className="font-alata text-3xl font-bold text-white">{stats[stat.key]}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </MagicCard>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          <MagicCard className="bg-gray-900 border border-gray-700 rounded-2xl p-8" enableMagnetism enableTilt>
            <h2 className="font-alata text-2xl font-bold text-white mb-4">General Progress Tracking</h2>
            <p className="text-gray-400 font-inter text-sm mb-6">
              Update your key metrics and keep your momentum. Leave a field blank to keep its current value.
            </p>
            <form onSubmit={handleProgressSubmit} className="space-y-5">
              {statConfig.map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-2">
                  <Label htmlFor={key} className="font-inter text-sm text-gray-200">
                    {label}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    min={0}
                    value={progressForm[key]}
                    onChange={(event) =>
                      setProgressForm((prev) => ({
                        ...prev,
                        [key]: event.target.value,
                      }))
                    }
                    placeholder={`Current total (${stats[key]} recorded)`}
                    className="bg-gray-950/80 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              ))}
              <Button type="submit" className="bg-primary text-white font-inter">
                Save Progress
              </Button>
            </form>
          </MagicCard>

          <MagicCard className="bg-gray-900 border border-gray-700 rounded-2xl p-8" enableMagnetism enableTilt>
            <h2 className="font-alata text-2xl font-bold text-white mb-4">Engagement & Growth</h2>
            <p className="text-gray-400 font-inter text-sm mb-6">
              Configure how detailed your dashboard insights should become over time.
            </p>
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-medium font-inter">Track coding languages separately?</p>
                  <p className="text-gray-500 text-sm font-inter">Log progress per language with future analytics.</p>
                </div>
                <Switch
                  checked={engagementPrefs.trackLanguages}
                  onCheckedChange={(checked) =>
                    setEngagementPrefs((prev) => ({
                      ...prev,
                      trackLanguages: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-medium font-inter">Show performance graph over time?</p>
                  <p className="text-gray-500 text-sm font-inter">Visualise streaks and solved problems weekly.</p>
                </div>
                <Switch
                  checked={engagementPrefs.showPerformanceGraph}
                  onCheckedChange={(checked) =>
                    setEngagementPrefs((prev) => ({
                      ...prev,
                      showPerformanceGraph: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-medium font-inter">Remind me to maintain my streak.</p>
                  <p className="text-gray-500 text-sm font-inter">Receive nudges when your streak is in danger.</p>
                </div>
                <Switch
                  checked={engagementPrefs.streakReminders}
                  onCheckedChange={(checked) =>
                    setEngagementPrefs((prev) => ({
                      ...prev,
                      streakReminders: checked,
                    }))
                  }
                />
              </div>
            </div>
          </MagicCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-6">
          <MagicCard className="bg-gray-900 border border-gray-700 rounded-2xl p-8" enableMagnetism enableTilt>
            <h2 className="font-alata text-2xl font-bold text-white mb-4">Hackathon Journey</h2>
            <p className="text-gray-400 font-inter text-sm mb-6">
              Log each hackathon you attend. Your hackathon count updates automatically.
            </p>
            <form onSubmit={handleHackathonSubmit} className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="hackathon-name" className="font-inter text-sm text-gray-200">
                  Hackathon name
                </Label>
                <Input
                  id="hackathon-name"
                  value={hackathonForm.name}
                  onChange={(event) =>
                    setHackathonForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Hack the North"
                  className="bg-gray-950/80 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hackathon-idea" className="font-inter text-sm text-gray-200">
                  What project idea did you present?
                </Label>
                <Textarea
                  id="hackathon-idea"
                  value={hackathonForm.idea}
                  onChange={(event) =>
                    setHackathonForm((prev) => ({
                      ...prev,
                      idea: event.target.value,
                    }))
                  }
                  placeholder="Describe your prototype and impact."
                  className="min-h-[120px] bg-gray-950/80 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hackathon-link" className="font-inter text-sm text-gray-200">
                  Project link (optional)
                </Label>
                <Input
                  id="hackathon-link"
                  value={hackathonForm.link}
                  onChange={(event) =>
                    setHackathonForm((prev) => ({
                      ...prev,
                      link: event.target.value,
                    }))
                  }
                  placeholder="https://"
                  className="bg-gray-950/80 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <Button type="submit" className="bg-primary text-white font-inter">
                Add hackathon entry
              </Button>
            </form>

            <div className="space-y-4">
              {hackathonsAttended.length === 0 ? (
                <p className="text-gray-500 font-inter text-sm">No hackathons logged yet. Start by adding your first one above.</p>
              ) : (
                hackathonsAttended.map((hackathon, index) => (
                  <div key={`${hackathon.name}-${index}`} className="border border-gray-800 rounded-xl p-5 bg-gray-950/60">
                    <div className="flex flex-col gap-1 mb-3">
                      <span className="text-sm uppercase tracking-wide text-gray-500 font-inter">Hackathon</span>
                      <span className="text-lg font-semibold font-alata text-white">{hackathon.name}</span>
                    </div>
                    <p className="text-gray-300 font-inter text-sm whitespace-pre-wrap mb-3">{hackathon.idea}</p>
                    {hackathon.link && (
                      <a
                        href={hackathon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-semibold hover:underline"
                      >
                        View project
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </MagicCard>

          <div className="flex flex-col gap-6">
            <MagicCard className="bg-gray-900 border border-gray-700 rounded-2xl p-8" enableMagnetism enableTilt>
              <h2 className="font-alata text-2xl font-bold text-white mb-4">Recent Activity</h2>
              <p className="text-gray-400 font-inter text-sm mb-6">
                Capture your latest wins and celebrate them on your timeline.
              </p>
              <form onSubmit={handleRecentActivitySubmit} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="activity-achievement" className="font-inter text-sm text-gray-200">
                    What&apos;s your most recent achievement?
                  </Label>
                  <Input
                    id="activity-achievement"
                    value={recentActivityForm.achievement}
                    onChange={(event) =>
                      setRecentActivityForm((prev) => ({
                        ...prev,
                        achievement: event.target.value,
                      }))
                    }
                    placeholder="e.g. Deployed SyncIn MVP"
                    className="bg-gray-950/80 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-timeframe" className="font-inter text-sm text-gray-200">
                    When did that happen?
                  </Label>
                  <Input
                    id="activity-timeframe"
                    value={recentActivityForm.timeframe}
                    onChange={(event) =>
                      setRecentActivityForm((prev) => ({
                        ...prev,
                        timeframe: event.target.value,
                      }))
                    }
                    placeholder="e.g. 2 hours ago"
                    className="bg-gray-950/80 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-reward" className="font-inter text-sm text-gray-200">
                    Add a point reward (optional)
                  </Label>
                  <Input
                    id="activity-reward"
                    value={recentActivityForm.reward}
                    onChange={(event) =>
                      setRecentActivityForm((prev) => ({
                        ...prev,
                        reward: event.target.value,
                      }))
                    }
                    placeholder="e.g. +50 pts"
                    className="bg-gray-950/80 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <Button type="submit" className="bg-primary text-white font-inter">
                  Log activity
                </Button>
              </form>

              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-gray-500 font-inter text-sm">No activities recorded yet. Log something to get started.</p>
                ) : (
                  recentActivities.map((activity, index) => (
                    <div key={`${activity.achievement}-${index}`} className="flex items-start justify-between gap-4 border border-gray-800 rounded-xl p-5 bg-gray-950/60">
                      <div>
                        <p className="font-medium text-white font-inter">{activity.achievement}</p>
                        <p className="text-sm text-gray-400 font-inter">{activity.timeframe}</p>
                      </div>
                      {activity.reward && <span className="text-sm text-green-400 font-semibold">{activity.reward}</span>}
                    </div>
                  ))
                )}
              </div>
            </MagicCard>

            <MagicCard className="bg-gray-900 border border-gray-700 rounded-2xl p-8" enableMagnetism enableTilt>
              <h2 className="font-alata text-2xl font-bold text-white mb-4">Context & Personalisation</h2>
              <p className="text-gray-400 font-inter text-sm mb-6">
                Tell SyncIn more about your workflow so insights feel tailored to you.
              </p>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="platform" className="font-inter text-sm text-gray-200">
                    What platform do you usually solve problems on?
                  </Label>
                  <Input
                    id="platform"
                    value={personalization.platform}
                    onChange={(event) =>
                      setPersonalization((prev) => ({
                        ...prev,
                        platform: event.target.value,
                      }))
                    }
                    placeholder="e.g. LeetCode, Codeforces"
                    className="bg-gray-950/80 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-inter text-sm text-gray-200">
                    Do you prefer weekly or monthly progress summaries?
                  </Label>
                  <Select
                    value={personalization.summaryFrequency}
                    onValueChange={(value) =>
                      setPersonalization((prev) => ({
                        ...prev,
                        summaryFrequency: value,
                      }))
                    }
                  >
                    <SelectTrigger className="bg-gray-950/80 border-gray-700 text-white">
                      <SelectValue placeholder="Choose frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border border-gray-700 text-white">
                      <SelectItem value="week">Weekly summary</SelectItem>
                      <SelectItem value="month">Monthly summary</SelectItem>
                      <SelectItem value="quarter">Quarterly summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-inter text-sm text-gray-200">
                    What achievements motivate you most?
                  </Label>
                  <Select
                    value={personalization.motivationFocus}
                    onValueChange={(value) =>
                      setPersonalization((prev) => ({
                        ...prev,
                        motivationFocus: value,
                      }))
                    }
                  >
                    <SelectTrigger className="bg-gray-950/80 border-gray-700 text-white">
                      <SelectValue placeholder="Choose a focus" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border border-gray-700 text-white">
                      <SelectItem value="competitions">Competitions</SelectItem>
                      <SelectItem value="consistency">Consistency streaks</SelectItem>
                      <SelectItem value="learning">Learning new skills</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </MagicCard>
          </div>
        </div>
      </MagicCardGroup>
    </div>
  )
}
