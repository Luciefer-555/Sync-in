"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Globe } from "lucide-react"

export default function Hackathons() {
  const onlineHackathons = [
    {
      id: 1,
      name: "Agentic AI Unleashed: AWS & NVIDIA Hackathon",
      dates: "October 13 – November 3, 2025",
      format: "Fully Virtual",
      focus: "Developing AI agents using AWS and NVIDIA tools",
      platform: "Devpost",
      link: "https://devpost.com",
    },
    {
      id: 2,
      name: "IBM TechXchange – Orchestrate What's Next with AI Agents",
      dates: "October 23 – November 3, 2025",
      format: "Virtual",
      focus: "Building AI agents using IBM watsonx Orchestrate",
      platform: "IBM",
      link: "https://ibm.com",
    },
    {
      id: 3,
      name: "Google Chrome Built-in AI Challenge 2025",
      dates: "September 9 – November 1, 2025",
      format: "Online",
      focus: "AI integration with Google Chrome",
      platform: "Devpost",
      link: "https://devpost.com",
    },
  ]

  const offlineHackathons = [
    {
      id: 4,
      name: "hackCBS 8.0",
      dates: "November 8–9, 2025",
      venue: "Shaheed Sukhdev College of Business Studies, Delhi",
      format: "In-person",
      details: "Asia's largest student-run hackathon featuring intensive development sessions",
      link: "https://hackcbs.tech",
    },
    {
      id: 5,
      name: "ATMOS 2025",
      dates: "November 7–9, 2025",
      venue: "BITS Pilani, Hyderabad Campus",
      format: "In-person",
      details: "Techno-management festival with workshops, exhibitions, and competitions",
      link: "https://wikipedia.org",
    },
    {
      id: 6,
      name: "Odoo Hackathon 2025",
      dates: "August 11–12, 2025",
      venue: "Gandhinagar, Gujarat",
      format: "Hybrid (Virtual and In-person)",
      details: "Final round for top 250 teams in ERP and business automation",
      link: "https://odoo.com",
    },
  ]

  const additionalEvents = [
    {
      id: 7,
      name: "Invest Kerala Global Summit",
      dates: "February 21–22, 2025",
      venue: "Kochi, Kerala",
      details: "Summit focusing on business opportunities and investments in Kerala",
      link: "https://wikipedia.org",
    },
    {
      id: 8,
      name: "TiE Global Summit 2026",
      dates: "January 4–6, 2026",
      venue: "Jaipur, Rajasthan",
      details: "Entrepreneurship summit with hackathons, startup pitches, and investor meets",
      link: "https://timesofindia.com",
    },
  ]

  return (
    <div className="pt-24 px-8 pb-8">
      <h1 className="font-alata text-4xl font-bold text-foreground mb-12">Hackathons & Events</h1>

      <div className="mb-12">
        <h2 className="font-alata text-2xl font-bold text-foreground mb-6">🌐 Online Hackathons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {onlineHackathons.map((hackathon) => (
            <Card
              key={hackathon.id}
              className="bg-card border-border p-6 rounded-2xl flex flex-col hover:border-primary/50 transition-colors"
            >
              <h3 className="font-inter font-semibold text-foreground text-lg mb-4">{hackathon.name}</h3>
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-start gap-2 text-muted-foreground font-inter text-sm">
                  <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{hackathon.dates}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground font-inter text-sm">
                  <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{hackathon.format}</span>
                </div>
                <p className="text-muted-foreground font-inter text-sm">{hackathon.focus}</p>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Visit {hackathon.platform}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="font-alata text-2xl font-bold text-foreground mb-6">🏢 Offline Hackathons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offlineHackathons.map((hackathon) => (
            <Card
              key={hackathon.id}
              className="bg-card border-border p-6 rounded-2xl flex flex-col hover:border-primary/50 transition-colors"
            >
              <h3 className="font-inter font-semibold text-foreground text-lg mb-4">{hackathon.name}</h3>
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-start gap-2 text-muted-foreground font-inter text-sm">
                  <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{hackathon.dates}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground font-inter text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{hackathon.venue}</span>
                </div>
                <p className="text-muted-foreground font-inter text-sm">{hackathon.details}</p>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Learn More</Button>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-alata text-2xl font-bold text-foreground mb-6">🗓️ Additional Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {additionalEvents.map((event) => (
            <Card
              key={event.id}
              className="bg-card border-border p-6 rounded-2xl flex flex-col hover:border-primary/50 transition-colors"
            >
              <h3 className="font-inter font-semibold text-foreground text-lg mb-4">{event.name}</h3>
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-start gap-2 text-muted-foreground font-inter text-sm">
                  <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{event.dates}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground font-inter text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{event.venue}</span>
                </div>
                <p className="text-muted-foreground font-inter text-sm">{event.details}</p>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Explore</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
