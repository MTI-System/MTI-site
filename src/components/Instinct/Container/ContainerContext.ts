"use client"
import { createContext, useContext } from "react"

export interface InstinctContainerContextInterface {
  isPending: boolean
  error: Error | null
  animationTags: string[]
  startTransition: (handler: () => Promise<void>, animationTag?: string) => void
  registerAnimationOnStart: (handler: () => void) => void
  unregisterAnimationOnStart: (handler: () => void) => void
  registerAnimationOnEnd: (handler: () => void) => void
  unregisterAnimationOnEnd: (handler: () => void) => void
}

export const InstinctContainerContext = createContext<InstinctContainerContextInterface | undefined>(undefined)

export function useInstinctContainerContext() {
  const context = useContext(InstinctContainerContext)
  if (context === undefined) {
    throw new Error(
      "Instinct: InstainctContainerContext is missing. instinct parts must be placed within <Instinct.Container>.",
    )
  }

  return context
}
