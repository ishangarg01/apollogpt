'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Icons } from '@/components/icons'

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="mx-auto w-full max-w-md p-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Icons.mail className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-semibold">Check your email</h1>
            <p className="text-muted-foreground">
              A sign in link has been sent to your email address.
            </p>
            <p className="text-sm text-muted-foreground">
              If you don't see it, check your spam folder.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 