"use client"
import styleModule from "@/styles/components/ui/button.module.css"
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
    <button className={twclsx(className)} style={style} {...rest}>
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
      const confirmationAnim = animate(`.${styleModule.holdOverlay}`, {
        left: ["-100%", 0],
        ease: "outCubic",
        duration: holdTimeout,
        autoplay: false,
        onComplete: (a) => {
          if (a.backwards || !onConfirm) return
          onConfirm()
          navigator.vibrate(30)
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
      className={twclsx(styleModule.button, styleModule.holdButton, className)}
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
      <div className={styleModule.holdOverlay}></div>
      {children}
    </button>
  )
}
