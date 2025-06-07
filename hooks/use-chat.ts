"use client"

import { useState } from "react"
import { useChat as useVercelChat } from "ai/react"
import { toast } from "@/components/ui/use-toast"

interface Message {
  role: "user" | "assistant"
  content: string
  code?: string
  timestamp: number
}

interface ChatResponse {
  message: string
  hasCode: boolean
  code?: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])

  const { input, handleInputChange, handleSubmit: handleVercelSubmit, isLoading, append } = useVercelChat({
    api: "/api/chat",
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
    onFinish: (message) => {
      try {
        const response = JSON.parse(message.content) as ChatResponse
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.message,
            code: response.hasCode ? response.code : undefined,
            timestamp: Date.now(),
          },
        ])
      } catch (error) {
        // If parsing fails, treat the entire response as a message
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: message.content,
            timestamp: Date.now(),
          },
        ])
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
        timestamp: Date.now(),
      },
    ])

    // Handle the chat submission
    await handleVercelSubmit(e)
  }

  // Programmatically send a message
  const sendMessage = async (message: string) => {
    if (!message.trim()) return
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
        timestamp: Date.now(),
      },
    ])
    await append({ content: message, role: "user" })
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    sendMessage,
  }
} 