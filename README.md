# ApolloGPT – AI Landing Page Generator

ApolloGPT lets you create beautiful, production-ready landing pages just by chatting with an AI. Describe your idea, and watch your landing page come to life with live code previews and a modern, responsive UI.

---

## Features

- **Conversational UI:** Generate landing pages by chatting with an AI assistant.
- **Live Preview:** Instantly see and interact with the generated HTML/CSS.
- **Multiple Versions:** Browse and preview all code versions created in your session.
- **Mobile Friendly:** Fully responsive, works great on any device.
- **Start from Home:** Enter your first prompt right from the home page.

---

## Quickstart

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/apollogpt.git
cd apollogpt
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Copy the example below into a `.env.local` file at the root of your project, and fill in your secrets:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DIRECT_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_API_KEY=your_google_api_key
RESEND_API_KEY=your_resend_api_key
```

- **Tip:** You only need to fill in the variables for the features you plan to use (e.g., Google login, email, etc).

### 3. Start the App

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

- `app/` – Next.js App Router pages (home, chat, auth, api)
- `components/` – UI and chat components
- `hooks/` – Custom React hooks (e.g., chat logic)
- `lib/` – Utility functions and API helpers

---

## Development Notes

- **Authentication:** Uses NextAuth for login (Google supported out of the box).
- **Database:** PostgreSQL (see `DATABASE_URL` above).
- **AI Model:** Gemini API (configure your key in `.env.local`).
- **Live Preview:** Powered by [Sandpack](https://sandpack.dev/).

---


## Extra Features
This project enhances core functionality with:
- Authentication: Email verification via Resend.
- HTML/CSS Generation: Semantic, responsive HTML with theme and iconography support.
- Chat Experience: Real-time data streaming (Vercel AI SDK), contextual memory, and quality guardrails.
- User Interface: Dedicated home page, secure code preview sandbox, and download option.

## Contributing

Pull requests and issues are welcome! Please open an issue if you find a bug or have a feature request.

---

## License

MIT

---

**Enjoy building with ApolloGPT! 🚀**  
If you get stuck, check the code comments or open an issue. 