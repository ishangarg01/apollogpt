import React, { useCallback } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Code, ChevronLeft, ChevronRight, Download, Copy, Check, Zap } from "lucide-react"
import { SandpackWrapper } from "./SandpackWrapper"

const CopyButton = React.memo(function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false)
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
})

const DownloadButton = React.memo(function DownloadButton({ code }: { code: string }) {
  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "landing-page.html"
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
})

export const PreviewPanel = React.memo(function PreviewPanel({
  codeToDisplay,
  allCodeParts,
  currentCodeIndex,
  setCurrentCodeIndex,
  isPreviewMode,
  setIsPreviewMode,
  isLoading,
  SandpackWrapper,
}: {
  codeToDisplay: string | null
  allCodeParts: { code: string }[]
  currentCodeIndex: number
  setCurrentCodeIndex: (index: number) => void
  isPreviewMode: string
  setIsPreviewMode: (mode: string) => void
  isLoading: boolean
  SandpackWrapper: React.ComponentType<{ code: string; mode: string; className?: string }>
}) {
  // Memoize handlers
  const handlePrev = useCallback(() => setCurrentCodeIndex(Math.max(0, currentCodeIndex - 1)), [setCurrentCodeIndex, currentCodeIndex])
  const handleNext = useCallback(() => setCurrentCodeIndex(Math.min(allCodeParts.length - 1, currentCodeIndex + 1)), [setCurrentCodeIndex, currentCodeIndex, allCodeParts.length])
  const handleTabChange = useCallback((value: string) => setIsPreviewMode(value), [setIsPreviewMode])

  return (
    <Card className="col-span-6 flex flex-col flex-1 min-h-0 rounded-2xl border-0 shadow-lg bg-white overflow-hidden">
      <CardHeader className="flex-none pb-3" />
      <CardContent className="flex-1 min-h-0 flex flex-col overflow-hidden p-0">
        {codeToDisplay && (
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold">Preview</span>
              {allCodeParts.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
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
                    onClick={handleNext}
                    disabled={currentCodeIndex === allCodeParts.length - 1}
                    className="h-9 w-9 p-0 rounded-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={isPreviewMode} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview" className="w-20">
                    <Eye className="h-4 w-4 mr-1" /> Preview
                  </TabsTrigger>
                  <TabsTrigger value="editor" className="w-20">
                    <Code className="h-4 w-4 mr-1" /> Code
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <CopyButton code={codeToDisplay} />
              <DownloadButton code={codeToDisplay} />
            </div>
          </div>
        )}
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
  )
}) 