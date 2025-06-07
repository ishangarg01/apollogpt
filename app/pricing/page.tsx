import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Simple, Transparent Pricing</h1>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Choose the plan that works best for you and your team.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[400px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold">Free</h3>
                  <p className="text-sm text-muted-foreground">
                    Perfect for trying out ApolloGPT.
                  </p>
                  <div className="text-2xl font-bold">$0</div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> 5 generations per month
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Basic templates
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Community support
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Basic analytics
                    </li>
                  </ul>
                </div>
                <Button asChild className="w-full">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[400px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold">Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    For professionals and small teams.
                  </p>
                  <div className="text-2xl font-bold">$29</div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Unlimited generations
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Premium templates
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Priority support
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Advanced analytics
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Custom branding
                    </li>
                  </ul>
                </div>
                <Button asChild className="w-full">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[400px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold">Enterprise</h3>
                  <p className="text-sm text-muted-foreground">
                    For large organizations.
                  </p>
                  <div className="text-2xl font-bold">Custom</div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Custom solutions
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Dedicated support
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> SLA guarantee
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Custom integrations
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4" /> Team management
                    </li>
                  </ul>
                </div>
                <Button asChild className="w-full">
                  <Link href="/auth/register">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Frequently Asked Questions</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Have questions? We're here to help.
            </p>
          </div>
          <div className="mx-auto grid max-w-[58rem] gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">What is ApolloGPT?</h3>
              <p className="text-sm text-muted-foreground">
                ApolloGPT is an AI-powered landing page generator that creates beautiful, responsive landing pages using natural language prompts.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">How does the free trial work?</h3>
              <p className="text-sm text-muted-foreground">
                The free plan includes 5 generations per month. You can upgrade to Pro or Enterprise at any time.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">Can I cancel my subscription?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">Do you offer refunds?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 14-day money-back guarantee for all paid plans. Contact our support team to request a refund.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 