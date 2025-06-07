import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import { EmailTemplate } from "@/components/EmailTemplate"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()
    const hashed_password = await hash(password, 12)

    // Create user with emailVerified set to null
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed_password,
        emailVerified: null,
      },
    })

    // Create Account record for credentials provider
    await prisma.account.create({
      data: {
        userId: user.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: user.id,
      },
    })

    // Generate verification token
    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // Create verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

    // Send verification email using Resend
    const { data, error } = await resend.emails.send({
      from: 'ApolloGPT <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify your ApolloGPT account',
      react: EmailTemplate({ 
        firstName: name.split(' ')[0], // Get first name
        verificationUrl 
      }),
    })

    if (error) {
      console.error('Failed to send verification email:', error)
      // Don't fail registration if email fails, but log the error
    }

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    )
  }
} 