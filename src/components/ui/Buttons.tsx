"use client"
import twclsx from "@/utils/twClassMerge"
import { animate, createScope, Scope } from "animejs"
import { ButtonHTMLAttributes, CSSProperties, PropsWithChildren, useEffect, useRef } from "react"

type CSSVariableStyle = CSSProperties & {
  "--main-color"?: string
  "--main-light-color"?: string
}
type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  style?: CSSVariableStyle
}
/**
 * Prestyled button. You can change colors using **style** parameter by providing CSS variables:
 * **--main-color** and **--main-light-color**
 */
export function Button({ children, className = "", style, ...rest }: ButtonProps) {
  return (
    <button className={twclsx("cursor-pointer", className)} style={style} {...rest}>
      {children}
    </button>
  )
}
type HoldButtonProps = ButtonProps & {
  holdTimeout?: number
  onConfirm?: () => void
}

/**
 * Button that user should hold to confirm action
 */
export function HoldButton({
  children,
  className = "",
  style,
  onConfirm,
  holdTimeout = 1000,
  ...rest
}: HoldButtonProps) {
  const target = useRef<HTMLButtonElement>(null)
  const scope = useRef<Scope>(null)
  const isDisabled = rest.disabled ?? false
  useEffect(() => {
    scope.current = createScope({ root: target }).add((self) => {
      if (!self) return
      const confirmationAnim = animate(`.holdOverlay`, {
        left: ["-100%", 0],
        ease: "outCubic",
        duration: holdTimeout,
        autoplay: false,
        onComplete: (a) => {
          if (a.backwards || !onConfirm) return
          onConfirm()
          navigator.vibrate?.(30)
        },
      })
      self.add("caPlay", () => {
        confirmationAnim.play()
      })
      self.add("caReverse", () => {
        confirmationAnim.reverse()
      })
    })
    return () => scope.current?.revert()
  }, [onConfirm])
  useEffect(() => {
    if (isDisabled && scope.current) scope.current.methods.caReverse()
  }, [isDisabled])
  return (
    <button
      className={twclsx(
        "cursor-pointer disabled:bg-inactive/20 disabled:border-inactive disabled:text-bg-main relative overflow-hidden p-2 text-ellipsis border-4 rounded-xl",
        className,
      )}
      onPointerDown={() => {
        if (!scope.current || rest.disabled) return
        scope.current.methods.caPlay()
      }}
      onPointerUp={() => {
        if (!scope.current) return
        scope.current.methods.caReverse()
      }}
      style={style}
      ref={target}
      {...rest}
    >
      <div className="holdOverlay bg- absolute top-0 left-[1vw] block h-full w-full opacity-20"></div>
      {children}
    </button>
  )
}
