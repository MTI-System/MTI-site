"use client"
import style from "@/styles/components/sections/app/themeSwitcher.module.css"
import { Button } from "@/components/ui/Buttons"
import { animate, createScope, Scope } from "animejs"
import clsx from "clsx"
import {useEffect, useRef, useState} from "react"
import { useAppDispatch, useAppSelector } from "@/redux_stores/tournamentTypeRedixStore"
import { setTheme } from "@/redux_stores/SystemSlice"

export default function ThemeSwitchingButton({ className }: { className: string }) {
  const theme = useAppSelector((state) => state.system.theme)
  const dispatcher = useAppDispatch()
  const themeRef = useRef(theme)
  useEffect(() => {
    themeRef.current = theme
  }, [theme])



  const targetRef = useRef<SVGSVGElement>(null)
  const scopeRef = useRef<Scope>(null)
  useEffect(() => {
    scopeRef.current = createScope({ root: targetRef }).add((self) => {
      if (!self) return
      const sunAnim = animate(`.${style.sunCenter}`, {
        scale: 0.4,
        translateY: 5.5,
        delay: 200,
        duration: 800,
        ease: "inOutCubic",
        autoplay: false,
      })
      const raysAnim = animate(`.${style.sunRays}`, {
        scale: { from: 1, to: 0.3, ease: "inOutCubic", duration: 800 },
        translateX: { from: 0, to: -27, ease: "inOutCubic", duration: 800 },
        translateY: { from: 0, to: -13, ease: "inOutCubic", duration: 800 },
        rotate: { from: 0, to: 180, duration: 350, ease: "inOutSine" },
        opacity: { from: 1, to: 0, delay: 350, duration: 200, ease: "linear" },
        delay: 200,
        autoplay: false,
      })
      const moonAnim = animate(`.${style.moon}`, {
        scale: [0.35, 1],
        rotate: [505, 250],
        delay: 0,
        duration: 1000,
        ease: "inOutCubic",
        autoplay: false,
      })
      const starsAnim = animate(`.${style.stars}`, {
        scale: { from: 1, to: 0.3, ease: "inOutCubic", duration: 800 },
        translateX: { from: 0, to: -27, ease: "inOutCubic", duration: 800 },
        translateY: { from: 0, to: -13, ease: "inOutCubic", duration: 800 },
        opacity: { from: 0, to: 1, delay: 350, duration: 200, ease: "linear" },
        delay: 200,
        autoplay: false,
      })
      const animations = [sunAnim, raysAnim, moonAnim, starsAnim]
      self.add("toggleTheme", () => {
        if (animations.filter((anim) => anim.began && !anim.completed).length > 0) return
        const newTheme = themeRef.current === "dark" ? "light" : "dark"
        dispatcher(setTheme(newTheme))
        if (!animations[0].reversed)
          animations.forEach((anim) => {
            anim.reverse()
          })
        else
          animations.forEach((anim) => {
            anim.play()
          })
      })
      self.add("init", () => {
        if (theme !== "dark")
          animations.forEach((anim) => {
            anim.complete()
          })
        else
          animations.forEach((anim) => {
            anim.reverse()
          })
      })
    })
    scopeRef.current.methods.init()
    return () => {
      scopeRef.current?.revert()
    }
  }, [])
  return (
    <Button
      className={clsx(style.animationContainer, className, { [style.toDark]: theme === "light" })}
      onClick={() => {
        if (!scopeRef.current) return
        scopeRef.current.methods.toggleTheme()
      }}
    >
      <svg ref={targetRef} viewBox="0 0 24 24">
        <path
          className={style.sunCenter}
          d="M 12 7 C 9.24 7 7 9.24 7 12 S 9.24 17 12 17 S 17 14.76 17 12 S 14.76 7 12 7 L 12 7 Z"
        />
        <path
          className={style.sunRays}
          d=" M 2 13 L 4 13 C 4.55 13 5 12.55 5 12 S 4.55 11 4 11 L 2 11 C 1.45 11 1 11.45 1 12 S 1.45 13 2 13 Z M 20 13 L 22 13 C 22.55 13 23 12.55 23 12 S 22.55 11 22 11 L 20 11 C 19.45 11 19 11.45 19 12 S 19.45 13 20 13 Z M 11 2 V 4 C 11 4.55 11.45 5 12 5 S 13 4.55 13 4 V 2 C 13 1.45 12.55 1 12 1 S 11 1.45 11 2 Z M 11 20 V 22 C 11 22.55 11.45 23 12 23 S 13 22.55 13 22 V 20 C 13 19.45 12.55 19 12 19 C 11.45 19 11 19.45 11 20 Z M 5.99 4.58 C 5.6 4.19 4.96 4.19 4.58 4.58 C 4.19 4.97 4.19 5.61 4.58 5.99 L 5.64 7.05 C 6.03 7.44 6.67 7.44 7.05 7.05 S 7.44 6.02 7.05 5.64 L 5.99 4.58 Z M 18.36 16.95 C 17.97 16.56 17.33 16.56 16.95 16.95 C 16.56 17.34 16.56 17.98 16.95 18.36 L 18.01 19.42 C 18.4 19.81 19.04 19.81 19.42 19.42 C 19.81 19.03 19.81 18.39 19.42 18.01 L 18.36 16.95 Z M 19.42 5.99 C 19.81 5.6 19.81 4.96 19.42 4.58 C 19.03 4.19 18.39 4.19 18.01 4.58 L 16.95 5.64 C 16.56 6.03 16.56 6.67 16.95 7.05 S 17.98 7.44 18.36 7.05 L 19.42 5.99 Z M 7.05 18.36 C 7.44 17.97 7.44 17.33 7.05 16.95 C 6.66 16.56 6.02 16.56 5.64 16.95 L 4.58 18.01 C 4.19 18.4 4.19 19.04 4.58 19.42 S 5.61 19.81 5.99 19.42 L 7.05 18.36 Z"
        />
        <path
          className={style.moon}
          d="M 12 3 C 7.03 3 3 7.03 3 12 S 7.03 21 12 21 S 21 16.97 21 12 C 21 11.54 20.96 11.08 20.9 10.64 C 19.92 12.01 18.32 12.9 16.5 12.9 C 13.52 12.9 11.1 10.48 11.1 7.5 C 11.1 5.69 11.99 4.08 13.36 3.1 C 12.92 3.04 12.46 3 12 3 L 12 3 Z"
        />
        <g className={style.stars}>
          <polygon points="19,9 20.25,6.25 23,5 20.25,3.75 19,1 17.75,3.75 15,5 17.75,6.25" />
          <polygon points="19,15 17.75,17.75 15,19 17.75,20.25 19,23 20.25,20.25 23,19 20.25,17.75" />
          <path d="M11.5,9.5L9,4L6.5,9.5L1,12l5.5,2.5L9,20l2.5-5.5L17,12L11.5,9.5z M9.99,12.99L9,15.17l-0.99-2.18L5.83,12l2.18-0.99 L9,8.83l0.99,2.18L12.17,12L9.99,12.99z" />
        </g>
      </svg>
    </Button>
  )
}
