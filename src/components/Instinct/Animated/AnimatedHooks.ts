"use client"
import { useEffect, useRef } from "react"
import { useInstinctAnimatedContentContext } from "../AnimatedContent/AnimatedContentContext"
import { animate, AnimationParams, createScope, Scope } from "animejs"
import { useInstinctContainerContext } from "../Container/ContainerContext"
import { useInstinctRootContext } from "../root/RootContext"

export function useAnimated(
  enterAnimation: Omit<AnimationParams, "autoplay">,
  exitAnimation: Omit<AnimationParams, "autoplay">,
  taggedAnimations?: {
    [key: string]: {
      enterAnimation: Omit<AnimationParams, "autoplay">
      exitAnimation: Omit<AnimationParams, "autoplay">
    }
  },
) {
  const { animationDirection, registerAnimation, unregisterAnimation } = useInstinctAnimatedContentContext()
  const { animationTags } = useInstinctContainerContext()
  const { animatingTags: animatingTagsRoot } = useInstinctRootContext()
  const root = useRef<HTMLDivElement>(null)
  const scope = useRef<Scope | null>(null)

  useEffect(() => {
    if (animationDirection === null) return
    scope.current = createScope({ root }).add((self) => {
      if (!root.current) return
      const taggedAnimationKey = [...animationTags, ...animatingTagsRoot].find((tag) => taggedAnimations?.[tag])
      const taggedAnimation = taggedAnimationKey ? taggedAnimations?.[taggedAnimationKey] : null
      if (animationDirection === "enter") {
        const {
          onBegin: enterOnBegin,
          onComplete: enterOnComplete,
          ...enterRest
        } = taggedAnimation?.enterAnimation ?? enterAnimation
        animate(root.current, {
          autoplay: true,
          onBegin: (self, e) => {
            registerAnimation(self, "enter")
            // @ts-expect-error animejs typing system is broken
            if (enterOnBegin) enterOnBegin(self, e)
          },
          onComplete: (self, e) => {
            unregisterAnimation(self, "enter")
            // @ts-expect-error animejs typing system is broken
            if (enterOnComplete) enterOnComplete(self, e)
          },
          ...enterRest,
        })
      } else {
        const {
          onBegin: exitOnBegin,
          onComplete: exitOnComplete,
          ...exitRest
        } = taggedAnimation?.exitAnimation ?? exitAnimation
        animate(root.current, {
          autoplay: true,
          onBegin: (self, e) => {
            registerAnimation(self, "exit")
            // @ts-expect-error animejs typing system is broken
            if (exitOnBegin) exitOnBegin(self, e)
          },
          onComplete: (self, e) => {
            unregisterAnimation(self, "exit")
            // @ts-expect-error animejs typing system is broken
            if (exitOnComplete) exitOnComplete(self, e)
          },
          ...exitRest,
        })
      }
    })
    return () => {
      scope.current?.revert()
    }
  }, [animationDirection])

  return root
}
