"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Sparkles } from "lucide-react"

export default function Chatbar() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading) {
      setIsLoading(true)
      // Add a small delay for better UX feedback
      setTimeout(() => {
        router.push(`/chat?prompt=${encodeURIComponent(prompt)}`)
      }, 100)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Create a modern landing page for my startup..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="h-12 sm:h-14 text-base sm:text-lg pl-4 pr-12 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-violet-500 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200"
          required
          disabled={isLoading}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Sparkles className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <Button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className="h-12 sm:h-14 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-medium"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="hidden sm:inline">Creating...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Generate</span>
          </div>
        )}
      </Button>
    </form>
  )
}
