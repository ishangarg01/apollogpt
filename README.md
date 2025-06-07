# ApolloGPT

ApolloGPT is a modern SaaS web application built with Next.js, NextAuth, Prisma, and Resend. It features robust authentication, user management, and email verification, supporting both email/password and Google OAuth sign-in flows.

---

## Features

- **Email/password registration and login** (with email verification)
- **Google OAuth sign-in/up**
- **Secure password hashing**
- **Transactional emails via Resend**
- **User-friendly error handling and verification resend**
- **Modern, responsive UI**

---

## Table of Contents
- [Database Models](#database-models)
- [Authentication Flow](#authentication-flow)
  - [Registration](#registration)
  - [Email Verification](#email-verification)
  - [Sign-In](#sign-in)
  - [Google OAuth](#google-oauth)
  - [Resend Verification Email](#resend-verification-email)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Customization & Extending](#customization--extending)
- [File/Route Reference](#fileroute-reference)
- [Deployment](#deployment)

---

## Database Models

Defined in `prisma/schema.prisma`:

- **User**: Represents a person using the app.
- **Account**: Represents a login method (credentials, Google, etc.) for a user.
- **Session**: NextAuth session management.
- **VerificationToken**: Stores email verification tokens.

---

## Authentication Flow

### Registration
- **Frontend**: `components/auth/register-form.tsx`
  - Collects name, email, and password.
  - Submits to `/api/auth/register` via POST.
- **Backend**: `app/api/auth/register/route.ts`
  - Hashes the password.
  - Creates a `User` (with `emailVerified: null`).
  - Creates an `Account` for the credentials provider.
  - Generates a verification token and stores it in `VerificationToken`.
  - Sends a verification email using Resend and `EmailTemplate`.
  - Responds with success.
- **User Experience**: After registration, the user is prompted to check their email for a verification link.

### Email Verification
- **Verification Email**: Sent via Resend, using `components/EmailTemplate.tsx`.
  - The link is: `{NEXTAUTH_URL}/auth/verify-email?token={token}`
- **Verification Page**: `app/auth/verify-email/page.tsx`
  - Reads the `token` from the URL.
  - Looks up the token in `VerificationToken`.
  - If valid and not expired, sets `emailVerified` on the user and deletes the token.
  - Shows a success or error message.

### Sign-In
- **Email/Password**
  - **Frontend**: `components/auth/sign-in-form.tsx`
    - Collects email and password.
    - Calls `signIn('credentials', ...)` from NextAuth.
    - If the password is wrong, shows "Invalid email or password".
    - If the password is correct but the email is not verified, shows "Please verify your email before logging in." and offers a "Resend Verification Email" button.
  - **Backend**: `lib/auth.ts` (CredentialsProvider)
    - Checks if the user exists and has a password.
    - Checks the password (using bcryptjs).
    - If the password is correct but `emailVerified` is null, throws a verification error.
- **Google OAuth**
  - **Frontend**: "Sign up with Google" and "Sign in with Google" buttons use `signIn('google', ...)`.
  - **Backend**: NextAuth handles Google OAuth and user/account creation via the Prisma adapter.

### Resend Verification Email
- **Frontend**: If login fails due to unverified email, the sign-in form shows a "Resend Verification Email" button. Clicking it calls `/api/auth/resend-verification` with the user's email.
- **Backend**: `app/api/auth/resend-verification/route.ts`
  - Checks if the user exists and is not verified.
  - Deletes any existing tokens for the user.
  - Generates a new token and sends a new verification email.

---

## Error Handling
- **Sign-in errors**:
  - "Invalid email or password" for wrong credentials.
  - "Please verify your email before logging in." for unverified users (with resend option).
- **Verification errors**:
  - "Verification link has expired" or "Email not yet verified" if the token is invalid or expired.

---

## Environment Variables
Set these in your `.env` file:

```
DATABASE_URL=postgres://...
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## Running Locally

Follow these steps to set up ApolloGPT on your local machine:

### 1. Prerequisites
- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** database (local or cloud)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/apollogpt.git
cd apollogpt
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory and add the following variables:

```
DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database>
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

- Replace the values with your actual credentials.
- You can get a free PostgreSQL database from [Supabase](https://supabase.com/) or run one locally.
- Get your Resend API key from [Resend](https://resend.com/).
- Set up a Google OAuth app in the [Google Cloud Console](https://console.cloud.google.com/) to get your client ID and secret.

### 5. Run Database Migrations
```bash
npx prisma migrate dev
```
This will create the necessary tables in your database.

### 6. Start the Development Server
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### 7. Register and Test
- Visit [http://localhost:3000](http://localhost:3000) in your browser.
- Register a new account and check your email for the verification link.
- Try signing in with both email/password and Google OAuth.

---

If you encounter any issues, check your terminal for errors and ensure your environment variables are set correctly. For further help, open an issue or contact the maintainer.

---

## Customization & Extending
- **Email Template**: Edit `components/EmailTemplate.tsx` for branding and content.
- **Verification Expiry**: Change the expiry duration in the registration and resend logic.
- **Providers**: Add more OAuth providers in `lib/auth.ts` as needed.
- **User Profile**: Extend the `User` model and add profile pages as needed.

---

## File/Route Reference
- **Registration**:
  - Frontend: `components/auth/register-form.tsx`
  - API: `app/api/auth/register/route.ts`
- **Sign In**:
  - Frontend: `components/auth/sign-in-form.tsx`
- **Resend Verification**:
  - API: `app/api/auth/resend-verification/route.ts`
- **Email Verification**:
  - Page: `app/auth/verify-email/page.tsx`
- **Google OAuth**:
  - Button in register/sign-in forms, handled by NextAuth config in `lib/auth.ts`
- **Email Template**:
  - `components/EmailTemplate.tsx`

---

## Security Notes
- Passwords are hashed with bcryptjs.
- Email verification is required before login.
- All sensitive routes are protected by middleware and session checks.

---

## License

MIT 

## Deployment

Follow these steps to deploy ApolloGPT to production. The instructions are suitable for platforms like **Vercel**, **Railway**, or any Node.js-compatible cloud provider.

### 1. Prepare Your Production Database
- Use a managed PostgreSQL service (e.g., [Supabase](https://supabase.com/), [Railway](https://railway.app/), [Neon](https://neon.tech/), [Render](https://render.com/), or [Aiven](https://aiven.io/)).
- Create a new database and obtain the connection string (e.g., `DATABASE_URL`).

### 2. Set Up Environment Variables
- In your deployment platform's dashboard, add the following environment variables:
  - `DATABASE_URL` (your production database connection string)
  - `NEXTAUTH_URL` (your production URL, e.g., `https://yourdomain.com`)
  - `RESEND_API_KEY` (from your Resend account)
  - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (from your Google Cloud Console, with the correct OAuth redirect URIs for production)

### 3. Configure OAuth and Email Providers
- **Google OAuth**: In the [Google Cloud Console](https://console.cloud.google.com/), set the OAuth redirect URI to `https://yourdomain.com/api/auth/callback/google`.
- **Resend**: Add and verify your custom domain in the [Resend dashboard](https://resend.com/domains) for production email sending. Update the `from` address in your code if needed.

### 4. Push Your Code
- Push your code to a GitHub/GitLab/Bitbucket repository.
- Connect your repository to your deployment platform (e.g., Vercel, Railway).

### 5. Run Database Migrations in Production
- Most platforms allow you to run a one-time command after deployment. Use:
  ```bash
  npx prisma migrate deploy
  ```
- Alternatively, use the platform's web shell/console to run the command.

### 6. Build and Deploy
- Your platform will automatically run `npm install` and `npm run build`.
- Ensure the build completes without errors.

### 7. Set Up Your Domain
- Add your custom domain in your deployment platform's dashboard.
- Update DNS records as instructed by your platform.
- Make sure `NEXTAUTH_URL` matches your production domain.

### 8. Test the Production App
- Visit your deployed site.
- Register a new user and verify the full authentication flow (registration, email verification, sign-in, Google OAuth, resend verification, etc.).
- Check that emails are delivered and not marked as spam.

### 9. Monitor and Maintain
- Set up error monitoring/logging (e.g., Vercel Analytics, Sentry, or your platform's built-in tools).
- Regularly update dependencies and monitor for security advisories.

---

**Tips:**
- For Vercel, most configuration is automatic. Just set your environment variables and connect your repo.
- For Railway, use the "Variables" tab for environment variables and the "Shell" for migrations.
- Always use secure, unique secrets in production.
- Never commit your `.env` file to version control.

--- 