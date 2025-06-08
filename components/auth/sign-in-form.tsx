'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Github } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/home'
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [showResend, setShowResend] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(callbackUrl)
    }
  }, [status, session, callbackUrl, router])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setShowResend(false)

    const formData = new FormData(event.currentTarget)
    const emailValue = formData.get('email') as string
    setEmail(emailValue)
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        email: emailValue,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        if (result.error.includes('verify your email')) {
          setError('Please verify your email before logging in.')
          setShowResend(true)
        } else {
          setError('Invalid email or password')
        }
        return
      }

      if (result?.url) {
        router.push(result.url)
      } else {
        router.push(callbackUrl)
      }
      router.refresh()
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn('google', {
        callbackUrl,
        redirect: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your email for a new verification link.',
        })
        setShowResend(false)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to resend verification email.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend verification email.',
        variant: 'destructive',
      })
    } finally {
      setResendLoading(false)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
          </div>
          {error && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-red-500">{error}</p>
              {showResend && (
                <Button type="button" variant="outline" onClick={handleResend} disabled={resendLoading}>
                  {resendLoading ? 'Resending...' : 'Resend Verification Email'}
                </Button>
              )}
            </div>
          )}
          <Button disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
      >
        {isLoading ? (
          <Github className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Github className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  )
} 