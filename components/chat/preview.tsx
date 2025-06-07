import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function Preview() {
  const [html, setHtml] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "html-update") {
        setHtml(event.data.html)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "landing-page.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Preview</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={!html || isLoading}
        >
          {isLoading ? (
            <Icons.spinner className="h-4 w-4 animate-spin" />
          ) : (
            <Icons.download className="h-4 w-4" />
          )}
          Download
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <iframe
          srcDoc={html}
          className="w-full h-full border-0"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  )
} 