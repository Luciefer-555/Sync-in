"use client"

import type { ChangeEvent, FormEvent } from "react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, RefreshCw, Send, Users, X } from "lucide-react"

type CollaborationStatus = "success" | "error"
type CollaborationAction = "create" | "join"

type MemberProfile = {
  profileId: string
  name: string
}

type CollaborationFormState = {
  projectName: string
  description: string
  hubCode: string
  selectedMembers: MemberProfile[]
}

type JoinHubFormState = {
  hubCode: string
  message: string
}

const sampleMembers: MemberProfile[] = [
  { profileId: "syncin@ENG101", name: "Aarav Patel" },
  { profileId: "syncin@CSE212", name: "Isha Sharma" },
  { profileId: "syncin@EEE087", name: "Rahul Menon" },
  { profileId: "syncin@ME231", name: "Neha Verma" },
  { profileId: "syncin@CIV145", name: "Karthik Rao" },
  { profileId: "syncin@BIZ019", name: "Maria D'Souza" },
]

const generateHubCode = () => `HUB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

const initialCreateForm: CollaborationFormState = {
  projectName: "",
  description: "",
  hubCode: generateHubCode(),
  selectedMembers: [],
}

export default function CollaborationHub() {
  const [action, setAction] = useState<CollaborationAction>("create")
  const [createForm, setCreateForm] = useState<CollaborationFormState>(initialCreateForm)
  const [joinForm, setJoinForm] = useState<JoinHubFormState>({ hubCode: "", message: "" })
  const [feedback, setFeedback] = useState<{ type: CollaborationStatus; message: string } | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [memberQuery, setMemberQuery] = useState("")

  const projects = [
    { id: 1, name: "AI Chat Application", members: 4, status: "Active" },
    { id: 2, name: "E-commerce Platform", members: 6, status: "Active" },
    { id: 3, name: "Data Analytics Tool", members: 3, status: "Planning" },
  ]

  const filteredMembers = useMemo(() => {
    const query = memberQuery.trim().toLowerCase()
    if (!query) return []

    return sampleMembers
      .filter(
        (member) =>
          member.profileId.toLowerCase().includes(query) || member.name.toLowerCase().includes(query)
      )
      .slice(0, 5)
  }, [memberQuery])

  const handleCreateChange = (field: keyof CollaborationFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setCreateForm((previous) => ({ ...previous, [field]: event.target.value }))
    }

  const handleGenerateCode = () => {
    const newCode = generateHubCode()
    setCreateForm((previous) => ({ ...previous, hubCode: newCode }))
    setFeedback(null)
  }

  const handleAddMember = (member: MemberProfile) => {
    setCreateForm((previous) => {
      if (previous.selectedMembers.some((existing) => existing.profileId === member.profileId)) {
        return previous
      }

      return {
        ...previous,
        selectedMembers: [...previous.selectedMembers, member],
      }
    })
    setMemberQuery("")
  }

  const handleRemoveMember = (profileId: string) => {
    setCreateForm((previous) => ({
      ...previous,
      selectedMembers: previous.selectedMembers.filter((member) => member.profileId !== profileId),
    }))
  }

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!createForm.projectName.trim() || !createForm.description.trim()) {
      setFeedback({ type: "error", message: "Provide a project name and description to create a hub." })
      return
    }

    setIsCreating(true)
    setFeedback(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setFeedback({
        type: "success",
        message: `Hub "${createForm.projectName}" is ready. Share code ${createForm.hubCode} with teammates for leader approval.`,
      })
      setCreateForm({ ...initialCreateForm, hubCode: generateHubCode() })
      setMemberQuery("")
    } catch (error) {
      console.error("Failed to create hub", error)
      setFeedback({ type: "error", message: "We couldn't create that hub right now. Try again in a moment." })
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!joinForm.hubCode.trim()) {
      setFeedback({ type: "error", message: "Enter the hub code shared by the leader." })
      return
    }

    setIsJoining(true)
    setFeedback(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setFeedback({
        type: "success",
        message: `Your request to join hub ${joinForm.hubCode.toUpperCase()} was sent to the leader for approval.`,
      })
      setJoinForm({ hubCode: "", message: "" })
    } catch (error) {
      console.error("Failed to request hub join", error)
      setFeedback({ type: "error", message: "We couldn't send that request. Please retry." })
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
        <header className="space-y-3">
          <h1 className="font-alata text-4xl font-bold text-white">Collaboration Hub</h1>
          <p className="font-inter text-sm text-white/70 md:text-base">
            Discover ongoing SyncIn projects, contribute your skills, and start new initiatives with peers who share your goals.
          </p>
        </header>

        {feedback && (
          <Card
            className={`border px-4 py-3 font-inter text-sm ${
              feedback.type === "success"
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                : "border-red-400/30 bg-red-400/10 text-red-100"
            }`}
          >
            {feedback.message}
          </Card>
        )}

        <section className="space-y-4">
          <h2 className="font-inter text-lg font-semibold text-white/80">Active initiatives</h2>
          {projects.map((project) => (
            <Card
              key={project.id}
              className="rounded-2xl border border-white/5 bg-black/40 p-6 backdrop-blur-sm transition-colors hover:border-white/10 hover:bg-black/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-inter text-xl font-semibold text-white">{project.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span>{project.members} members</span>
                    <span className="text-white/40">•</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs ${
                        project.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-blue-400/70 text-blue-200 transition-colors hover:border-blue-300 hover:bg-blue-500/10 hover:text-blue-100"
                >
                  View Project
                </Button>
              </div>
            </Card>
          ))}
        </section>

        <Card className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="mb-6 flex flex-wrap gap-3">
            <Button
              type="button"
              variant={action === "create" ? "default" : "secondary"}
              className="rounded-full"
              onClick={() => setAction("create")}
            >
              Create new hub
            </Button>
            <Button
              type="button"
              variant={action === "join" ? "default" : "secondary"}
              className="rounded-full"
              onClick={() => setAction("join")}
            >
              Join existing hub
            </Button>
          </div>

          {action === "create" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-inter text-lg font-semibold text-white">Launch a new collaboration hub</h2>
                <p className="font-inter text-sm text-white/70">
                  Set up your project hub, generate a unique join code, and shortlist teammates using their SyncIn IDs.
                </p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <Input
                  required
                  value={createForm.projectName}
                  onChange={handleCreateChange("projectName")}
                  placeholder="Project name"
                  className="rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                  disabled={isCreating}
                />

                <Textarea
                  required
                  value={createForm.description}
                  onChange={handleCreateChange("description")}
                  placeholder="Describe the project vision, goals, and the kind of collaborators you need."
                  className="min-h-[140px] rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                  disabled={isCreating}
                />

                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <Input
                    readOnly
                    value={createForm.hubCode}
                    className="rounded-xl border-white/20 bg-black/60 text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 rounded-full border-white/20 text-white"
                    onClick={handleGenerateCode}
                    disabled={isCreating}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Generate new code
                  </Button>
                </div>
                <p className="font-inter text-xs text-white/60">
                  Share this code privately. Members still need the leader’s approval before joining.
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="font-inter text-sm text-white/80">Add members by SyncIn ID</p>
                    <p className="font-inter text-xs text-white/50">
                      Start typing a college ID to view saved profiles. We’ll auto-complete names from your institution’s
                      directory.
                    </p>
                  </div>
                  <div className="relative">
                    <Input
                      value={memberQuery}
                      onChange={(event) => setMemberQuery(event.target.value)}
                      placeholder="Search by college ID (e.g., syncin@ENG101)"
                      className="rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                      disabled={isCreating}
                    />
                    {memberQuery.trim() && (
                      <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-10 space-y-1 rounded-2xl border border-white/10 bg-black/90 p-3 shadow-xl">
                        {filteredMembers.length ? (
                          filteredMembers.map((member) => (
                            <button
                              key={member.profileId}
                              type="button"
                              className="flex w-full flex-col rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-left transition-colors hover:border-white/20 hover:bg-white/10"
                              onClick={() => handleAddMember(member)}
                              disabled={isCreating}
                            >
                              <span className="font-inter text-xs uppercase tracking-wide text-white/60">{member.profileId}</span>
                              <span className="font-inter text-sm text-white">{member.name}</span>
                            </button>
                          ))
                        ) : (
                          <p className="font-inter text-xs text-white/50">No profiles match that ID yet.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {createForm.selectedMembers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {createForm.selectedMembers.map((member) => (
                        <Badge
                          key={member.profileId}
                          variant="outline"
                          className="flex items-center gap-1 border-white/20 text-white/80"
                        >
                          {member.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.profileId)}
                            className="rounded-full p-0.5 text-white/60 transition-colors hover:text-white"
                            aria-label={`Remove ${member.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-inter text-xs text-white/60">
                    Leaders can review each applicant’s SyncIn profile before granting access to the hub.
                  </p>
                  <Button type="submit" className="gap-2 rounded-full" disabled={isCreating}>
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {isCreating ? "Creating hub" : "Create hub"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-inter text-lg font-semibold text-white">Join a hub with leader approval</h2>
                <p className="font-inter text-sm text-white/70">
                  Request access using the unique hub code. The leader can view your SyncIn profile details before
                  approving your spot.
                </p>
              </div>

              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <Input
                  required
                  value={joinForm.hubCode}
                  onChange={(event) => setJoinForm((previous) => ({ ...previous, hubCode: event.target.value }))}
                  placeholder="Enter hub code"
                  className="rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                  disabled={isJoining}
                />

                <Textarea
                  value={joinForm.message}
                  onChange={(event) => setJoinForm((previous) => ({ ...previous, message: event.target.value }))}
                  placeholder="Explain how you plan to contribute. The leader sees this note along with your profile."
                  className="min-h-[120px] rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                  disabled={isJoining}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-inter text-xs text-white/60">
                    Every request is routed to the hub leader. You’ll be notified once they approve your access.
                  </p>
                  <Button type="submit" className="gap-2 rounded-full" disabled={isJoining}>
                    {isJoining ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {isJoining ? "Requesting access" : "Request to join"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
