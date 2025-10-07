"use client"
import { createContext, useContext } from "react"

export interface InstinctInteractivityContextInterface {
  InteractivityTag?: string
  startTransition: (handler: () => Promise<void>) => void
}

export const InstinctInteractivityContext = createContext<InstinctInteractivityContextInterface | undefined>(undefined)

export function useInstinctInteractivityContext() {
  const context = useContext(InstinctInteractivityContext)
  if (context === undefined) {
    throw new Error(
      "Instinct: InstainctInteractivityContext is missing. instinct parts must be placed within <Instinct.Interactivity>.",
    )
  }

  return context
}
