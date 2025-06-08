// import React, { useCallback } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Send, StopCircle } from "lucide-react"

// interface ChatInputProps {
//   input: string
//   isLoading: boolean
//   handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
//   stop: () => void
//   inputRef: React.RefObject<HTMLInputElement>
//   className?: string
// }

// const ChatInputComponent = ({
//   input,
//   isLoading,
//   handleInputChange,
//   handleSubmit,
//   stop,
//   inputRef,
//   className = "",
// }: ChatInputProps) => {
//   // Memoize handlers to avoid rerenders
//   const onChange = useCallback(handleInputChange, [handleInputChange])
//   const onSubmit = useCallback(handleSubmit, [handleSubmit])
//   const onStop = useCallback(stop, [stop])

//   return (
//     <form onSubmit={onSubmit} className={`flex items-center gap-3 ${className}`}>
//       <Input
//         ref={inputRef}
//         value={input}
//         onChange={onChange}
//         placeholder="Describe your landing page..."
//         disabled={isLoading}
//         className="flex-1 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
//       />
//       {isLoading ? (
//         <Button type="button" variant="outline" size="icon" onClick={onStop} className="rounded-xl">
//           <StopCircle className="h-4 w-4" />
//         </Button>
//       ) : (
//         <Button
//           type="submit"
//           size="icon"
//           disabled={!input.trim()}
//           className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
//         >
//           <Send className="h-4 w-4" />
//         </Button>
//       )}
//     </form>
//   )
// }

// export const ChatInput = React.memo(ChatInputComponent) 



"use client"

import React from "react"
import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react" // Import Loader2 for the spinner

interface ChatInputProps {
  input: string
  isLoading: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  // The 'stop' prop has been intentionally removed as per previous discussions,
  // as the UI no longer provides a way to pause/stop directly from this component.
  inputRef: React.RefObject<HTMLInputElement>
  className?: string
}

const ChatInputComponent = ({
  input,
  isLoading,
  handleInputChange,
  handleSubmit,
  inputRef, // 'stop' is no longer destructured here as it's not a prop
  className = "",
}: ChatInputProps) => {
  // Memoize handlers to avoid unnecessary rerenders for performance
  const onChange = useCallback(handleInputChange, [handleInputChange])
  const onSubmit = useCallback(handleSubmit, [handleSubmit])
  // The 'onStop' callback is no longer needed as the stop functionality is removed from this UI

  return (
    <form onSubmit={onSubmit} className={`flex items-center gap-3 ${className}`}>
      {/* Input field for typing the message */}
      <Input
        ref={inputRef} // Ref for direct DOM access, e.g., for focusing
        value={input} // Controlled component value
        onChange={onChange} // Handler for input changes
        placeholder="Describe your landing page..." // Placeholder text
        disabled={isLoading} // Disable input while a response is loading
        className="flex-1 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
      />
      {/*
        Send button with integrated loading spinner.
        It is disabled when loading or if the input is empty.
      */}
      <Button
        type="submit" // Submits the form
        size="icon" // Standard icon button size
        disabled={isLoading || !input.trim()} // Button is disabled if loading or input has no text
        className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
      >
        {isLoading ? (
          // Show a spinning loader icon when the AI is processing/loading
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          // Show the send icon when not loading and ready to send
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  )
}

// Memoize the component to prevent unnecessary re-renders when parent components re-render
export const ChatInput = React.memo(ChatInputComponent)
