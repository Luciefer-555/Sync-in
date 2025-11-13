"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  MessageSquare,
  Send,
  Users,
  UserPlus,
  CalendarClock,
  ShieldCheck,
} from "lucide-react"

interface CommunityComment {
  commentId: string
  authorProfileId: string
  text: string
  createdAt: string
}

interface CommunityPost {
  postId: string
  authorProfileId: string
  content: string
  createdAt: string
  reactions: number
  comments: CommunityComment[]
}

interface CommunityMember {
  profileId: string
  username: string
  collegeId: string
  collegeName: string
  skills: string[]
  role: string
  joinedAt: string
}

interface RegisterFormState {
  username: string
  email: string
  phone: string
  collegeId: string
  collegeName: string
  skills: string
  role: "student" | "mentor" | "admin"
}

interface StatusMessage {
  type: "success" | "error" | "info"
  message: string
}

const initialRegisterForm: RegisterFormState = {
  username: "",
  email: "",
  phone: "",
  collegeId: "",
  collegeName: "",
  skills: "",
  role: "student",
}

function formatDateTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Just now"
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export default function Community() {
  const [registerForm, setRegisterForm] = useState<RegisterFormState>(initialRegisterForm)
  const [profile, setProfile] = useState<CommunityMember | null>(null)
  const [existingProfile, setExistingProfile] = useState({ profileId: "", collegeId: "" })
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [loadingFeed, setLoadingFeed] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [submittingPost, setSubmittingPost] = useState(false)
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({})
  const [newPostContent, setNewPostContent] = useState("")
  const [status, setStatus] = useState<StatusMessage | null>(null)
  const [joiningCommunity, setJoiningCommunity] = useState(false)

  const memberLookup = useMemo(() => {
    const lookup = new Map<string, CommunityMember>()
    members.forEach(member => lookup.set(member.profileId, member))
    return lookup
  }, [members])

  const isMember = profile ? members.some(member => member.profileId === profile.profileId) : false

  const loadMembers = useCallback(async () => {
    if (!profile?.collegeId) return
    setLoadingMembers(true)
    try {
      const response = await fetch(`/api/community/${profile.collegeId}/members`)
      const json = await response.json()
      if (json.success) {
        const fetchedMembers: CommunityMember[] = (json.data ?? []).map((member: any) => ({
          profileId: member.profileId,
          username: member.username,
          collegeId: member.collegeId,
          collegeName: member.collegeName,
          skills: member.skills ?? [],
          role: member.role,
          joinedAt: member.joinedAt,
        }))
        setMembers(fetchedMembers)

        if (profile) {
          const hydrated = fetchedMembers.find(member => member.profileId === profile.profileId)
          if (hydrated) {
            setProfile(hydrated)
          }
        }
      } else {
        setMembers([])
      }
    } catch (error) {
      console.error("Failed to fetch members", error)
      setMembers([])
      setStatus({ type: "error", message: "Unable to load community members." })
    } finally {
      setLoadingMembers(false)
    }
  }, [profile])

  const loadCommunity = useCallback(async () => {
    if (!profile?.collegeId) return
    setLoadingFeed(true)
    try {
      const response = await fetch(`/api/community/${profile.collegeId}`)
      const json = await response.json()
      if (json.success) {
        const fetchedPosts: CommunityPost[] = (json.data?.posts ?? []).map((post: any) => ({
          postId: post.postId,
          authorProfileId: post.authorProfileId,
          content: post.content,
          createdAt: post.createdAt,
          reactions: post.reactions ?? 0,
          comments: (post.comments ?? []).map((comment: any) => ({
            commentId: comment.commentId,
            authorProfileId: comment.authorProfileId,
            text: comment.text,
            createdAt: comment.createdAt,
          })),
        }))
        setPosts(fetchedPosts)
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error("Failed to fetch community feed", error)
      setPosts([])
      setStatus({ type: "error", message: "Unable to load the community feed." })
    } finally {
      setLoadingFeed(false)
    }
  }, [profile?.collegeId])

  useEffect(() => {
    if (!profile?.collegeId) return
    loadMembers()
    loadCommunity()
  }, [profile?.collegeId, loadMembers, loadCommunity])

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(null)

    const skillList = registerForm.skills
      .split(",")
      .map(value => value.trim())
      .filter(Boolean)

    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerForm.username,
          email: registerForm.email,
          phone: registerForm.phone,
          collegeId: registerForm.collegeId,
          collegeName: registerForm.collegeName,
          skills: skillList,
          role: registerForm.role,
        }),
      })

      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "Failed to register user")
      }

      const registered: CommunityMember = {
        profileId: json.user.profileId,
        username: json.user.username,
        collegeId: json.user.collegeId,
        collegeName: json.user.collegeName,
        skills: json.user.skills ?? [],
        role: json.user.role,
        joinedAt: json.user.joinedAt,
      }

      setProfile(registered)
      setStatus({ type: "success", message: `Welcome to SyncIn community! Your profile ID is ${registered.profileId}.` })
      await loadMembers()
      await loadCommunity()
    } catch (error) {
      console.error("Failed to register", error)
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to register. Please try again." })
    }
  }

  const handleUseExistingProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!existingProfile.collegeId || !existingProfile.profileId) {
      setStatus({ type: "error", message: "Provide both college ID and profile ID to continue." })
      return
    }

    setStatus(null)

    try {
      const response = await fetch(`/api/community/${existingProfile.collegeId}/members`)
      const json = await response.json()
      if (!json.success) {
        throw new Error(json.error ?? "Unable to locate your community.")
      }

      const matched: CommunityMember | undefined = (json.data ?? []).find(
        (member: any) => member.profileId === existingProfile.profileId
      )

      if (!matched) {
        throw new Error("We couldn't find that profile ID for the selected college.")
      }

      const existingMember: CommunityMember = {
        profileId: matched.profileId,
        username: matched.username,
        collegeId: matched.collegeId,
        collegeName: matched.collegeName,
        skills: matched.skills ?? [],
        role: matched.role,
        joinedAt: matched.joinedAt,
      }

      setProfile(existingMember)
      setMembers((json.data ?? []).map((member: any) => ({
        profileId: member.profileId,
        username: member.username,
        collegeId: member.collegeId,
        collegeName: member.collegeName,
        skills: member.skills ?? [],
        role: member.role,
        joinedAt: member.joinedAt,
      })))
      setStatus({ type: "success", message: `Welcome back, ${existingMember.username}!` })
      await loadCommunity()
    } catch (error) {
      console.error("Failed to load existing profile", error)
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to load your profile." })
    }
  }

  const handleJoinCommunity = async () => {
    if (!profile?.profileId || !profile.collegeId) return

    setJoiningCommunity(true)
    setStatus(null)
    try {
      const response = await fetch(`/api/community/${profile.collegeId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.profileId,
          collegeName: profile.collegeName,
        }),
      })

      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "Unable to join community.")
      }

      await loadMembers()
      setStatus({ type: "success", message: `You're now part of the ${profile.collegeName} community.` })
    } catch (error) {
      console.error("Failed to join community", error)
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to join community." })
    } finally {
      setJoiningCommunity(false)
    }
  }

  const handlePostSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!profile?.profileId || !profile.collegeId) return
    const body = newPostContent.trim()
    if (!body) return

    setSubmittingPost(true)
    setStatus(null)

    try {
      const response = await fetch(`/api/community/${profile.collegeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorProfileId: profile.profileId,
          content: body,
          collegeName: profile.collegeName,
        }),
      })

      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "Failed to publish post")
      }

      setNewPostContent("")
      await loadCommunity()
      setStatus({ type: "success", message: "Post shared with your college community." })
    } catch (error) {
      console.error("Failed to create post", error)
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to create post." })
    } finally {
      setSubmittingPost(false)
    }
  }

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>, postId: string) => {
    event.preventDefault()
    if (!profile?.profileId || !profile.collegeId) return
    const text = commentDrafts[postId]?.trim()
    if (!text) return

    setSubmittingComment(prev => ({ ...prev, [postId]: true }))
    setStatus(null)

    try {
      const response = await fetch(`/api/community/${profile.collegeId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          authorProfileId: profile.profileId,
          text,
        }),
      })

      const json = await response.json()
      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "Failed to add comment")
      }

      setCommentDrafts(prev => ({ ...prev, [postId]: "" }))
      await loadCommunity()
    } catch (error) {
      console.error("Failed to create comment", error)
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to add comment." })
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }))
    }
  }

  const resolveDisplayName = (profileId: string) => {
    if (profileId === profile?.profileId) return "You"
    return memberLookup.get(profileId)?.username ?? profileId
  }

  const roleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "mentor":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <header className="space-y-3">
          <h1 className="font-alata text-4xl font-bold tracking-tight">Community</h1>
          <p className="font-inter text-sm text-white/70 md:text-base">
            A private space for your college. Share updates, collaborate with peers, and discover opportunities—all without exposing phone numbers or email addresses.
          </p>
        </header>

        {status && (
          <Card
            className={`border ${
              status.type === "success"
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                : status.type === "error"
                  ? "border-red-400/40 bg-red-400/10 text-red-100"
                  : "border-blue-400/40 bg-blue-400/10 text-blue-100"
            } px-4 py-3 font-inter text-sm`}
          >
            {status.message}
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            {profile ? (
              <Card className="space-y-4 border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-inter text-sm uppercase tracking-widest text-white/50">Posting as</p>
                    <h2 className="font-inter text-xl font-semibold text-white">
                      {profile.username} <span className="text-white/60">({profile.profileId})</span>
                    </h2>
                    <p className="font-inter text-sm text-white/60">
                      {profile.collegeName} • Joined {formatDateTime(profile.joinedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={roleBadgeVariant(profile.role)} className="font-inter uppercase tracking-wide">
                      {profile.role}
                    </Badge>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="rounded-full"
                      disabled={joiningCommunity || isMember}
                      onClick={handleJoinCommunity}
                    >
                      {isMember ? "Member" : joiningCommunity ? "Joining..." : "Join community"}
                    </Button>
                  </div>
                </div>

                <form onSubmit={handlePostSubmit} className="space-y-3">
                  <Textarea
                    value={newPostContent}
                    onChange={event => setNewPostContent(event.target.value)}
                    placeholder="Share a project update, opportunity, or discussion topic with your college..."
                    className="min-h-28 rounded-2xl border-white/10 bg-black/30 text-white placeholder:text-white/40"
                    disabled={submittingPost}
                  />
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>Posts are visible only to verified members of {profile.collegeName}.</span>
                    <Button type="submit" disabled={submittingPost || !newPostContent.trim()} className="gap-2 rounded-full">
                      {submittingPost ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Share update
                    </Button>
                  </div>
                </form>
              </Card>
            ) : (
              <Card className="border-dashed border-white/20 bg-white/5 p-6 text-center backdrop-blur">
                <h2 className="font-inter text-lg font-semibold text-white">Join your community</h2>
                <p className="mt-2 font-inter text-sm text-white/70">
                  Register or link an existing profile to view posts from your college and start contributing.
                </p>
              </Card>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/70">
                <MessageSquare className="h-4 w-4" />
                <h3 className="font-inter text-sm uppercase tracking-wide">Latest posts</h3>
              </div>

              {loadingFeed ? (
                <div className="grid gap-4">
                  {[...Array(3)].map((_, index) => (
                    <Card key={index} className="h-36 animate-pulse border-white/10 bg-white/5" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <Card className="border-white/10 bg-white/5 p-6 text-center">
                  <p className="font-inter text-sm text-white/60">No posts yet. Be the first to share something with your community!</p>
                </Card>
              ) : (
                <div className="space-y-5">
                  {posts.map(post => (
                    <Card key={post.postId} className="space-y-4 border-white/10 bg-black/40 p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-inter text-base font-semibold text-white">{resolveDisplayName(post.authorProfileId)}</p>
                          <p className="font-inter text-xs text-white/50">{post.authorProfileId}</p>
                        </div>
                        <span className="font-inter text-xs text-white/60">{formatDateTime(post.createdAt)}</span>
                      </div>

                      <p className="font-inter text-sm leading-relaxed text-white/85">{post.content}</p>

                      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/60">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {post.comments.length} comments
                        </div>

                        {post.comments.length > 0 ? (
                          <div className="space-y-3">
                            {post.comments.map(comment => (
                              <div
                                key={comment.commentId}
                                className="rounded-2xl border border-white/10 bg-black/40 p-3"
                              >
                                <div className="flex items-center justify-between text-xs text-white/60">
                                  <span className="font-semibold text-white/80">{resolveDisplayName(comment.authorProfileId)}</span>
                                  <span>{formatDateTime(comment.createdAt)}</span>
                                </div>
                                <p className="mt-1 font-inter text-sm text-white/80">{comment.text}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="font-inter text-xs text-white/50">No comments yet—start the conversation!</p>
                        )}

                        {profile && (
                          <form
                            onSubmit={event => handleCommentSubmit(event, post.postId)}
                            className="flex flex-col gap-3"
                          >
                            <Textarea
                              value={commentDrafts[post.postId] ?? ""}
                              onChange={event =>
                                setCommentDrafts(prev => ({ ...prev, [post.postId]: event.target.value }))
                              }
                              placeholder="Add a supportive note or question..."
                              className="min-h-20 rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/40"
                              disabled={submittingComment[post.postId]}
                            />
                            <div className="flex items-center justify-end">
                              <Button
                                type="submit"
                                className="gap-2 rounded-full"
                                disabled={submittingComment[post.postId] || !(commentDrafts[post.postId] ?? "").trim()}
                              >
                                {submittingComment[post.postId] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                                Comment
                              </Button>
                            </div>
                          </form>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-2 text-white/70">
                <UserPlus className="h-4 w-4" />
                <h3 className="font-inter text-sm uppercase tracking-wide">Register new profile</h3>
              </div>
              <p className="mt-2 font-inter text-xs text-white/60">
                Create a SyncIn community identity. Your profile ID keeps you discoverable without sharing contact details.
              </p>
              <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3">
                <Input
                  required
                  value={registerForm.username}
                  onChange={event => setRegisterForm(prev => ({ ...prev, username: event.target.value }))}
                  placeholder="Full name"
                  className="rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                />
                <Input
                  required
                  type="email"
                  value={registerForm.email}
                  onChange={event => setRegisterForm(prev => ({ ...prev, email: event.target.value }))}
                  placeholder="College email"
                  className="rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                />
                <Input
                  required
                  value={registerForm.phone}
                  onChange={event => setRegisterForm(prev => ({ ...prev, phone: event.target.value }))}
                  placeholder="Contact number"
                  className="rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                />
                <Input
                  required
                  value={registerForm.collegeId}
                  onChange={event => setRegisterForm(prev => ({ ...prev, collegeId: event.target.value }))}
                  placeholder="College ID (e.g., NITD123)"
                  className="rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                />
                <Input
                  required
                  value={registerForm.collegeName}
                  onChange={event => setRegisterForm(prev => ({ ...prev, collegeName: event.target.value }))}
                  placeholder="College name"
                  className="rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                />
                <Input
                  value={registerForm.skills}
                  onChange={event => setRegisterForm(prev => ({ ...prev, skills: event.target.value }))}
                  placeholder="Skills (comma separated)"
                  className="rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                />
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 rounded-full">Generate profile ID</Button>
                </div>
              </form>
            </Card>

            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-2 text-white/70">
                <ShieldCheck className="h-4 w-4" />
                <h3 className="font-inter text-sm uppercase tracking-wide">Already registered?</h3>
              </div>
              <p className="mt-2 font-inter text-xs text-white/60">
                Enter your profile ID and college ID to reconnect with your community.
              </p>
              <form onSubmit={handleUseExistingProfile} className="mt-4 space-y-3">
                <Input
                  required
                  value={existingProfile.profileId}
                  onChange={event => setExistingProfile(prev => ({ ...prev, profileId: event.target.value }))}
                  placeholder="Profile ID (e.g., syncin@QTR341)"
                  className="rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                />
                <Input
                  required
                  value={existingProfile.collegeId}
                  onChange={event => setExistingProfile(prev => ({ ...prev, collegeId: event.target.value }))}
                  placeholder="College ID"
                  className="rounded-xl border-white/20 bg-black/40 text-white placeholder:text-white/40"
                />
                <Button type="submit" variant="secondary" className="w-full rounded-full">
                  Link existing profile
                </Button>
              </form>
            </Card>

            <Card className="border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-2 text-white/70">
                <Users className="h-4 w-4" />
                <h3 className="font-inter text-sm uppercase tracking-wide">Members in your college</h3>
              </div>
              <p className="mt-2 font-inter text-xs text-white/60">
                Discover collaborators by profile ID—no emails or phone numbers are ever shared.
              </p>
              <ScrollArea className="mt-4 h-[320px] pr-2">
                {loadingMembers ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
                    ))}
                  </div>
                ) : members.length === 0 ? (
                  <p className="font-inter text-sm text-white/60">No members yet. Encourage your classmates to register!</p>
                ) : (
                  <div className="space-y-4">
                    {members.map(member => (
                      <div
                        key={member.profileId}
                        className="rounded-2xl border border-white/10 bg-black/30 p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="font-inter text-sm font-semibold text-white">{member.username}</p>
                            <p className="font-inter text-xs text-white/50">{member.profileId}</p>
                          </div>
                          <Badge variant={roleBadgeVariant(member.role)}>{member.role}</Badge>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-white/50">
                            <CalendarClock className="h-3.5 w-3.5" /> Joined {formatDateTime(member.joinedAt)}
                          </div>
                          {member.skills?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {member.skills.map(skill => (
                                <Badge key={`${member.profileId}-${skill}`} variant="outline" className="border-white/10 text-white/70">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="font-inter text-xs text-white/50">No skills listed yet.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
