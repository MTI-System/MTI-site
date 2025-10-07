"use client"
import { JSAnimation } from "animejs"
import { createContext, useContext } from "react"

export interface InstinctAnimatedContentContextInterface {
  animationDirection: "enter" | "exit" | null
  registerAnimation: (a: JSAnimation, animationDirection: "enter" | "exit") => void
  unregisterAnimation: (a: JSAnimation, animationDirection: "enter" | "exit") => void
}

export const InstinctAnimatedContentContext = createContext<InstinctAnimatedContentContextInterface | undefined>(
  undefined,
)

export function useInstinctAnimatedContentContext() {
  const context = useContext(InstinctAnimatedContentContext)
  if (context === undefined) {
    throw new Error(
      "Instinct: InstainctAnimatedContentContext is missing. instinct parts must be placed within <Instinct.AnimatedContent>.",
    )
  }

  return context
}
