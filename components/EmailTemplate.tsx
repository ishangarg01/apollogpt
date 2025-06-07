import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  verificationUrl: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  verificationUrl,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <h1 style={{ color: '#333', textAlign: 'center' }}>Welcome to ApolloGPT!</h1>
    <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#666' }}>
      Hi {firstName},
    </p>
    <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#666' }}>
      Thank you for registering with ApolloGPT. To complete your registration and start using our service, please verify your email address by clicking the button below:
    </p>
    <div style={{ textAlign: 'center', margin: '30px 0' }}>
      <a
        href={verificationUrl}
        style={{
          backgroundColor: '#0070f3',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '5px',
          textDecoration: 'none',
          display: 'inline-block',
        }}
      >
        Verify Email Address
      </a>
    </div>
    <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#666' }}>
      If you did not create an account with ApolloGPT, you can safely ignore this email.
    </p>
    <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#666', marginTop: '30px' }}>
      Best regards,<br />
      The ApolloGPT Team
    </p>
  </div>
); 