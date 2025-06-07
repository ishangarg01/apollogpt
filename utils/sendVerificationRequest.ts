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
    // Ensure the email param is present in the verification URL
    let verificationUrl = url;
    const urlObj = new URL(url);
    if (!urlObj.searchParams.get('email')) {
      urlObj.searchParams.set('email', email);
      verificationUrl = urlObj.toString();
    }
    const { error } = await resend.emails.send({
      from: from,
      to: [email],
      subject: 'Verify your ApolloGPT account',
      react: EmailTemplate({
        firstName: email.split('@')[0], // Use part of email as first name
        verificationUrl: verificationUrl,
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