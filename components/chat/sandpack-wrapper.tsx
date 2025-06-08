import { Sandpack } from '@codesandbox/sandpack-react'
import { Button } from '@/components/ui/button'
import { Eye, Code } from 'lucide-react'

interface SandpackWrapperProps {
  code: string
  mode: 'preview' | 'editor'
}

export function SandpackWrapper({ code, mode }: SandpackWrapperProps) {
  return (
    <div className="relative h-full">
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const iframe = document.querySelector('iframe')
            if (iframe) {
              iframe.contentWindow?.location.reload()
            }
          }}
        >
          {mode === 'preview' ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
        </Button>
      </div>
      <Sandpack
        template="static"
        files={{
          '/index.html': code,
        }}
        options={{
          showNavigator: false,
          showTabs: false,
          showLineNumbers: true,
          showInlineErrors: true,
          closableTabs: false,
          wrapContent: true,
          readOnly: mode === 'preview',
          activeFile: '/index.html',
        }}
        theme="dark"
      />
    </div>
  )
} 