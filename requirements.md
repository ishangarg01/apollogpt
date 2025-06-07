ApolloGPT – Technical Requirements Document
Overview
ApolloGPT is a chatbot web application that allows authenticated users to generate responsive HTML & CSS landing page (a single file) via natural language prompts by chatting with an llm. It features a real-time instant preview, edit and download option for rapid MVP development.

Tech Stack
Category	Technology
Framework	Next.js 
Language	TypeScript
UI	Tailwind CSS, ShadcnUI
Auth	NextAuth.js (Google + Email/Password)
Database	Supabase (PostgreSQL) + Prisma
AI Provider	Gemini Flash preview model via Vercel AI SDK
Preview Engine	Sandpack
Hosting	Vercel

Core Functionalities
1. Authentication (via NextAuth.js)
login/signup page
Google login + email/password

No anonymous access

2. Chatbot Interface
Full chat with multi-turn support
Uses Vercel AI SDK
using gemini api
Hardcoded system prompt optimized for html/css landing page generation

3. HTML & CSS Code Generation
Outputs complete single-file HTML using Css in reponse to user prompts
Follows semantic structure and responsive design best practices

4. Live Preview
Live rendering using Sandpack
instant updates and streaming
Auto-updates with latest output or edit

5. Download Feature
Allows download of the generated HTML file.

Non-Functional Requirements
Mobile and desktop responsive
Maintain beautiful user flow and design 
Fully typed with TypeScript
Clean, modular code with error handling

Also provide
Readme with Setup instructions
Documentation




ApolloGPT User Flow 
1. Entry Point (Landing Page)
User visits site.

Display a clear CTA: “Build your landing page instantly”.
with get started button 

redirect for authentication page 
If user is not authenticated:
Show buttons: Sign Up | Login


2. Authentication
User signs up or logs in via Google OAuth or email/password.
On success, redirect to Chat Interface.

3. Chat Interface (left side) 
User inputs natural language prompt.
Prompt sent to Gemini via Vercel AI SDK.
Gemini streams back responsive single-file HTML+CSS.

4. Live Preview (right side)
Sandpack renders output live.
Updates as code streams or user edits.
one button for code one for preview

5. Code Editing
User optionally edits code in Sandpack editor.
Preview updates live.

6. Download
User clicks “Download” to save HTML file.

7. Logout (Optional)
User logs out → redirect to Landing Page.