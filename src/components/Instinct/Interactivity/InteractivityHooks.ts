"use client"
import { useInstinctContainerContext } from "../Container/ContainerContext"
import { useInstinctInteractivityContext } from "./interactivityContext"

export function useInteractiveTransition() {
  const { isPending, error } = useInstinctContainerContext()
  const ic = useInstinctInteractivityContext()
  return [isPending, error, ic.startTransition] as const
}
