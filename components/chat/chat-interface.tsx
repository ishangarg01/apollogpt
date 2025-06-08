// "use client"

// import type React from "react"

// import { useState, useRef, useEffect, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Badge } from "@/components/ui/badge"
// import { SandpackProvider, SandpackPreview, SandpackCodeEditor } from "@codesandbox/sandpack-react"
// import { useChat, type UIMessage, type UIMessagePart } from "@/hooks/use-chat"
// import { cn } from "@/lib/utils"
// import {
//   Send,
//   StopCircle,
//   Code,
//   Eye,
//   RefreshCw,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   Maximize2,
//   Minimize2,
//   Copy,
//   Check,
//   Sparkles,
//   Zap,
//   Building2,
//   Download,
// } from "lucide-react"
// import { Header } from "@/components/header"
// import { ChatInput } from "@/components/chat/ChatInput"
// import { PreviewPanel } from "@/components/chat/PreviewPanel"
// import { SandpackWrapper } from "@/components/chat/SandpackWrapper"

// type PreviewMode = "preview" | "editor"

// // Enhanced loading animation with better visual feedback
// const AssistantLoader = () => (
//   <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
//     <div className="relative">
//       <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
//       <div className="absolute inset-0 h-5 w-5 animate-ping rounded-full bg-violet-400 opacity-20" />
//     </div>
//     <div className="flex flex-col">
//       <span className="text-sm font-medium text-violet-900">Generating your landing page...</span>
//       <span className="text-xs text-violet-600">This may take a few moments</span>
//     </div>
//   </div>
// )

// // Enhanced streaming code block with better visual feedback
// const StreamingCodeBlock = ({ code }: { code: string | null }) => {
//   const scrollRef = useRef<HTMLPreElement>(null)

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight
//     }
//   }, [code])

//   if (!code) return null

//   return (
//     <div className="mt-3 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
//       <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
//         <div className="flex items-center gap-2">
//           <div className="flex gap-1">
//             <div className="w-2 h-2 rounded-full bg-red-500" />
//             <div className="w-2 h-2 rounded-full bg-yellow-500" />
//             <div className="w-2 h-2 rounded-full bg-green-500" />
//           </div>
//           <span className="text-xs text-gray-400 font-mono">Generating code...</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
//           <span className="text-xs text-green-400">Live</span>
//         </div>
//       </div>
//       <div className="max-h-64 overflow-y-auto">
//         <pre
//           ref={scrollRef}
//           className="text-sm font-mono text-gray-100 p-4 overflow-x-auto whitespace-pre-wrap break-words"
//         >
//           <code className="break-all">{code}</code>
//         </pre>
//       </div>
//     </div>
//   )
// }

// // Enhanced code block with copy functionality
// const CodeBlock = ({ code, onClick }: { code: string; onClick: () => void }) => {
//   const [isExpanded, setIsExpanded] = useState(false)
//   const [copied, setCopied] = useState(false)
//   const lines = code.split("\n")
//   const canBeTruncated = lines.length > 15

//   const displayedCode = canBeTruncated && !isExpanded ? lines.slice(0, 15).join("\n") + "\n..." : code

//   const copyToClipboard = async (e: React.MouseEvent) => {
//     e.stopPropagation() // Prevent the parent div's onClick from firing
//     await navigator.clipboard.writeText(code)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   const handleExpandClick = (e: React.MouseEvent) => {
//     e.stopPropagation() // Prevent the parent div's onClick from firing
//     setIsExpanded(!isExpanded)
//   }

//   return (
//     <div
//       className="mt-4 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden cursor-pointer hover:border-violet-500/50 transition-colors"
//       onClick={onClick}
//       title="Click to preview this code"
//     >
//       <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
//         <div className="flex items-center gap-2">
//           <div className="flex gap-1">
//             <div className="w-2 h-2 rounded-full bg-red-500" />
//             <div className="w-2 h-2 rounded-full bg-yellow-500" />
//             <div className="w-2 h-2 rounded-full bg-green-500" />
//           </div>
//           <span className="text-xs text-gray-400 font-mono">HTML</span>
//         </div>
//         <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-6 px-2 text-gray-400 hover:text-white">
//           {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
//         </Button>
//       </div>
//       <div className="relative">
//         <pre className="text-sm font-mono text-gray-100 p-4 overflow-x-auto whitespace-pre-wrap break-words">
//           <code className="break-all">{displayedCode}</code>
//         </pre>
//         {canBeTruncated && (
//           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4 flex justify-center">
//             <Button
//               variant="secondary"
//               size="sm"
//               onClick={handleExpandClick}
//               className="bg-gray-700 hover:bg-gray-600 text-white"
//             >
//               {isExpanded ? "Show less" : "Show more"}
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// function isCodeUIPart(part: UIMessagePart): part is { type: "code"; code: string; language?: string } {
//   return part.type === "code" && typeof part.code === "string"
// }

// function CopyButton({ code }: { code: string }) {
//   const [copied, setCopied] = useState(false)
//   const handleCopy = useCallback(async () => {
//     await navigator.clipboard.writeText(code)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }, [code])
//   return (
//     <Button variant="ghost" size="sm" onClick={handleCopy} className="h-9 w-9 p-0 rounded-lg" title="Copy code">
//       {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//     </Button>
//   )
// }

// function DownloadButton({ code }: { code: string }) {
//   const handleDownload = useCallback(() => {
//     const blob = new Blob([code], { type: "text/html" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = "landing-page.html"
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   }, [code])
//   return (
//     <Button variant="ghost" size="sm" onClick={handleDownload} className="h-9 w-9 p-0 rounded-lg" title="Download code">
//       <Download className="h-4 w-4" />
//     </Button>
//   )
// }

// export function ChatInterface({ initialPrompt }: { initialPrompt?: string }) {
//   const { messages, input, handleInputChange, handleSubmit, isLoading, stop, error } = useChat({
//     initialInput: initialPrompt,
//   })

//   const [currentCodeIndex, setCurrentCodeIndex] = useState(0)
//   const [isPreviewMode, setIsPreviewMode] = useState<PreviewMode>("preview")
//   const [streamingCode, setStreamingCode] = useState<string | null>(null)
//   const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const inputRef = useRef<HTMLInputElement>(null)

//   const allCodeParts = messages
//     .filter((m) => m.role === "assistant" && m.parts)
//     .flatMap((m) => m.parts?.filter(isCodeUIPart) || [])

//   useEffect(() => {
//     if (allCodeParts.length > 0) {
//       setCurrentCodeIndex(allCodeParts.length - 1)
//     }
//   }, [allCodeParts.length])

//   const currentCode = allCodeParts.length > 0 ? allCodeParts[currentCodeIndex]?.code : null

//   useEffect(() => {
//     if (isLoading && messages.length > 0) {
//       const lastMessage = messages[messages.length - 1]
//       if (lastMessage?.role === "assistant") {
//         const content = lastMessage.content
//         const codeMatch = content.match(/"code"\s*:\s*"((?:\\.|[^"\\])*)/)

//         if (codeMatch && codeMatch[1]) {
//           const unescapedCode = codeMatch[1]
//             .replace(/\\n/g, "\n")
//             .replace(/\\"/g, '"')
//             .replace(/\\t/g, "\t")
//             .replace(/\\r/g, "\r")
//           setStreamingCode(unescapedCode)
//         }
//       }
//     } else {
//       setStreamingCode(null)
//     }
//   }, [messages, isLoading])

//   useEffect(() => {
//     if (isLoading) {
//       setIsPreviewMode("preview")
//     }
//   }, [isLoading])

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   // Focus input when not loading
//   useEffect(() => {
//     if (!isLoading && inputRef.current) {
//       inputRef.current.focus()
//     }
//   }, [isLoading])

//   useEffect(() => {
//     if (initialPrompt && messages.length === 0 && input === initialPrompt) {
//       handleSubmit()
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [initialPrompt])

//   const codeToDisplay = streamingCode ?? currentCode

//   const handlePromptSelect = (prompt: string) => {
//     // Set the input value and submit immediately
//     const syntheticEvent = {
//       target: { value: prompt },
//     } as React.ChangeEvent<HTMLInputElement>

//     handleInputChange(syntheticEvent)

//     // Submit after a brief delay to ensure the input is updated
//     setTimeout(() => {
//       const form = inputRef.current?.closest("form")
//       if (form) {
//         const submitEvent = new Event("submit", { bubbles: true, cancelable: true })
//         form.dispatchEvent(submitEvent)
//       }
//     }, 10)
//   }

//   const renderMessageContent = (message: UIMessage, isStreaming: boolean) => {
//     if (isStreaming && isLoading) {
//       return (
//         <div className="space-y-3">
//           <AssistantLoader />
//           <StreamingCodeBlock code={streamingCode} />
//         </div>
//       )
//     }

//     if (message.parts && message.parts.length > 0) {
//       return message.parts.map((part, index) => {
//         if (part.type === "text") {
//           return (
//             <div key={index} className="whitespace-pre-wrap leading-relaxed">
//               {part.text}
//             </div>
//           )
//         }
//         if (isCodeUIPart(part)) {
//           // Re-add click handler logic
//           const codeIndex = allCodeParts.findIndex((p) => p.code === part.code)
//           const handleCodeClick = () => {
//             if (codeIndex !== -1) {
//               setCurrentCodeIndex(codeIndex)
//               setIsPreviewMode("preview")
//               if (isMobilePreviewOpen === false && window.innerWidth < 1024) {
//                 setIsMobilePreviewOpen(true)
//               }
//             }
//           }
//           return <CodeBlock key={index} code={part.code} onClick={handleCodeClick} />
//         }
//         return null
//       })
//     }

//     return <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
//   }

//   // Memoize handlers for ChatInput to avoid rerenders
//   const stableHandleInputChange = useCallback(handleInputChange, [handleInputChange])
//   const stableHandleSubmit = useCallback(handleSubmit, [handleSubmit])
//   const stableStop = useCallback(stop, [stop])

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
//       <Header />

//       {/* Mobile Layout */}
//       <div className="flex-1 flex flex-col lg:hidden">
//         <div className="flex border-b bg-white">
//           <Button
//             variant={!isMobilePreviewOpen ? "default" : "ghost"}
//             onClick={() => setIsMobilePreviewOpen(false)}
//             className="flex-1 rounded-none"
//           >
//             Chat
//           </Button>
//           <Button
//             variant={isMobilePreviewOpen ? "default" : "ghost"}
//             onClick={() => setIsMobilePreviewOpen(true)}
//             className="flex-1 rounded-none"
//             disabled={!codeToDisplay}
//           >
//             Preview
//           </Button>
//         </div>

//         {!isMobilePreviewOpen ? (
//           // Mobile Chat View
//           <Card className="flex-1 flex flex-col m-2 rounded-2xl border-0 shadow-lg">
//             <CardContent className="flex-1 flex flex-col p-0 min-h-0">
//               <ScrollArea className="flex-1 pb-4">
//                 <div className="space-y-4 p-4">
//                   {messages.length === 0 && (
//                     <div className="text-center py-12">
//                       <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
//                         <Sparkles className="w-8 h-8 text-violet-600" />
//                       </div>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Amazing Landing Pages</h3>
//                       <p className="text-gray-600 text-sm max-w-sm mx-auto">
//                         Describe your vision and I'll generate a beautiful, responsive landing page for you.
//                       </p>
//                     </div>
//                   )}
//                   {messages.map((message, index) => {
//                     const isStreaming = isLoading && message.role === "assistant" && index === messages.length - 1

//                     return (
//                       <div
//                         key={message.id}
//                         className={cn("flex w-full", message.role === "user" ? "justify-end" : "justify-start")}
//                       >
//                         <div
//                           className={cn(
//                             "rounded-2xl px-4 py-3 max-w-[85%] shadow-sm break-words",
//                             message.role === "user"
//                               ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
//                               : "bg-white text-gray-800 border border-gray-100",
//                           )}
//                           style={{ overflowWrap: "anywhere" }}
//                         >
//                           {renderMessageContent(message, isStreaming)}
//                         </div>
//                       </div>
//                     )
//                   })}
//                   <div ref={messagesEndRef} />
//                 </div>
//               </ScrollArea>
//               <div className="border-t bg-white p-4 sticky bottom-0">
//                 <ChatInput
//                   input={input}
//                   isLoading={isLoading}
//                   handleInputChange={stableHandleInputChange}
//                   handleSubmit={stableHandleSubmit}
//                   stop={stableStop}
//                   inputRef={inputRef}
//                   className="w-full"
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         ) : (
//           // Mobile Preview View
//           <Card className="flex-1 flex flex-col m-2 rounded-2xl border-0 shadow-lg">
//             <CardHeader className="flex-none pb-3">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-lg">Preview</CardTitle>
//               </div>
//             </CardHeader>
//             <CardContent className="flex-1 flex flex-col p-0 min-h-0">
//               {codeToDisplay ? (
//                 <SandpackWrapper
//                   key={`${currentCodeIndex}-${isPreviewMode}`}
//                   code={codeToDisplay}
//                   mode={isPreviewMode}
//                   className="flex-1 min-h-0 rounded-b-2xl overflow-hidden"
//                 />
//               ) : (
//                 <div className="flex h-full items-center justify-center text-gray-500 p-8">
//                   <div className="text-center">
//                     <Zap className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//                     <p className="text-sm">No preview available yet</p>
//                     <p className="text-xs text-gray-400 mt-1">Generate a landing page to see the preview</p>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* Desktop Layout - Switched to CSS Grid for fixed panel widths */}
//       <div className="hidden lg:grid grid-cols-10 flex-1 min-h-0 overflow-hidden gap-4 p-4">
//         {/* Left Panel: Chat */}
//         <Card className="col-span-4 flex flex-col flex-1 min-h-0 rounded-2xl border-0 shadow-lg bg-white overflow-hidden">
//           <CardHeader className="flex-none pb-3">
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-xl font-semibold">Chat</CardTitle>
//               {error && (
//                 <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
//                   <RefreshCw className="h-4 w-4 mr-2" />
//                   Reload
//                 </Button>
//               )}
//             </div>
//           </CardHeader>
//           <CardContent className="flex-1 min-h-0 flex flex-col overflow-hidden relative p-0">
//             <ScrollArea className="flex-1 min-h-0">
//               <div className="space-y-6 p-6 pb-24">
//                 {messages.length === 0 && (
//                   <div className="text-center py-16">
//                     <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl flex items-center justify-center">
//                       <Sparkles className="w-10 h-10 text-violet-600" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Amazing Landing Pages</h3>
//                     <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
//                       Describe your vision and I'll generate a beautiful, responsive landing page tailored to your
//                       needs.
//                     </p>
//                     <div className="flex flex-wrap gap-2 justify-center mt-6">
//                       <Badge variant="secondary" className="text-xs">
//                         Responsive Design
//                       </Badge>
//                       <Badge variant="secondary" className="text-xs">
//                         Modern UI
//                       </Badge>
//                       <Badge variant="secondary" className="text-xs">
//                         Fast Generation
//                       </Badge>
//                     </div>
//                   </div>
//                 )}
//                 {messages.map((message, index) => {
//                   const isStreaming = isLoading && message.role === "assistant" && index === messages.length - 1

//                   return (
//                     <div
//                       key={message.id}
//                       className={cn("flex w-full", message.role === "user" ? "justify-end" : "justify-start")}
//                     >
//                       <div
//                         className={cn(
//                           "rounded-2xl px-5 py-4 max-w-[80%] shadow-sm break-words",
//                           message.role === "user"
//                             ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
//                             : "bg-gray-50 text-gray-800 border border-gray-100",
//                         )}
//                         style={{ overflowWrap: "anywhere" }}
//                       >
//                         {renderMessageContent(message, isStreaming)}
//                       </div>
//                     </div>
//                   )
//                 })}
//                 <div ref={messagesEndRef} />
//               </div>
//             </ScrollArea>
//             <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-6">
//               <ChatInput
//                 input={input}
//                 isLoading={isLoading}
//                 handleInputChange={stableHandleInputChange}
//                 handleSubmit={stableHandleSubmit}
//                 stop={stableStop}
//                 inputRef={inputRef}
//                 className="w-full gap-4"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Right Panel: Preview & Code */}
//         <PreviewPanel
//           codeToDisplay={codeToDisplay}
//           allCodeParts={allCodeParts}
//           currentCodeIndex={currentCodeIndex}
//           setCurrentCodeIndex={useCallback((i) => setCurrentCodeIndex(i), [])}
//           isPreviewMode={isPreviewMode}
//           setIsPreviewMode={useCallback((mode) => setIsPreviewMode(mode as PreviewMode), [])}
//           isLoading={isLoading}
//           SandpackWrapper={SandpackWrapper}
//         />
//       </div>
//     </div>
//   )
// }



"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { SandpackProvider, SandpackPreview, SandpackCodeEditor } from "@codesandbox/sandpack-react"
import { useChat, type UIMessage, type UIMessagePart } from "@/hooks/use-chat"
import { cn } from "@/lib/utils"
import {
  Send,
  StopCircle,
  Code,
  Eye,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Sparkles,
  Zap,
  Building2,
  Download,
} from "lucide-react"
import { Header } from "@/components/header"
import { ChatInput } from "@/components/chat/ChatInput"
import { PreviewPanel } from "@/components/chat/PreviewPanel"
import { SandpackWrapper } from "@/components/chat/SandpackWrapper"
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

type PreviewMode = "preview" | "editor"

// Enhanced loading animation with better visual feedback for AI generation
const AssistantLoader = () => (
  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
    <div className="relative">
      <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
      <div className="absolute inset-0 h-5 w-5 animate-ping rounded-full bg-violet-400 opacity-20" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-violet-900">Generating your landing page...</span>
      <span className="text-xs text-violet-600">This may take a few moments</span>
    </div>
  </div>
)

// Component for a shadow ghost layout for text during loading
const GhostTextLoader = () => (
  <div className="flex flex-col gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
    <div className="h-3 w-full bg-gray-200 rounded" />
    <div className="h-3 w-5/6 bg-gray-200 rounded" />
    <div className="h-3 w-4/5 bg-gray-200 rounded" />
  </div>
);


// Component to display streaming code in a visually appealing block
const StreamingCodeBlock = ({ code }: { code: string | null }) => {
  // Corrected useRef type to HTMLPreElement
  const scrollRef = useRef<HTMLPreElement>(null)

  // Auto-scroll to the bottom as new code streams in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [code])

  if (!code) return null

  return (
    <div className="mt-3 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          {/* Decorative "traffic light" dots */}
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-gray-400 font-mono">Generating code...</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Live indicator with pulse animation */}
          <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <pre
          ref={scrollRef}
          className="text-sm font-mono text-gray-100 p-4 overflow-x-auto whitespace-pre-wrap break-words"
        >
          <code className="break-all">{code}</code>
        </pre>
      </div>
    </div>
  )
}

// Component to display a finalized code block with copy and expand/collapse functionality
const CodeBlock = ({ code, onClick }: { code: string; onClick: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const lines = code.split("\n")
  const canBeTruncated = lines.length > 15 // Determine if code block is long enough to truncate

  // Display only first 15 lines if not expanded and can be truncated
  const displayedCode = canBeTruncated && !isExpanded ? lines.slice(0, 15).join("\n") + "\n..." : code

  // Handler to copy code to clipboard
  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent div's onClick
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
  }

  // Handler to toggle expanded state of the code block
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent div's onClick
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className="mt-4 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden cursor-pointer hover:border-violet-500/50 transition-colors"
      onClick={onClick} // Allows clicking to preview the code
      title="Click to preview this code"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          {/* Decorative "traffic light" dots */}
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-gray-400 font-mono">HTML</span>
        </div>
        {/* Copy button */}
        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-6 px-2 text-gray-400 hover:text-white">
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <div className="relative">
        <pre className="text-sm font-mono text-gray-100 p-4 overflow-x-auto whitespace-pre-wrap break-words">
          <code className="break-all">{displayedCode}</code>
        </pre>
        {canBeTruncated && (
          // "Show more/less" button for long code blocks
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4 flex justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExpandClick}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Type guard to check if a UIMessagePart is a code part
function isCodeUIPart(part: UIMessagePart): part is { type: "code"; code: string; language?: string } {
  return part.type === "code" && typeof part.code === "string"
}

// Separate Copy button for general use (e.g., in PreviewPanel)
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])
  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-9 w-9 p-0 rounded-lg" title="Copy code">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}

// Button to download the generated code as an HTML file
function DownloadButton({ code }: { code: string }) {
  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "landing-page.html" // Default filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code])
  return (
    <Button variant="ghost" size="sm" onClick={handleDownload} className="h-9 w-9 p-0 rounded-lg" title="Download code">
      <Download className="h-4 w-4" />
    </Button>
  )
}

// Main ChatInterface component
export function ChatInterface({ initialPrompt }: { initialPrompt?: string }) {
  // useChat hook provides chat state and actions.
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    initialInput: initialPrompt,
  })

  // State for managing code preview: index of current code block, preview mode, streaming code
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0)
  const [isPreviewMode, setIsPreviewMode] = useState<PreviewMode>("preview")
  const [streamingCode, setStreamingCode] = useState<string | null>(null)

  // State for mobile layout preview toggle
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false)

  // Refs for auto-scrolling chat and focusing input
  // Corrected useRef type to HTMLDivElement
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Extract all code parts from assistant messages for navigation
  const allCodeParts = messages
    .filter((m) => m.role === "assistant" && m.parts)
    .flatMap((m) => m.parts?.filter(isCodeUIPart) || [])

  // Update currentCodeIndex to the latest generated code block
  useEffect(() => {
    if (allCodeParts.length > 0) {
      setCurrentCodeIndex(allCodeParts.length - 1)
    }
  }, [allCodeParts.length])

  // Determine the current code block to display in the preview
  const currentCode = allCodeParts.length > 0 ? allCodeParts[currentCodeIndex]?.code : null

  // Effect to manage the `streamingCode` state for live display
  useEffect(() => {
    if (isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.role === "assistant") {
        // This regex is designed to extract the 'code' value from the streaming content.
        // It's less strict about the closing quote to allow for partial code snippets during streaming.
        const codeMatch = lastMessage.content.match(/"code"\s*:\s*"((?:\\.|[^"\\])*)/);

        if (codeMatch && codeMatch[1]) {
          // Directly unescape the captured string for display.
          // We avoid `JSON.parse` here because the streaming content might be incomplete JSON.
          const unescapedCode = codeMatch[1]
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"')
            .replace(/\\t/g, "\t")
            .replace(/\\r/g, "\r");
          setStreamingCode(unescapedCode);
        } else {
          setStreamingCode(null); // No code found in the current streaming part
        }
      }
    } else {
      // If `isLoading` is false (stream has finished or stopped), clear the `streamingCode`.
      // The final, complete code should now be available in `message.parts` via `useChat`.
      setStreamingCode(null);
    }
  }, [messages, isLoading]); // Dependencies for this effect


  // Set preview mode to "preview" when loading starts
  useEffect(() => {
    if (isLoading) {
      setIsPreviewMode("preview")
    }
  }, [isLoading])

  // Auto-scroll to the latest message in the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus the input field when not loading
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  // Automatically submit initial prompt if provided
  useEffect(() => {
    if (initialPrompt && messages.length === 0 && input === initialPrompt) {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt])

  // Determine which code to display: streaming code (if active) or a saved code block
  const codeToDisplay = streamingCode ?? currentCode

  // Handler for when a user selects a pre-defined prompt
  const handlePromptSelect = (prompt: string) => {
    // Mimic input change event
    const syntheticEvent = {
      target: { value: prompt },
    } as React.ChangeEvent<HTMLInputElement>

    handleInputChange(syntheticEvent)

    // Programmatically trigger form submission after a slight delay
    setTimeout(() => {
      const form = inputRef.current?.closest("form")
      if (form) {
        const submitEvent = new Event("submit", { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)
      }
    }, 10)
  }

  // Function to render content of a chat message, handling text and code parts
  const renderMessageContent = (message: UIMessage, isStreaming: boolean) => {
    // Determine if this is the currently active assistant message
    const isCurrentActiveAssistantMessage = message.role === "assistant" && messages[messages.length - 1]?.id === message.id;

    // Condition 1: If it's the current active assistant message and we have streamingCode (code is being generated)
    if (isCurrentActiveAssistantMessage && streamingCode !== null) {
      return (
        <div className="space-y-3">
          {isLoading && <AssistantLoader />} {/* Show loader if still actively loading */}
          <StreamingCodeBlock code={streamingCode} />
        </div>
      );
    }

    // Condition 2: If it's the current active assistant message, and loading, BUT no streamingCode yet (text is being generated)
    // In this case, we show the AssistantLoader and the GhostTextLoader for visual feedback.
    if (isCurrentActiveAssistantMessage && isLoading && streamingCode === null) {
        return (
            <div className="space-y-3">
                <AssistantLoader />
                <GhostTextLoader /> {/* Show ghost text while initial text is loading */}
            </div>
        );
    }

    // Condition 3: Message parts are available (message is finalized or has structured parts from useChat)
    if (message.parts && message.parts.length > 0) {
      return message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <div key={index} className="whitespace-pre-wrap leading-relaxed">
              {/* Use ReactMarkdown to render the text content, handling markdown syntax */}
              <ReactMarkdown>{part.text}</ReactMarkdown>
            </div>
          )
        }
        if (isCodeUIPart(part)) {
          // If a code part is found, render the CodeBlock component.
          const codeIndex = allCodeParts.findIndex((p) => p.code === part.code)
          const handleCodeClick = () => {
            if (codeIndex !== -1) {
              setCurrentCodeIndex(codeIndex)
              setIsPreviewMode("preview")
              if (isMobilePreviewOpen === false && window.innerWidth < 1024) {
                setIsMobilePreviewOpen(true)
              }
            }
          }
          return <CodeBlock key={index} code={part.code} onClick={handleCodeClick} />
        }
        return null // Fallback for unrecognized parts
      })
    }

    // Condition 4: Fallback for raw message.content, attempt to parse JSON to display text/code cleanly
    // This handles cases where message.parts might not be immediately populated but content is JSON.
    if (message.role === "assistant") {
      try {
        const parsedContent = JSON.parse(message.content);
        let renderedParts: JSX.Element[] = [];

        // Render text part if available from parsed content
        if (parsedContent.text) {
          renderedParts.push(
            <div key="text" className="whitespace-pre-wrap leading-relaxed">
              {/* Use ReactMarkdown here as well for JSON-parsed text, handling markdown syntax */}
              <ReactMarkdown>{parsedContent.text}</ReactMarkdown>
            </div>
          );
        }

        // Render code part if available from parsed content
        if (parsedContent.code) {
          const handleCodeClick = () => {
              const codeIndex = allCodeParts.findIndex((p) => p.code === parsedContent.code);
              if (codeIndex !== -1) {
                  setCurrentCodeIndex(codeIndex);
                  setIsPreviewMode("preview");
                  if (isMobilePreviewOpen === false && window.innerWidth < 1024) {
                      setIsMobilePreviewOpen(true);
                  }
              }
          };
          renderedParts.push(<CodeBlock key="code" code={parsedContent.code} onClick={handleCodeClick} />);
        }

        // Return rendered parts if any were successfully extracted from JSON
        if (renderedParts.length > 0) {
          return <>{renderedParts}</>;
        }
      } catch (e) {
        // If JSON parsing fails, it means the content is not structured JSON.
        // We will then fall through to the final fallback: rendering as plain text.
        // console.error("Failed to parse message content as JSON:", e); // Uncomment for debugging if needed
      }
    }

    // Final fallback: display the raw message.content if no parts were rendered
    // and JSON parsing failed or was not applicable (e.g., for user messages).
    return <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
  }

  // Memoized handlers for `ChatInput` to prevent unnecessary re-renders of the input component
  const stableHandleInputChange = useCallback(handleInputChange, [handleInputChange])
  const stableHandleSubmit = useCallback(handleSubmit, [handleSubmit])

  return (
    // Explicitly return a single JSX element, in this case, a React Fragment wrapping the main div.
    <>
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <Header /> {/* Application header */}

        {/* Mobile Layout: Toggle between Chat and Preview */}
        <div className="flex-1 flex flex-col lg:hidden">
          <div className="flex border-b bg-white">
            <Button
              variant={!isMobilePreviewOpen ? "default" : "ghost"}
              onClick={() => setIsMobilePreviewOpen(false)}
              className="flex-1 rounded-none"
            >
              Chat
            </Button>
            <Button
              variant={isMobilePreviewOpen ? "default" : "ghost"}
              onClick={() => setIsMobilePreviewOpen(true)}
              className="flex-1 rounded-none"
              disabled={!codeToDisplay} // Disable preview button if no code to display
            >
              Preview
            </Button>
          </div>

          {!isMobilePreviewOpen ? (
            // Mobile Chat View
            <Card className="flex-1 flex flex-col m-2 rounded-2xl border-0 shadow-lg">
              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                <ScrollArea className="flex-1 pb-4">
                  <div className="space-y-4 p-4">
                    {messages.length === 0 && (
                      // Initial welcome message and prompt
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-violet-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Amazing Landing Pages</h3>
                        <p className="text-gray-600 text-sm max-w-sm mx-auto">
                          Describe your vision and I'll generate a beautiful, responsive landing page for you.
                        </p>
                      </div>
                    )}
                    {messages.map((message, index) => {
                      const isStreaming = isLoading && message.role === "assistant" && index === messages.length - 1

                      return (
                        <div
                          key={message.id}
                          className={cn("flex w-full", message.role === "user" ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-3 max-w-[85%] shadow-sm break-words",
                              message.role === "user"
                                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                                : "bg-white text-gray-800 border border-gray-100",
                            )}
                            style={{ overflowWrap: "anywhere" }}
                          >
                            {/* Render message content using helper function */}
                            {renderMessageContent(message, isStreaming)}
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} /> {/* Element to scroll to for new messages */}
                  </div>
                </ScrollArea>
                <div className="border-t bg-white p-4 sticky bottom-0">
                  <ChatInput
                    input={input}
                    isLoading={isLoading}
                    handleInputChange={stableHandleInputChange}
                    handleSubmit={stableHandleSubmit}
                    inputRef={inputRef}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            // Mobile Preview View
            <Card className="flex-1 flex flex-col m-2 rounded-2xl border-0 shadow-lg">
              <CardHeader className="flex-none pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Preview</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                {codeToDisplay ? (
                  // SandpackWrapper for displaying code preview/editor
                  <SandpackWrapper
                    key={`${currentCodeIndex}-${isPreviewMode}`}
                    code={codeToDisplay}
                    mode={isPreviewMode}
                    className="flex-1 min-h-0 rounded-b-2xl overflow-hidden"
                  />
                ) : (
                  // Placeholder if no code is available for preview
                  <div className="flex h-full items-center justify-center text-gray-500 p-8">
                    <div className="text-center">
                      <Zap className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm">No preview available yet</p>
                      <p className="text-xs text-gray-400 mt-1">Generate a landing page to see the preview</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Desktop Layout: Fixed grid for Chat and Preview panels */}
        <div className="hidden lg:grid grid-cols-10 flex-1 min-h-0 overflow-hidden gap-4 p-4">
          {/* Left Panel: Chat */}
          <Card className="col-span-4 flex flex-col flex-1 min-h-0 rounded-2xl border-0 shadow-lg bg-white overflow-hidden">
            <CardHeader className="flex-none pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Chat</CardTitle>
                {error && (
                  // Reload button if an error occurs
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 flex flex-col overflow-hidden relative p-0">
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-6 p-6 pb-24">
                  {messages.length === 0 && (
                    // Initial welcome message and prompts for desktop
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-violet-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Amazing Landing Pages</h3>
                      <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                        Describe your vision and I'll generate a beautiful, responsive landing page for you.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center mt-6">
                        <Badge variant="secondary" className="text-xs">
                          Responsive Design
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Modern UI
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Fast Generation
                        </Badge>
                      </div>
                    </div>
                  )}
                  {messages.map((message, index) => {
                    const isStreaming = isLoading && message.role === "assistant" && index === messages.length - 1

                    return (
                      <div
                        key={message.id}
                        className={cn("flex w-full", message.role === "user" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "rounded-2xl px-5 py-4 max-w-[80%] shadow-sm break-words",
                            message.role === "user"
                              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                              : "bg-gray-50 text-gray-800 border border-gray-100",
                          )}
                          style={{ overflowWrap: "anywhere" }}
                        >
                          {renderMessageContent(message, isStreaming)}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} /> {/* Element to scroll to */}
                </div>
              </ScrollArea>
              <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-6">
                <ChatInput
                  input={input}
                  isLoading={isLoading}
                  handleInputChange={stableHandleInputChange}
                  handleSubmit={stableHandleSubmit}
                  inputRef={inputRef}
                  className="w-full gap-4"
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Panel: Preview & Code (Desktop) */}
          <PreviewPanel
            codeToDisplay={codeToDisplay}
            allCodeParts={allCodeParts}
            currentCodeIndex={currentCodeIndex}
            setCurrentCodeIndex={useCallback((i) => setCurrentCodeIndex(i), [])}
            isPreviewMode={isPreviewMode}
            setIsPreviewMode={useCallback((mode) => setIsPreviewMode(mode as PreviewMode), [])}
            isLoading={isLoading}
            SandpackWrapper={SandpackWrapper}
          />
        </div>
      </div>
    </>
  )
}
