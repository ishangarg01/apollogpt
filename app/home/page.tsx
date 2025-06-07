import { Header } from '@/components/header'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Chatbar from '@/components/chat/chatbar'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">What can I help you build?</h1>
          <p className="text-lg text-muted-foreground">Start by describing your idea below.</p>
          <div className="mt-8">
            <Chatbar />
          </div>
        </div>
      </main>
    </div>
  )
} 