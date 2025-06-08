"use client"
import { useRouter } from "next/navigation"
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts"

export function SuggestedPromptsSection() {
  const router = useRouter()
  const handlePromptSelect = (prompt: string) => {
    router.push(`/chat?prompt=${encodeURIComponent(prompt)}`)
  }
  return <SuggestedPrompts onPromptSelect={handlePromptSelect} disabled={false} />
} 