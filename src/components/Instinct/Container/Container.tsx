"use client"
import { useEffect, useRef, useState, useTransition } from "react"
import { InstinctContainerContext } from "./ContainerContext"

export function Container({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<Error | null>(null)
  const [animatingTags, setAnimatingTags] = useState<string[]>([])
  const animationsOnStart = useRef<(() => void)[]>([])
  const animationsOnEnd = useRef<(() => void)[]>([])

  const registerAnimation = (handler: () => void) => {
    animationsOnStart.current = [...animationsOnStart.current, handler]
  }
  const unregisterAnimation = (handler: () => void) => {
    animationsOnStart.current = animationsOnStart.current.filter((h) => h !== handler)
  }
  const registerAnimationOnEnd = (handler: () => void) => {
    animationsOnEnd.current = [...animationsOnEnd.current, handler]
  }
  const unregisterAnimationOnEnd = (handler: () => void) => {
    animationsOnEnd.current = animationsOnEnd.current.filter((h) => h !== handler)
  }

  useEffect(() => {
    if (!isPending) {
      animationsOnEnd.current.forEach((h) => h())
      setAnimatingTags([])
    }
  }, [isPending])
  const startTransitionInternal = (handler: () => Promise<void>, animationTag?: string) => {
    setError(null)
    if (animationTag) setAnimatingTags((prev) => [...prev, animationTag])
    animationsOnStart.current.forEach((h) => h())
    startTransition(async () => {
      await handler().catch((error) => {
        setError(error ?? null)
        console.error(error)
      })
    })
  }

  return (
    <InstinctContainerContext
      value={{
        isPending: isPending,
        error: error,
        animationTags: animatingTags,
        startTransition: startTransitionInternal,
        registerAnimationOnStart: registerAnimation,
        unregisterAnimationOnStart: unregisterAnimation,
        registerAnimationOnEnd: registerAnimationOnEnd,
        unregisterAnimationOnEnd: unregisterAnimationOnEnd,
      }}
    >
      {children}
    </InstinctContainerContext>
  )
}
