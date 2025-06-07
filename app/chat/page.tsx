import { Header } from '@/components/header'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ChatInterface } from '@/components/chat/chat-interface'
import { cookies } from 'next/headers'

export default async function ChatPage({ searchParams }: { searchParams: { prompt?: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  const initialPrompt = searchParams?.prompt || ''

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col">
        <ChatInterface prompt={initialPrompt} />
      </main>
    </div>
  )
} 