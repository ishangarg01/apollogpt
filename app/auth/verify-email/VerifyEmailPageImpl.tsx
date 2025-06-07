import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token')
        const email = searchParams.get('email')

        if (!token || !email) {
          setStatus('error')
          setMessage('Invalid verification link. Missing token or email.')
          return
        }

        const response = await fetch(`/api/auth/verify-email?token=${token}&email=${email}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed')
        }

        setStatus('success')
        setMessage(data.message || 'Email verified successfully!')
      } catch (error: any) {
        setStatus('error')
        setMessage(error.message || 'An error occurred during verification.')
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="mx-auto w-full max-w-md p-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            {status === 'loading' && (
              <>
                <Icons.spinner className="h-8 w-8 animate-spin" />
                <h1 className="text-2xl font-semibold">Verifying your email...</h1>
                <p className="text-muted-foreground">Please wait while we verify your email address.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="rounded-full bg-green-100 p-3">
                  <Icons.check className="h-6 w-6 text-green-600" />
                </div>
                <h1 className="text-2xl font-semibold">Email Verified!</h1>
                <p className="text-muted-foreground">{message}</p>
                <Button onClick={() => router.push('/auth/signin')}>
                  Sign In
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="rounded-full bg-red-100 p-3">
                  <Icons.x className="h-6 w-6 text-red-600" />
                </div>
                <h1 className="text-2xl font-semibold">Verification Failed</h1>
                <p className="text-muted-foreground">{message}</p>
                <Button onClick={() => router.push('/auth/signin')}>
                  Back to Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 