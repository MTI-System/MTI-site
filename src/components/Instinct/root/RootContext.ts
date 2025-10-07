"use client"
import { createContext, useContext } from "react"

export interface InstinctRootContextInterface {
  isPending: boolean
  error: Error | null
  animatingTags: string[]
  startTaggedTransition: (handler: () => Promise<void>, transitionTag: string, animationTag?: string) => void
  pendingTags: string[]
  registerAnimationOnStart: (handler: () => void, tags: string[]) => void
  unregisterAnimationOnStart: (handler: () => void) => void
  registerAnimationOnEnd: (handler: () => void, tags: string[]) => void
  unregisterAnimationOnEnd: (handler: () => void) => void
}

export const InstinctRootContext = createContext<InstinctRootContextInterface | undefined>(undefined)

export function useInstinctRootContext() {
  const context = useContext(InstinctRootContext)
  if (context === undefined) {
    throw new Error("Instinct: InstainctRootContext is missing. instinct parts must be placed within <Instinct.Root>.")
  }

  return context
}
