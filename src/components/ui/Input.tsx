"use client"
import { ChangeEvent, HTMLAttributes, ReactNode, RefObject, useRef } from "react"
import style from "@/styles/components/input.module.css"

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  ref?: RefObject<HTMLInputElement | null>
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onEnter: (el: HTMLInputElement) => void
}

interface IconInputProps extends InputProps {
  icon: ReactNode
}

export function IconInput({ icon, onChange, onEnter, ...rest }: IconInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className={style.inputWrapper}>
      <div
        className={style.inputContainer}
        onClick={() => {
          inputRef.current?.focus()
        }}
      >
        <Input onChange={onChange} onEnter={onEnter} ref={inputRef} {...rest} />
        {icon}
      </div>
    </div>
  )
}

export function Input({ onChange, onEnter, ref, ...rest }: InputProps) {
  const inputRef = ref ? ref : useRef<HTMLInputElement>(null)
  return (
    <input
      ref={inputRef}
      onChange={(e) => {
        onChange(e)
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" && inputRef.current) onEnter(inputRef.current)
      }}
      {...rest}
    />
  )
}
