'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ProfileMenu } from '@/components/profile/profile-menu'
import { Button } from "@/components/ui/button"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">ApolloGPT</span>
        </Link>

        <nav className="flex items-center gap-2">
          {!session && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </>
          )}
          {session && <ProfileMenu />}
        </nav>
      </div>
    </header>
  )
} 