import { Header } from '@/components/header'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export default async function LandingPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/home')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-foreground/10 hover:ring-foreground/20 transition-colors">
                  AI-powered landing page builder <Sparkles className="inline h-4 w-4 ml-1" />
                </div>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Build stunning{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  landing pages
                </span>{" "}
                with AI
              </h1>

              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
                Generate beautiful, responsive, production-ready landing pages instantly. Just describe what you need—no
                coding required.
              </p>

              <div className="mt-10 flex items-center justify-center gap-4 flex-col sm:flex-row">
                <Button asChild size="lg" className="text-base px-8 py-6 shadow-lg">
                  <Link href="/auth/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8 py-6">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to launch fast</h2>
              <p className="mt-4 text-lg text-muted-foreground">Professional landing pages in minutes, not hours</p>
            </div>

            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative p-8 bg-background rounded-2xl shadow-sm border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">AI-Powered</h3>
                  <p className="mt-2 text-muted-foreground">Describe your vision and watch it come to life instantly</p>
                </div>

                <div className="relative p-8 bg-background rounded-2xl shadow-sm border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">Mobile-First</h3>
                  <p className="mt-2 text-muted-foreground">Every page is responsive and optimized for all devices</p>
                </div>

                <div className="relative p-8 bg-background rounded-2xl shadow-sm border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">Lightning Fast</h3>
                  <p className="mt-2 text-muted-foreground">Production-ready code that loads instantly</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 