"use client"

import { animate, createScope, Scope } from "animejs"
import { useEffect, useRef, useState } from "react"
import style from "@/styles/components/ui/switches.module.css"
import clsx from "clsx"

export default function TwoPositionalSwitch({
  className,
  onChange,
  defaultState,
  disabled,
}: {
  className?: string
  onChange?: (val: boolean) => void
  defaultState: boolean
  disabled?: boolean
}) {
  const targetRef = useRef<HTMLDivElement>(null)
  const scopeRef = useRef<Scope>(null)
  const [isOn, setIsOn] = useState(defaultState)

  useEffect(() => {
    setIsOn(defaultState)
  }, [defaultState])

  useEffect(() => {
    scopeRef.current = createScope({ root: targetRef }).add((self) => {
      if (!self) return
      const onAnim = animate(`.${style.switch}`, {
        left: ["0.25em", "1.75em"],
        scaleX: [1, 1.2, 1],
        duration: 250,
        ease: "inOut",
        autoplay: false,
      })
      if (defaultState) onAnim.complete()
      self.add("switch", () => {
        setIsOn((prev) => {
          if (prev) onAnim.reverse()
          else onAnim.play()
          return !prev
        })
      })
    })
    return () => {
      scopeRef.current?.revert()
    }
  }, [onChange])

  return (
    <div
      className={clsx(style.switchContainer, { [style.switchOn]: isOn, [style.switchDisabled]: disabled })}
      ref={targetRef}
      onClick={() => {
        if (disabled) return
        onChange && onChange(!isOn)
        scopeRef.current?.methods.switch()
      }}
    >
      <div className={style.switchBackground}></div>
      <div className={style.switch}></div>
    </div>
  )
}
