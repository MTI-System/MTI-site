"use client"
import { useEffect, useRef, useState } from "react"
import { useInstinctContainerContext } from "../Container/ContainerContext"
import { useInstinctRootContext } from "../root/RootContext"
import { InstinctAnimatedContentContext } from "./AnimatedContentContext"
import { JSAnimation } from "animejs"

export function Content({
  children,
  className,
  tagsDependence,
  LoadingElement,
  loadingTimeout = 300,
}: {
  children: React.ReactNode
  className?: string
  tagsDependence?: string[]
  LoadingElement?: React.ReactNode
  loadingTimeout?: number
}) {
  const {
    pendingTags,
    registerAnimationOnStart: registerAnimationOnStartRoot,
    unregisterAnimationOnStart: unregisterAnimationOnStartRoot,
  } = useInstinctRootContext()
  const {
    isPending: isPendingGlobal,
    error,
    registerAnimationOnStart: registerAnimationOnStartContainer,
    unregisterAnimationOnStart: unregisterAnimationOnStartContainer,
  } = useInstinctContainerContext()
  const isPending =
    isPendingGlobal || (tagsDependence?.some((transitionTag) => pendingTags.includes(transitionTag)) ?? false)
  const [prevChildren, setPrevChildren] = useState<React.ReactNode | null>(null)
  const [loadingStatus, setLoadingStatus] = useState<"enter" | "exit" | "waiting" | null | undefined>(undefined)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isPendingRef = useRef(isPending)
  const childAnimations = useRef<JSAnimation[]>([])
  const loadingAnimations = useRef<JSAnimation[]>([])

  const animationHandler = () => {
    setPrevChildren(children)
    childAnimations.current = []
    loadingAnimations.current = []
    if (loadingTimeout <= 0) {
      setLoadingStatus("enter")
      loadingTimeoutRef.current = null
      return
    }
    setLoadingStatus("waiting")
    loadingTimeoutRef.current = setTimeout(() => {
      console.log("What 4")
      setLoadingStatus("enter")
      loadingTimeoutRef.current = null
    }, loadingTimeout)
  }

  useEffect(() => {
    registerAnimationOnStartContainer(animationHandler)
    if (tagsDependence) {
      registerAnimationOnStartRoot(animationHandler, tagsDependence)
    }
    return () => {
      unregisterAnimationOnStartContainer(animationHandler)
      if (tagsDependence) {
        unregisterAnimationOnStartRoot(animationHandler)
      }
    }
  }, [children, loadingTimeout])

  const registerChildAnimation = (a: JSAnimation) => {
    childAnimations.current = [...childAnimations.current, a]
  }

  const registerLoadingAnimation = (a: JSAnimation) => {
    loadingAnimations.current = [...loadingAnimations.current, a]
    console.log("registerLoadingAnimation", loadingAnimations.current.length, a)
  }

  const unregisterChildAnimation = (a: JSAnimation) => {
    childAnimations.current = childAnimations.current.filter((ac) => ac !== a)
    if (childAnimations.current.length === 0) {
      setPrevChildren(null)
    }
    console.log("unregisterChildAnimation", childAnimations.current.length)
  }

  const unregisterLoadingAnimation = (a: JSAnimation) => {
    loadingAnimations.current = loadingAnimations.current.filter((ac) => ac !== a)
    if (loadingAnimations.current.length === 0) {
      console.log("What 2")
      setLoadingStatus(
        isPendingRef.current ? null : loadingStatus === null || loadingStatus === "enter" ? "exit" : undefined,
      )
    }
    console.log("unregisterLoadingAnimation", loadingAnimations.current.length)
  }

  useEffect(() => {
    isPendingRef.current = isPending
    if (!isPending && loadingAnimations.current.length === 0 && loadingStatus !== undefined) {
      console.log("What 1", loadingTimeoutRef.current, loadingStatus)
      if (loadingTimeoutRef.current) {
        console.log("What 3")
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      } else setLoadingStatus("exit")
    }
  }, [isPending])

  useEffect(() => {
    console.log("loadingStatus", loadingStatus)
  }, [loadingStatus])

  // TODO: Wrap everything in a InstinctAnimatedContentContext properly
  // if (error) {
  //   return <div>{error.message}</div>
  // }

  // if (isPending || tagsDependence?.some((transitionTag) => pendingTags.includes(transitionTag))) {
  //   return (
  //     <>
  //       <InstinctAnimatedContentContext
  //         value={{
  //           animationDirection: "exit",
  //           registerAnimation: registerChildAnimation,
  //           unregisterAnimation: unregisterChildAnimation,
  //         }}
  //       >
  //         {prevChildren}
  //       </InstinctAnimatedContentContext>
  //       <InstinctAnimatedContentContext
  //         value={{
  //           animationDirection: "enter",
  //           registerAnimation: registerLoadingAnimation,
  //           unregisterAnimation: unregisterLoadingAnimation,
  //         }}
  //       >
  //         <AnimatedDiv>Loading...</AnimatedDiv>
  //       </InstinctAnimatedContentContext>
  //     </>
  //   )
  // }

  return (
    <div className={className}>
      {prevChildren && (
        <InstinctAnimatedContentContext
          value={{
            animationDirection: "exit",
            registerAnimation: registerChildAnimation,
            unregisterAnimation: unregisterChildAnimation,
          }}
        >
          {prevChildren}
        </InstinctAnimatedContentContext>
      )}
      {loadingStatus !== undefined && loadingStatus !== "waiting" && LoadingElement && (
        <InstinctAnimatedContentContext
          value={{
            animationDirection: loadingStatus,
            registerAnimation: registerLoadingAnimation,
            unregisterAnimation: unregisterLoadingAnimation,
          }}
        >
          {LoadingElement}
        </InstinctAnimatedContentContext>
      )}
      {!isPending && (loadingStatus === "waiting" || loadingStatus === undefined || loadingStatus === "exit") && (
        <InstinctAnimatedContentContext
          value={{
            animationDirection: loadingStatus === "exit" || loadingStatus === "waiting" ? "enter" : null,
            registerAnimation: registerChildAnimation,
            unregisterAnimation: unregisterChildAnimation,
          }}
        >
          {children}
        </InstinctAnimatedContentContext>
      )}
    </div>
  )
}
