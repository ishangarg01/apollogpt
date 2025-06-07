import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import { EmailTemplate } from "@/components/EmailTemplate"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }
    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email is already verified.' }, { status: 400 })
    }

    // Delete any existing tokens for this user
    await prisma.verificationToken.deleteMany({ where: { identifier: email } })

    // Generate new verification token
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

    // Send verification email
    const { error } = await resend.emails.send({
      from: 'ApolloGPT <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify your ApolloGPT account',
      react: EmailTemplate({
        firstName: user.name ? user.name.split(' ')[0] : email.split('@')[0],
        verificationUrl,
      }),
    })

    if (error) {
      return NextResponse.json({ error: 'Failed to send verification email.' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Verification email sent.' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 