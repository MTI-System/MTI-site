"use client"
import { ChangeEvent, InputHTMLAttributes, ReactNode, RefObject, useRef } from "react"
import style from "@/styles/components/input.module.css"
import headerStyle from "@/styles/app/header.module.css"
import clsx from "clsx"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onEnter?: (el: HTMLInputElement) => void
  ref?: RefObject<HTMLInputElement | null>
}

interface IconInputProps extends InputProps {
  icon: ReactNode
  disabled?: boolean
}

export function IconInput({ icon, onChange, onEnter, disabled, ...rest }: IconInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div
      className={style.inputWrapper}
      onMouseDown={(e) => {
        e.preventDefault()
        if (disabled) return
        inputRef.current?.focus()
      }}
    >
      <div className={style.inputContainer}>
        <Input
          onChange={onChange}
          onEnter={onEnter}
          ref={inputRef}
          disabled={disabled}
          {...rest}
        />
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
        if (onChange) onChange(e)
      }}
      onKeyUp={(e) => {
        if (onEnter && e.key === "Enter" && inputRef.current) onEnter(inputRef.current)
      }}
      {...rest}
    />
  )
}

export function TitledInput({
  children,
  title,
  isError,
  className,
}: {
  children: ReactNode
  title: string
  isError?: boolean
  className?: string
}) {
  return (
    <div className={clsx(style.titledInputContainer, className)}>
      <p className={clsx(style.title, { [style.erroredTitle]: isError })}>{title}</p>
      {children}
    </div>
  )
}
