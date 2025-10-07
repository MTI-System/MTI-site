"use client"
import { useEffect, useRef, useState, useTransition } from "react"
import { InstinctRootContext } from "./RootContext"

export function Root({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<Error | null>(null)
  const [animatingTags, setAnimatingTags] = useState<string[]>([])
  const [pendingTags, setPendingTags] = useState<string[]>([])
  const animationsOnStart = useRef<{ handler: () => void; tags: string[] }[]>([])
  const animationsOnEnd = useRef<{ handler: () => void; tags: string[] }[]>([])

  const registerAnimation = (handler: () => void, tags: string[]) => {
    animationsOnStart.current = [...animationsOnStart.current, { handler, tags }]
  }
  const unregisterAnimation = (handler: () => void) => {
    animationsOnStart.current = animationsOnStart.current.filter((h) => h.handler !== handler)
  }
  const registerAnimationOnEnd = (handler: () => void, tags: string[]) => {
    animationsOnEnd.current = [...animationsOnEnd.current, { handler, tags }]
  }
  const unregisterAnimationOnEnd = (handler: () => void) => {
    animationsOnEnd.current = animationsOnEnd.current.filter((h) => h.handler !== handler)
  }
  useEffect(() => {
    if (!isPending) {
      setAnimatingTags([])
      setPendingTags([])
      animationsOnEnd.current.forEach((h) => h.handler())
    }
  }, [isPending])
  const startTransitionInternal = (handler: () => Promise<void>, transitionTag: string, animationTag?: string) => {
    setError(null)
    if (animationTag) setAnimatingTags((prev) => [...prev, animationTag])
    setPendingTags((prev) => [...prev, transitionTag])
    animationsOnStart.current.forEach((h) => h.tags.includes(transitionTag) && h.handler())
    startTransition(async () => {
      await handler().catch((error) => {
        setError(error ?? null)
        console.error(error)
      })
    })
  }

  return (
    <InstinctRootContext
      value={{
        isPending,
        error,
        animatingTags,
        startTaggedTransition: startTransitionInternal,
        pendingTags: pendingTags,
        registerAnimationOnStart: registerAnimation,
        unregisterAnimationOnStart: unregisterAnimation,
        registerAnimationOnEnd: registerAnimationOnEnd,
        unregisterAnimationOnEnd: unregisterAnimationOnEnd,
      }}
    >
      {children}
    </InstinctRootContext>
  )
}
