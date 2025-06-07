'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="mx-auto w-full max-w-md">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  )
} 