"use client"

import { useState, useRef } from 'react'
import { Message } from 'ai'
import { toast } from '@/components/ui/use-toast'
import type { ChatRequestOptions, UseChatOptions } from 'ai'

export interface TextUIPart {
  type: 'text'
  text: string
}

export interface CodeUIPart {
  type: 'code'
  code: string
  language?: string
}

export type UIMessagePart = TextUIPart | CodeUIPart

export interface UIMessage extends Message {
  parts?: UIMessagePart[]
}

export function useChat(options: UseChatOptions = {}) {
  const { api = '/api/chat', ...rest } = options
  const [messages, setMessages] = useState<UIMessage[]>(options.initialMessages || [])
  const [input, setInput] = useState(options.initialInput || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    if (!input.trim()) return

    const userMessage: UIMessage = {
      id: Math.random().toString(36),
      role: 'user',
      content: input,
    }
    setMessages(prev => [...prev, userMessage])
    
    const currentInput = input
    setInput('')
    setIsLoading(true)
    setError(null)
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error((await response.text()) || 'Failed to fetch response')
      }

      if (!response.body) {
        throw new Error('Response body is empty')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantResponse = ''
      let assistantMessageId: string | null = null
      
      const newAssistantMessage: UIMessage = {
        id: Math.random().toString(36),
        role: 'assistant',
        content: '',
      }
      setMessages(prev => [...prev, newAssistantMessage])
      assistantMessageId = newAssistantMessage.id
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        assistantResponse += decoder.decode(value, { stream: true })
        
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: assistantResponse } 
            : msg
        ))
      }

      setMessages(prev => prev.map(msg => {
        if (msg.id === assistantMessageId) {
          try {
            // Since the API now guarantees a valid JSON response, we can parse it directly.
            const parsed = JSON.parse(assistantResponse);

            return {
              ...msg,
              content: parsed.parts?.find((p: any) => p.type === 'text')?.text || '',
              parts: parsed.parts,
            };
          } catch (e) {
            // This is now a true error case (e.g., network issue, API malfunction).
            console.error("Failed to parse guaranteed JSON:", e);
            console.error("Raw response was:", `"${assistantResponse}"`); 
            const errorText = "Error: Could not read the response from the AI.";
            return { 
              ...msg, 
              content: errorText,
              parts: [{ type: 'text', text: errorText }] 
            };
          }
        }
        return msg;
      }))

    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setError(error)
        toast({ title: 'Error', description: error.message, variant: 'destructive' })
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const stop = () => abortControllerRef.current?.abort()

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop
  }
} 