import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ChatInterface } from "@/components/chat/chat-interface"
import { useSearchParams } from "next/navigation"
import ChatPageClient from "@/components/chat/chat-page-client"

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPageClient />
    </Suspense>
  )
} 