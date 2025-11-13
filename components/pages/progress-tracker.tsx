"use client"

import { useMemo, useState } from "react"
import { Github, ExternalLink, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePrepProgress } from "@/components/providers/prep-progress-provider"

type GitHubRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
}

type FetchState = "idle" | "loading" | "success" | "error"

function extractGithubUsername(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  if (trimmed.includes("github.com")) {
    try {
      const normalized = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
      const url = new URL(normalized)
      const segments = url.pathname.split("/").filter(Boolean)
      return segments[0] ?? null
    } catch {
      return null
    }
  }

  const parts = trimmed.split("/").filter(Boolean)
  return parts[0] ?? null
}

export default function ProgressTracker() {
  const [githubLink, setGithubLink] = useState("")
  const [gfgLink, setGfgLink] = useState("")
  const [linkedinLink, setLinkedinLink] = useState("")
  const [submittedGithubLink, setSubmittedGithubLink] = useState<string | null>(null)
  const [submittedGfgLink, setSubmittedGfgLink] = useState<string | null>(null)
  const [submittedLinkedinLink, setSubmittedLinkedinLink] = useState<string | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [fetchState, setFetchState] = useState<FetchState>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<{
    name?: string
    headline?: string
    location?: string
    summary?: string
    skills?: string[]
  } | null>(null)

  const { solvedCount, countsByDifficulty, countsBySubject, countsByType, solvedQuestions } = usePrepProgress()

  const recentSolved = useMemo(() => {
    return [...solvedQuestions]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
  }, [solvedQuestions])

  const extractLinkedInUsername = (url: string): string | null => {
    try {
      const regex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub|company)\/?([^\/\?&]+)/i;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setFetchState("loading");

    try {
      // Handle GitHub
      const githubUsername = extractGithubUsername(githubLink);
      if (githubUsername) {
        const githubResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`);
        if (!githubResponse.ok) {
          throw new Error(githubResponse.status === 404 
            ? "GitHub profile not found." 
            : "Failed to fetch GitHub repositories.");
        }
        const reposData = await githubResponse.json();
        setRepos(reposData);
        setSubmittedGithubLink(githubLink.trim());
      }

      // Handle LinkedIn
      const linkedinUsername = extractLinkedInUsername(linkedinLink);
      if (linkedinUsername) {
        // In a real app, you would call your backend API here
        // For now, we'll just store the link
        setSubmittedLinkedinLink(linkedinLink.trim());
        
        // Mock profile data - in a real app, this would come from your backend
        // which would use the LinkedIn API with proper authentication
        setProfileData({
          name: "John Doe",
          headline: "Software Engineer at Tech Company",
          location: "San Francisco, California",
          summary: "Passionate about building great software and solving complex problems.",
          skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python"]
        });
      }

      // Handle GeeksforGeeks
      if (gfgLink.trim()) {
        setSubmittedGfgLink(gfgLink.trim());
      }

      setFetchState("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setFetchState("error");
    }
  };

  return (
    <div className="pt-24 px-6 pb-12 max-w-5xl mx-auto w-full">
      <header className="mb-10 space-y-3">
        <h1 className="font-alata text-4xl font-bold text-foreground">Progress Tracker</h1>
        <p className="text-muted-foreground font-inter text-base">
          Link your public profiles so SyncIn can surface your recent GitHub projects alongside your academic journey.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="bg-card border-border/60 rounded-3xl p-8 shadow-lg shadow-primary/5">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="github-link" className="font-semibold font-inter text-sm uppercase tracking-wide text-muted-foreground">
                GitHub Profile
              </Label>
              <Input
                id="github-link"
                placeholder="https://github.com/username"
                value={githubLink}
                onChange={(event) => setGithubLink(event.target.value)}
                required
                className="h-12 rounded-2xl border-border/60 bg-background/80 px-4 font-inter"
              />
              <p className="text-xs text-muted-foreground/80">
                We’ll fetch your public repositories and display them below. Only public information is used.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gfg-link" className="font-semibold font-inter text-sm uppercase tracking-wide text-muted-foreground">
                GeeksforGeeks Profile
              </Label>
              <Input
                id="gfg-link"
                placeholder="https://auth.geeksforgeeks.org/user/..."
                value={gfgLink}
                onChange={(event) => setGfgLink(event.target.value)}
                className="h-12 rounded-2xl border-border/60 bg-background/80 px-4 font-inter"
              />
              <p className="text-xs text-muted-foreground/80">
                We'll keep this link handy so mentors can review your coding streaks and problem history.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin-link" className="font-semibold font-inter text-sm uppercase tracking-wide text-muted-foreground">
                LinkedIn Profile
              </Label>
              <Input
                id="linkedin-link"
                placeholder="https://www.linkedin.com/in/username"
                value={linkedinLink}
                onChange={(event) => setLinkedinLink(event.target.value)}
                className="h-12 rounded-2xl border-border/60 bg-background/80 px-4 font-inter"
              />
              <p className="text-xs text-muted-foreground/80">
                Connect your LinkedIn profile to enhance your SyncIn experience.
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm font-inter text-red-200">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={fetchState === "loading"}
              className="w-full h-12 rounded-2xl font-inter font-semibold text-lg"
            >
              {fetchState === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Fetching projects...
                </span>
              ) : (
                "Link profiles"
              )}
            </Button>
          </form>
        </Card>

        <div className="space-y-5">
          <Card className="bg-muted/40 border-border/40 rounded-3xl p-6 space-y-4">
            <h2 className="font-inter text-lg font-semibold text-foreground">Linked accounts</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-background/60 px-4 py-3">
                <span className="flex items-center gap-2 font-medium">
                  <Github className="h-4 w-4" /> GitHub
                </span>
                {submittedGithubLink ? (
                  <a
                    href={submittedGithubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    View<ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not linked</span>
                )}
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-background/60 px-4 py-3">
                <span className="font-medium">GeeksforGeeks</span>
                {submittedGfgLink ? (
                  <a
                    href={submittedGfgLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    View<ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Optional</span>
                )}
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-background/60 px-4 py-3">
                <span className="flex items-center gap-2 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </span>
                {submittedLinkedinLink ? (
                  <a
                    href={submittedLinkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    View<ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Connect</span>
                )}
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border/50 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-inter text-lg font-semibold text-foreground">Interview prep progress</h2>
                <p className="text-xs text-muted-foreground">Data synced from your Prep workspace.</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {solvedCount} solved
              </span>
            </div>
            <div className="grid gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">By difficulty</p>
                <div className="mt-2 space-y-1">
                  {Object.keys(countsByDifficulty).length === 0 && <p>No data yet.</p>}
                  {Object.entries(countsByDifficulty).map(([difficulty, count]) => (
                    <div key={difficulty} className="flex items-center justify-between rounded-xl bg-background/60 px-3 py-2">
                      <span>{difficulty}</span>
                      <span className="font-semibold text-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-foreground">Top subjects</p>
                <div className="mt-2 space-y-1">
                  {Object.keys(countsBySubject).length === 0 && <p>Start solving to populate this.</p>}
                  {Object.entries(countsBySubject)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([subject, count]) => (
                      <div key={subject} className="flex items-center justify-between rounded-xl bg-background/60 px-3 py-2">
                        <span>{subject}</span>
                        <span className="font-semibold text-foreground">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-foreground">By question type</p>
                <div className="mt-2 space-y-1">
                  {Object.keys(countsByType).length === 0 && <p>Add a solved question to see breakdowns.</p>}
                  {Object.entries(countsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between rounded-xl bg-background/60 px-3 py-2">
                      <span>{type}</span>
                      <span className="font-semibold text-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {profileData && (
        <section className="mt-12 space-y-6">
          <header className="space-y-2">
            <h2 className="font-inter text-2xl font-semibold text-foreground">Professional Profile</h2>
            <p className="text-sm text-muted-foreground">Your professional information from LinkedIn</p>
          </header>
          <Card className="rounded-3xl border-border/50 bg-card/70 p-6">
            <div className="flex items-start gap-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground">{profileData.name}</h3>
                <p className="text-muted-foreground">{profileData.headline}</p>
                <p className="text-sm text-muted-foreground/80 mt-1">{profileData.location}</p>
                
                {profileData.skills && profileData.skills.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Top Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <span key={index} className="text-xs bg-background/60 text-foreground/80 rounded-full px-3 py-1">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {profileData.summary && (
              <div className="mt-6 pt-6 border-t border-border/40">
                <h4 className="text-sm font-medium text-foreground mb-2">About</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{profileData.summary}</p>
              </div>
            )}
          </Card>
        </section>
      )}

      <section className="mt-12 space-y-6">
        <header className="space-y-2">
          <h2 className="font-inter text-2xl font-semibold text-foreground">GitHub projects</h2>
          <p className="text-sm text-muted-foreground">We highlight the repositories from your linked GitHub account. Private repositories remain hidden.</p>
        </header>

        {fetchState === "idle" && (
          <Card className="rounded-3xl border-dashed border-border/60 bg-background/40 p-8 text-muted-foreground">
            <p className="font-inter text-sm">
              Enter your GitHub profile link above to see your recent projects at a glance.
            </p>
          </Card>
        )}

        {fetchState === "success" && repos.length === 0 && (
          <Card className="rounded-3xl border-border/60 bg-background/40 p-8 text-muted-foreground">
            <p className="font-inter text-sm">We couldn’t find any public repositories for this GitHub profile yet.</p>
          </Card>
        )}

        {fetchState === "success" && repos.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {repos.map((repo) => (
              <Card key={repo.id} className="rounded-3xl border-border/50 bg-card/70 p-6 transition-shadow hover:shadow-lg hover:shadow-primary/10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-inter text-lg font-semibold text-foreground">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {repo.name}
                      </a>
                    </h3>
                    {repo.language && (
                      <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary/80">
                        {repo.language}
                      </span>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground/80">
                    <p>⭐ {repo.stargazers_count}</p>
                    <p>🍴 {repo.forks_count}</p>
                  </div>
                </div>
                {repo.description && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {repo.description}
                  </p>
                )}
                <p className="mt-4 text-xs text-muted-foreground/70">
                  Updated on {new Date(repo.updated_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </Card>
            ))}
          </div>
        )}

        {fetchState === "loading" && (
          <div className="grid gap-5 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="animate-pulse rounded-3xl border-border/40 bg-background/40 p-6">
                <div className="h-5 w-3/5 rounded-full bg-border/60" />
                <div className="mt-4 h-4 w-full rounded-full bg-border/40" />
                <div className="mt-2 h-4 w-2/3 rounded-full bg-border/40" />
                <div className="mt-6 h-3 w-1/3 rounded-full bg-border/50" />
              </Card>
            ))}
          </div>
        )}

        {fetchState === "error" && errorMessage && (
          <Card className="rounded-3xl border border-red-400/40 bg-red-400/10 p-6 text-sm font-inter text-red-200">
            {errorMessage}
          </Card>
        )}
      </section>

      <section className="mt-12 space-y-4">
        <header className="space-y-1">
          <h2 className="font-inter text-2xl font-semibold text-foreground">Recently solved interview questions</h2>
          <p className="text-sm text-muted-foreground">Track what you’ve completed in the Prep workspace and identify the next focus areas.</p>
        </header>
        {recentSolved.length === 0 ? (
          <Card className="rounded-3xl border-dashed border-border/60 bg-background/40 p-8 text-muted-foreground">
            <p className="font-inter text-sm">Mark questions as solved in the Prep tab to see them listed here.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recentSolved.map((question) => (
              <Card key={question.id} className="rounded-3xl border-border/50 bg-card/70 p-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(question.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                  {question.difficulty && <span className="rounded-full bg-primary/10 px-2 py-1 text-primary/80">{question.difficulty}</span>}
                </div>
                <h3 className="mt-2 font-inter text-base font-semibold text-foreground">{question.title}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {question.subject && <span className="rounded-full bg-background/60 px-2 py-1">{question.subject}</span>}
                  {question.questionType && <span className="rounded-full bg-background/60 px-2 py-1">{question.questionType}</span>}
                  {question.companies?.slice(0, 2).map((company) => (
                    <span key={company} className="rounded-full bg-background/60 px-2 py-1">
                      {company}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
