"use client"

import { Card } from "@/components/ui/card"

export default function AboutSyncIn() {
  return (
    <div className="pt-24 px-8 pb-8 bg-black text-white min-h-screen">
      <h1 className="font-alata text-4xl font-bold text-white mb-8">About SyncIn</h1>

      <div className="max-w-3xl space-y-6">
        <Card className="bg-gray-900 border-gray-700 p-8 rounded-2xl hover:bg-gray-800 transition-colors">
          <h2 className="font-alata text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="font-inter text-gray-300 leading-relaxed">
            SyncIn is built to support students in their technical and academic journeys. We believe in creating a
            platform that guides, connects, and adapts to each student's unique path to success.
          </p>
        </Card>

        <Card className="bg-gray-900 border-gray-700 p-8 rounded-2xl hover:bg-gray-800 transition-colors">
          <h2 className="font-alata text-2xl font-bold text-white mb-4">Key Features</h2>
          <ul className="space-y-3 font-inter text-gray-300">
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Academic tracking and progress monitoring</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Personalized dashboards and insights</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Problem statement discovery</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Hackathon spaces and opportunities</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Rich library of resources and research papers</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Community collaboration tools</li>
          </ul>
        </Card>

        <Card className="bg-gray-900 border-gray-700 p-8 rounded-2xl hover:bg-gray-800 transition-colors">
          <h2 className="font-alata text-2xl font-bold text-white mb-4">Community-Driven</h2>
          <p className="font-inter text-gray-300 leading-relaxed">
            Your feedback guides us in shaping SyncIn into a reliable, insightful, and community-driven companion for
            your college journey. We're excited to have you explore, contribute, and collaborate with us.
          </p>
        </Card>
      </div>
    </div>
  )
}
