"use client"
import { useInstinctContainerContext } from "../Container/ContainerContext"
import { useInstinctRootContext } from "../root/RootContext"
import { InstinctInteractivityContext } from "./interactivityContext"

export function Interactivity({
  children,
  transitionTag,
  animationTag,
  preserveAllLocalTransitions,
}: {
  children: React.ReactNode
  transitionTag?: string
  animationTag?: string
  preserveAllLocalTransitions?: boolean
}) {
  const { startTransition } = useInstinctContainerContext()
  const { startTaggedTransition } = useInstinctRootContext()
  const startTransitionInternal = (handler: () => Promise<void>) => {
    if (!transitionTag || preserveAllLocalTransitions) startTransition(handler, animationTag)
    if (transitionTag) startTaggedTransition(handler, transitionTag, animationTag)
  }

  return (
    <InstinctInteractivityContext value={{ InteractivityTag: transitionTag, startTransition: startTransitionInternal }}>
      {children}
    </InstinctInteractivityContext>
  )
}
