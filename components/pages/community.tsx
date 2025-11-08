"use client"

import { Card } from "@/components/ui/card"
import { MessageSquare, Heart } from "lucide-react"

export default function Community() {
  const posts = [
    {
      id: 1,
      author: "Alex Kumar",
      content: "Just completed my first hackathon! Excited to share learnings.",
      likes: 234,
      replies: 12,
    },
    {
      id: 2,
      author: "Sarah Chen",
      content: "Looking for collaborators for an AI project. Anyone interested?",
      likes: 156,
      replies: 28,
    },
    {
      id: 3,
      author: "Mike Johnson",
      content: "Tips for acing system design interviews - thread 🧵",
      likes: 892,
      replies: 145,
    },
  ]

  return (
    <div className="pt-24 px-8 pb-8 bg-black text-white min-h-screen">
      <h1 className="font-alata text-4xl font-bold text-white mb-8">Community</h1>

      <div className="max-w-2xl space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="bg-gray-900 border-gray-700 p-6 rounded-2xl hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400">
                <span className="font-alata">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-inter font-semibold text-white">{post.author}</h3>
                <p className="font-inter text-gray-400 text-sm">2h ago</p>
              </div>
            </div>
            <p className="font-inter text-gray-200 mb-4">{post.content}</p>
            <div className="flex items-center gap-6 text-gray-400">
              <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">{post.replies} replies</span>
              </button>
              <button className="flex items-center gap-2 hover:text-red-400 transition-colors">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{post.likes} likes</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
