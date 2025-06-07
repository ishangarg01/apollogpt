"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sandpack, SandpackPreview, SandpackProvider, SandpackCodeEditor, useSandpack } from "@codesandbox/sandpack-react"
import { Icons } from "@/components/icons"
import { useChat } from "@/hooks/use-chat"
import { debounce } from "lodash"
import { ProfileMenu } from "@/components/profile/profile-menu"

interface Message {
  role: "user" | "assistant"
  content: string
  code?: string
  timestamp: number
}

// Hook to check if Prettier is supported
const useIsPrettier = () => {
  const [prettier, setPrettier] = useState(false)
  const { sandpack } = useSandpack()

  useEffect(() => {
    const activeFile = sandpack.files[sandpack.activeFile]
    if (!activeFile) return

    const fileExtension = sandpack.activeFile.split(".").pop()?.toLowerCase()
    if (!fileExtension) return

    const prettierExtensions = ["js", "ts", "jsx", "tsx", "scss", "css", "html"]
    const isPrettierSupported = !(activeFile.readOnly || !prettierExtensions.includes(fileExtension))

    setPrettier(isPrettierSupported)
  }, [sandpack.files, sandpack.activeFile])

  return { prettier }
}

// Hook to handle Prettier formatting
const usePrettier = () => {
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const { sandpack } = useSandpack()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault()
        prettifyCode()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [sandpack.files, sandpack.activeFile])

  const debouncedUpdate = useCallback(
    debounce((code: string) => {
      sandpack.updateCurrentFile(code, false)
    }, 150),
    [sandpack.activeFile, sandpack.files]
  )

  const prettifyCode = async () => {
    const activeFile = sandpack.files[sandpack.activeFile]
    const currentCode = activeFile.code

    try {
      const fileExtension = sandpack.activeFile.split(".").pop()?.toLowerCase()
      let formattedCode = currentCode

      // Dynamically import prettier and its plugins
      const prettier = await import("prettier/standalone")
      const parserBabel = await import("prettier/parser-babel")
      const parserHtml = await import("prettier/parser-html")
      const parserPostcss = await import("prettier/parser-postcss")
      const parserTypescript = await import("prettier/parser-typescript")

      if (fileExtension === "scss" || fileExtension === "css") {
        formattedCode = await prettier.default.format(currentCode, {
          parser: "scss",
          plugins: [parserPostcss.default],
        })
      } else {
        formattedCode = await prettier.default.format(currentCode, {
          parser: fileExtension === "ts" || fileExtension === "tsx" ? "typescript" : "babel",
          plugins: [parserBabel.default, parserTypescript.default, parserHtml.default],
        })
      }

      setError(false)
      setSuccess(true)
      debouncedUpdate(formattedCode)
    } catch (error) {
      setError(true)
      console.error(error)
    } finally {
      setTimeout(() => {
        setSuccess(false)
      }, 500)
    }
  }

  return { error, success, prettifyCode }
}

// Prettier Plugin Button Component
function PrettierButton() {
  const { error, success, prettifyCode } = usePrettier()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={prettifyCode}
      className={error ? "text-destructive" : success ? "text-green-500" : ""}
    >
      {error ? (
        <Icons.alert className="h-4 w-4" />
      ) : (
        <Icons.check className="h-4 w-4" />
      )}
    </Button>
  )
}

// Code Editor Component with Prettier
function CodeEditorWithPrettier() {
  const { prettier } = useIsPrettier()

  return (
    <div className="h-full">
      <div className="flex justify-end p-2">
        {prettier && <PrettierButton />}
      </div>
      <SandpackCodeEditor
        style={{ height: "calc(100% - 40px)", width: "100%" }}
        showLineNumbers={true}
        showInlineErrors={true}
        wrapContent={true}
        showTabs={true}
      />
    </div>
  )
}

export function ChatInterface({ prompt }: { prompt?: string }) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const [leftWidth, setLeftWidth] = useState(50) // percentage
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentCode, setCurrentCode] = useState<string>("")
  const initialPromptSent = useRef(false)
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, sendMessage } = useChat()

  // Send initial prompt as first message if provided and no messages exist
  useEffect(() => {
    if (prompt && messages.length === 0 && !initialPromptSent.current) {
      sendMessage(prompt)
      initialPromptSent.current = true
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt])

  // Update currentCode when new message with code arrives
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.code) {
      setCurrentCode(lastMessage.code)
    }
  }, [messages])

  const handleCopyCode = async () => {
    if (currentCode) {
      await navigator.clipboard.writeText(currentCode)
    }
  }

  const handleDownloadCode = () => {
    if (currentCode) {
      const blob = new Blob([currentCode], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "landing-page.html"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    
    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
    
    // Constrain between 20% and 80%
    const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80)
    setLeftWidth(constrainedWidth)
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add and remove event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const hasCode = currentCode !== ""

  return (
    <div 
      ref={containerRef}
      className="flex h-[calc(100vh-4rem)] gap-1 p-4"
    >
      {/* Chat Panel */}
      <Card style={{ width: `${leftWidth}%` }} className="flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle>Chat</CardTitle>
            <ProfileMenu />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2 flex-shrink-0">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin" />
              ) : (
                <Icons.send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resizable Divider */}
      <div 
        className="w-1 bg-border hover:bg-accent cursor-col-resize flex-shrink-0 transition-colors"
        onMouseDown={handleMouseDown}
      />

      {/* Preview/Code Panel */}
      <Card style={{ width: `${100 - leftWidth}%` }} className="flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle>Preview</CardTitle>
            {hasCode && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                >
                  <Icons.copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDownloadCode}
                >
                  <Icons.download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0 p-0">
          <div className="px-6 pb-2 flex-shrink-0">
            <Tabs 
              value={activeTab} 
              onValueChange={(v) => setActiveTab(v as "preview" | "code")}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex-1 min-h-0">
            {activeTab === "preview" && (
              <div className="h-full">
                {hasCode ? (
                  <SandpackProvider
                    key={`preview-${currentCode}`}
                    style={{ height: "100%", width: "100%" }}
                    template="static"
                    files={{
                      "/index.html": currentCode,
                    }}
                    options={{
                      activeFile: "/index.html",
                      recompileMode: "delayed",
                      recompileDelay: 300,
                    }}
                  >
                    <SandpackPreview
                      style={{ height: "100%", width: "100%" }}
                      showNavigator={false}
                      showRefreshButton={true}
                    />
                  </SandpackProvider>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No preview available
                  </div>
                )}
              </div>
            )}

            {activeTab === "code" && (
              <div className="h-full">
                {hasCode ? (
                  <SandpackProvider
                    key={`code-${currentCode}`}
                    style={{ height: "100%", width: "100%" }}
                    template="static"
                    files={{
                      "/index.html": currentCode,
                    }}
                    options={{
                      activeFile: "/index.html",
                      recompileMode: "delayed",
                      recompileDelay: 300,
                    }}
                  >
                    <CodeEditorWithPrettier />
                  </SandpackProvider>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No code available
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}