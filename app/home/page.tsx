import { Header } from "@/components/header"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Chatbar from "@/components/chat/chatbar"
import { Rocket, Zap, Satellite, Code, Smartphone, Stars } from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/signin")

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50">
      <Header />
      <main className="flex flex-col items-center px-4 pt-20 pb-24">
        <div className="w-full max-w-4xl text-center">
          {/* Mission Badge */}
          <div className="flex justify-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Rocket className="w-10 h-10 text-white transform rotate-45" />
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-16">
            <div className="inline-block px-4 py-2 bg-slate-100 rounded-full mb-8">
              <span className="text-slate-600 text-sm font-medium tracking-wide">Mission Control!</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Ready for{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                launch?
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Describe your vision and I'll deploy a stellar landing page that's engineered for success.
            </p>
          </div>

          {/* Command Interface */}
          <div className="mb-20">
            <Chatbar />
          </div>

          {/* Mission Capabilities */}
          <div className="grid grid-cols-3 gap-x-16 gap-y-16 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-indigo-600" />
              </div>
              <span className="text-slate-700 font-medium">Lightning Fast</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Smartphone className="w-7 h-7 text-indigo-600" />
              </div>
              <span className="text-slate-700 font-medium">Responsive</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Stars className="w-7 h-7 text-indigo-600" />
              </div>
              <span className="text-slate-700 font-medium">Beautiful</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Code className="w-7 h-7 text-indigo-600" />
              </div>
              <span className="text-slate-700 font-medium">Clean Code</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Satellite className="w-7 h-7 text-indigo-600" />
              </div>
              <span className="text-slate-700 font-medium">Modern</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Rocket className="w-7 h-7 text-indigo-600" />
              </div>
              <span className="text-slate-700 font-medium">AI Powered</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
