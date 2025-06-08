"use client"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPageClient() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt") || undefined
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatInterface initialPrompt={initialPrompt} />
    </Suspense>
  )
} 