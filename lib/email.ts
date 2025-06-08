import { Resend } from 'resend'
import { EmailTemplate } from '@/components/EmailTemplate'

// This is a server-side only utility
export async function sendVerificationEmail(email: string, name: string, verificationUrl: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  const { error } = await resend.emails.send({
    from: 'ApolloGPT <noreply@ishan.click>',
    to: [email],
    subject: 'Verify your ApolloGPT account',
    react: EmailTemplate({
      firstName: name.split(' ')[0],
      verificationUrl,
    }),
  })

  if (error) {
    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email. Please try again later.')
  }
} 