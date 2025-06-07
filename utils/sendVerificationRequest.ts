import { Resend } from 'resend';
import { EmailTemplate } from '@/components/EmailTemplate';
import { SendVerificationRequestParams } from 'next-auth/providers/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationRequest({
  identifier: email,
  url,
  provider: { server, from },
}: SendVerificationRequestParams): Promise<void> {
  try {
    const { error } = await resend.emails.send({
      from: from,
      to: [email],
      subject: 'Verify your ApolloGPT account',
      react: EmailTemplate({
        firstName: email.split('@')[0], // Use part of email as first name
        verificationUrl: url,
      }),
    });

    if (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email. Please try again later.');
    }
  } catch (error) {
    console.error('Verification email error:', error);
    throw new Error('Failed to send verification email. Please try again later.');
  }
} 