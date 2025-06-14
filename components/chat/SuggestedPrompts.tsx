import { Button } from "@/components/ui/button"
import { Zap, Building2, Sparkles } from "lucide-react"

export const SUGGESTED_PROMPTS = [
  {
    icon: Zap,
    title: "Creative Agency Landing Page",
    description: "asymmetri.in - creative agency landing page",
    prompt:
      "Create a modern, creative landing page for a software agency called 'Asymmetri'. The page should include: a hero section with a bold headline and tagline, a section describing services (web, mobile, AI, design, branding, games), a 'How We Work' process section, a 'Why Choose Us' section, and a contact details section. Use vibrant gradients, large headings, and playful but professional styling. Use red header background, black and white color with black background.",
  },
  {
    icon: Building2,
    title: "SaaS Landing Page",
    description: "Create a clean SaaS landing page with hero, features, and pricing sections",
    prompt:
      "Create a modern SaaS landing page for a project management tool called 'TaskFlow'. Include a hero section with a headline, feature highlights, pricing tiers, testimonials (as text blocks), and a call-to-action text with contact details. Use a clean, professional design with a blue and white color scheme.",
  },
  {
    icon: Sparkles,
    title: "Startup Landing Page",
    description: "Build a startup landing page with product info and team section",
    prompt:
      "Design a startup landing page for an AI-powered fitness app called 'FitGenius'. Include a hero section, key features (as text), founder story, user testimonials (as text), and an email signup form. Use energetic colors like orange and purple with modern gradients.",
  },
]

export function SuggestedPrompts({ onPromptSelect, disabled }: { onPromptSelect: (prompt: string) => void; disabled: boolean }) {
  return (
    // Added horizontal padding (px-4) to ensure spacing on left and right sides
    <div className="space-y-3 px-4 sm:px-0"> {/* sm:px-0 removes extra padding on larger screens if desired by parent */}
      <p className="text-sm text-gray-600 font-medium">Try these examples:</p>
      {/*
        Updated grid classes for better responsiveness:
        - `grid-cols-1`: Default to 1 column on extra small screens.
        - `sm:grid-cols-2`: Switch to 2 columns from the 'sm' breakpoint (e.g., wider phones, small tablets).
        - `lg:grid-cols-3`: Switch to 3 columns from the 'lg' breakpoint (e.g., desktops).
        This ensures cards adapt their width more effectively across different device sizes,
        helping to prevent horizontal overflow and unused whitespace.
      */}
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {SUGGESTED_PROMPTS.map((prompt, index) => {
          const IconComponent = prompt.icon
          return (
            <Button
              key={index}
              variant="outline"
              onClick={() => onPromptSelect(prompt.prompt)}
              disabled={disabled}
              // `w-full` ensures the button takes the full width of its grid column
              className="h-auto p-4 text-left justify-start hover:bg-violet-50 hover:border-violet-200 transition-colors group w-full"
            >
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                  <IconComponent className="h-4 w-4 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0"> {/* `min-w-0` helps content shrink within flex item */}
                  <div className="font-medium text-sm text-gray-900 mb-1">{prompt.title}</div>
                  <div className="text-xs text-gray-500 line-clamp-2">{prompt.description}</div>
                </div>
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
