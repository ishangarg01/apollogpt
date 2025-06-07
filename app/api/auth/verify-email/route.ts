import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Invalid verification link. Missing token or email.' },
        { status: 400 }
      )
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: token,
        expires: {
          gt: new Date() // Check if token hasn't expired
        }
      }
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Verification link is invalid or has expired.' },
        { status: 400 }
      )
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() }
    })

    // Delete the used verification token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Email verified successfully! You can now sign in.' 
    })
  } catch (error: any) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred during verification. Please try again.' },
      { status: 500 }
    )
  }
} 