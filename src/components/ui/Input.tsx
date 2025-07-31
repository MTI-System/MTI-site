"use client"
import {
  ChangeEvent,
  cloneElement,
  createContext,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"
import style from "@/styles/components/ui/input.module.css"
import clsx from "clsx"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onEnter?: (el: HTMLInputElement) => void
}

interface IconInputProps extends InputProps {
  icon: ReactNode
  disabled?: boolean
}
type FocusContextType = {
  register: (ref: RefObject<HTMLInputElement | null>) => void
}
const FocusContext = createContext<FocusContextType | null>(null)
const useFocusRegistration = () => {
  const ctx = useContext(FocusContext)
  if (!ctx) return null
  return ctx.register
}
export const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon, onChange, onEnter, disabled, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)
    return (
      <div
        className={style.inputWrapper}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (disabled) return
          inputRef.current?.focus()
        }}
      >
        <div className={style.inputContainer}>
          <Input
            className={style.inputWrapper}
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
)
export const Input = forwardRef<HTMLInputElement, InputProps>(({ onChange, onEnter, ...rest }, ref) => {
  const registerFocus = useFocusRegistration()
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  useEffect(() => {
    if (registerFocus) registerFocus(inputRef)
  }, [registerFocus])

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
})

type AllowedInputs = ReactElement<typeof Input> | ReactElement<typeof IconInput>

export function TitledInput({
  children,
  title,
  isError,
  className,
}: {
  children: AllowedInputs
  title: string
  isError?: boolean
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div
      className={clsx(style.titledInputContainer, className)}
      onClick={() => {
        inputRef.current?.focus()
      }}
    >
      <p className={clsx(style.title, { [style.erroredTitle]: isError })}>{title}</p>
      <FocusContext
        value={{
          register: (ref: RefObject<HTMLInputElement | null>) => {
            inputRef.current = ref?.current
          },
        }}
      >
        {children}
      </FocusContext>
    </div>
  )
}
