'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Chatbar() {
  const [prompt, setPrompt] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      router.push(`/chat?prompt=${encodeURIComponent(prompt)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl mx-auto">
      <Input
        type="text"
        placeholder="Describe your idea..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        className="flex-1"
        required
      />
      <Button type="submit" disabled={!prompt.trim()}>
        Send
      </Button>
    </form>
  )
} 