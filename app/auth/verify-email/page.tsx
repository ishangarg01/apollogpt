import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

async function verifyEmail(token: string) {
  try {
    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return { success: false, message: 'Email not yet verified. Please check your email for the verification link.' }
    }

    if (verificationToken.expires < new Date()) {
      return { success: false, message: 'Verification link has expired.' }
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    })

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { token },
    })

    return { success: true, message: 'Email verified successfully! You can now log in.' }
  } catch (error) {
    console.error('Verification error:', error)
    return { success: false, message: 'An error occurred during verification.' }
  }
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  if (!searchParams.token) {
    redirect('/')
  }

  const result = await verifyEmail(searchParams.token)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {result.success ? 'Email Verified!' : 'Verification Failed'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{result.message}</p>
        </div>
        <div className="mt-8 text-center">
          <a
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {result.success ? 'Go to Sign In' : 'Back to Home'}
          </a>
        </div>
      </div>
    </div>
  )
} 