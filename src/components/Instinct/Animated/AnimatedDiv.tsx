"use client"
import { useEffect, useRef } from "react"
import twclsx from "@/utils/twClassMerge"
import { AnimationParams } from "animejs"
import { useAnimated } from "./AnimatedHooks"

export function AnimatedDiv({
  children,
  className,
  enterAnimation,
  exitAnimation,
  tagedAnimations,
}: {
  children: React.ReactNode
  className?: string
  enterAnimation: Omit<AnimationParams, "autoplay">
  exitAnimation: Omit<AnimationParams, "autoplay">
  tagedAnimations?: {
    [key: string]: {
      enterAnimation: Omit<AnimationParams, "autoplay">
      exitAnimation: Omit<AnimationParams, "autoplay">
    }
  }
}) {
  const root = useAnimated(enterAnimation, exitAnimation, tagedAnimations)
  return (
    <div className={twclsx("instinct-animate", className)} ref={root}>
      {children}
    </div>
  )
}
