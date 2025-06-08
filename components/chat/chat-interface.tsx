"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
} from "lucide-react"
import { Header } from "@/components/header"

type PreviewMode = "preview" | "editor"

// Enhanced loading animation with better visual feedback
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

// Enhanced streaming code block with better visual feedback
const StreamingCodeBlock = ({ code }: { code: string | null }) => {
  const scrollRef = useRef<HTMLPreElement>(null)

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
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-gray-400 font-mono">Generating code...</span>
        </div>
        <div className="flex items-center gap-1">
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

// Enhanced code block with copy functionality
const CodeBlock = ({ code, onClick }: { code: string; onClick: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const lines = code.split("\n")
  const canBeTruncated = lines.length > 15

  const displayedCode = canBeTruncated && !isExpanded ? lines.slice(0, 15).join("\n") + "\n..." : code

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the parent div's onClick from firing
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the parent div's onClick from firing
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className="mt-4 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden cursor-pointer hover:border-violet-500/50 transition-colors"
      onClick={onClick}
      title="Click to preview this code"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-gray-400 font-mono">HTML</span>
        </div>
        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-6 px-2 text-gray-400 hover:text-white">
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <div className="relative">
        <pre className="text-sm font-mono text-gray-100 p-4 overflow-x-auto whitespace-pre-wrap break-words">
          <code className="break-all">{displayedCode}</code>
        </pre>
        {canBeTruncated && (
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

function isCodeUIPart(part: UIMessagePart): part is { type: "code"; code: string; language?: string } {
  return part.type === "code" && typeof part.code === "string"
}

const SandpackWrapper = ({ code, mode, className }: { code: string; mode: PreviewMode; className?: string }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div className={cn("relative flex flex-col h-full min-h-0", isFullscreen && "fixed inset-0 z-50 bg-white", className)}>
      <div className="absolute right-3 top-3 z-10 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-white/90 hover:bg-white shadow-sm"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const iframe = document.querySelector("iframe")
            if (iframe) {
              iframe.contentWindow?.location.reload()
            }
          }}
          className="bg-white/90 hover:bg-white shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <ScrollArea className="flex-1 min-h-0 max-h-full overflow-y-auto">
          <SandpackProvider
            template="static"
            files={{
              "/index.html": code,
            }}
            options={{
              activeFile: "/index.html",
              recompileMode: "delayed",
              recompileDelay: 300,
            }}
            theme="dark"
          >
            {mode === "preview" ? (
              <SandpackPreview
                style={{ minHeight: 820, maxHeight: '100%', width: '100%' }}
                showNavigator={false}
                showRefreshButton={false}
              />
            ) : (
              <SandpackCodeEditor
                style={{ minHeight: 400, maxHeight: '100%', width: '100%' }}
                showLineNumbers={true}
                showTabs={false}
                wrapContent={true}
              />
            )}
          </SandpackProvider>
        </ScrollArea>
      </div>
    </div>
  )
}

export function ChatInterface({ initialPrompt }: { initialPrompt?: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, error } = useChat({
    initialInput: initialPrompt,
  })

  const [currentCodeIndex, setCurrentCodeIndex] = useState(0)
  const [isPreviewMode, setIsPreviewMode] = useState<PreviewMode>("preview")
  const [streamingCode, setStreamingCode] = useState<string | null>(null)
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const allCodeParts = messages
    .filter((m) => m.role === "assistant" && m.parts)
    .flatMap((m) => m.parts?.filter(isCodeUIPart) || [])

  useEffect(() => {
    if (allCodeParts.length > 0) {
      setCurrentCodeIndex(allCodeParts.length - 1)
    }
  }, [allCodeParts.length])

  const currentCode = allCodeParts.length > 0 ? allCodeParts[currentCodeIndex]?.code : null

  useEffect(() => {
    if (isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.role === "assistant") {
        const content = lastMessage.content
        const codeMatch = content.match(/"code"\s*:\s*"((?:\\.|[^"\\])*)/)

        if (codeMatch && codeMatch[1]) {
          const unescapedCode = codeMatch[1]
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"')
            .replace(/\\t/g, "\t")
            .replace(/\\r/g, "\r")
          setStreamingCode(unescapedCode)
        }
      }
    } else {
      setStreamingCode(null)
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (isLoading) {
      setIsPreviewMode("preview")
    }
  }, [isLoading])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when not loading
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  useEffect(() => {
    if (initialPrompt && messages.length === 0 && input === initialPrompt) {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt])

  const codeToDisplay = streamingCode ?? currentCode

  const renderMessageContent = (message: UIMessage, isStreaming: boolean) => {
    if (isStreaming && isLoading) {
      return (
        <div className="space-y-3">
          <AssistantLoader />
          <StreamingCodeBlock code={streamingCode} />
        </div>
      )
    }

    if (message.parts && message.parts.length > 0) {
      return message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <div key={index} className="whitespace-pre-wrap leading-relaxed">
              {part.text}
            </div>
          )
        }
        if (isCodeUIPart(part)) {
          // Re-add click handler logic
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
        return null
      })
    }

    return <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Header />

      {/* Mobile Layout */}
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
            disabled={!codeToDisplay}
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
                          {renderMessageContent(message, isStreaming)}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="border-t bg-white p-4 sticky bottom-0">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Describe your landing page..."
                    disabled={isLoading}
                    className="flex-1 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                  />
                  {isLoading ? (
                    <Button type="button" variant="outline" size="icon" onClick={stop} className="rounded-xl">
                      <StopCircle className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim()}
                      className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                </form>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Mobile Preview View
          <Card className="flex-1 flex flex-col m-2 rounded-2xl border-0 shadow-lg">
            <CardHeader className="flex-none pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Preview</CardTitle>
                <div className="flex items-center gap-2">
                  {allCodeParts.length > 1 && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentCodeIndex((i) => Math.max(0, i - 1))}
                        disabled={currentCodeIndex === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Badge variant="secondary" className="text-xs px-2">
                        {currentCodeIndex + 1}/{allCodeParts.length}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentCodeIndex((i) => Math.min(allCodeParts.length - 1, i + 1))}
                        disabled={currentCodeIndex === allCodeParts.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Tabs value={isPreviewMode} onValueChange={(value) => setIsPreviewMode(value as PreviewMode)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preview" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="editor" className="text-xs">
                        <Code className="h-3 w-3 mr-1" />
                        Code
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {codeToDisplay ? (
                <SandpackWrapper
                  key={`${currentCodeIndex}-${isPreviewMode}`}
                  code={codeToDisplay}
                  mode={isPreviewMode}
                  className="flex-1 min-h-0 rounded-b-2xl overflow-hidden"
                />
              ) : (
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

      {/* Desktop Layout - Switched to CSS Grid for fixed panel widths */}
      <div className="hidden lg:grid grid-cols-10 flex-1 min-h-0 overflow-hidden gap-4 p-4">
        {/* Left Panel: Chat */}
        <Card className="col-span-4 flex flex-col flex-1 min-h-0 rounded-2xl border-0 shadow-lg bg-white overflow-hidden">
          <CardHeader className="flex-none pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Chat</CardTitle>
              {error && (
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
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-violet-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Amazing Landing Pages</h3>
                    <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                      Describe your vision and I'll generate a beautiful, responsive landing page tailored to your
                      needs.
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
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-6">
              <form onSubmit={handleSubmit} className="flex items-center gap-4">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Describe the landing page you want to create..."
                  disabled={isLoading}
                  className="flex-1 h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500 text-base"
                />
                {isLoading ? (
                  <Button type="button" variant="outline" size="lg" onClick={stop} className="rounded-xl h-12 px-6">
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!input.trim()}
                    className="rounded-xl h-12 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                )}
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel: Preview & Code */}
        <Card className="col-span-6 flex flex-col flex-1 min-h-0 rounded-2xl border-0 shadow-lg bg-white overflow-hidden">
          <CardHeader className="flex-none pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Preview</CardTitle>
              <div className="flex items-center gap-4">
                {allCodeParts.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentCodeIndex((i) => Math.max(0, i - 1))}
                      disabled={currentCodeIndex === 0}
                      className="h-9 w-9 p-0 rounded-lg"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Badge variant="secondary" className="px-3 py-1 font-mono">
                      {currentCodeIndex + 1} / {allCodeParts.length}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentCodeIndex((i) => Math.min(allCodeParts.length - 1, i + 1))}
                      disabled={currentCodeIndex === allCodeParts.length - 1}
                      className="h-9 w-9 p-0 rounded-lg"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Tabs value={isPreviewMode} onValueChange={(value) => setIsPreviewMode(value as PreviewMode)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview" className="w-28">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="editor" className="w-28">
                      <Code className="h-4 w-4 mr-2" />
                      Code
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 flex flex-col overflow-hidden p-0">
            {codeToDisplay ? (
              <SandpackWrapper
                key={`${currentCodeIndex}-${isPreviewMode}`}
                code={codeToDisplay}
                mode={isPreviewMode}
                className="flex-1 min-h-0 rounded-b-2xl overflow-hidden"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500 p-12">
                <div className="text-center">
                  <Zap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Create</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    {isLoading
                      ? "Generating your landing page..."
                      : "Start a conversation to generate your first landing page!"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
