import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { RefreshCw, Maximize2, Minimize2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SandpackProvider, SandpackPreview, SandpackCodeEditor } from "@codesandbox/sandpack-react"

type PreviewMode = "preview" | "editor"

export const SandpackWrapper = ({ code, mode, className }: { code: string; mode: PreviewMode | string; className?: string }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div
      className={cn("relative flex flex-col h-full min-h-0", isFullscreen && "fixed inset-0 z-50 bg-white", className)}
    >
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
                style={{ minHeight: 820, maxHeight: "100%", width: "100%" }}
                showNavigator={false}
                showRefreshButton={false}
              />
            ) : (
              <SandpackCodeEditor
                style={{ minHeight: 400, maxHeight: "100%", width: "100%" }}
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

export default SandpackWrapper 