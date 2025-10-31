"use client"

import { useCardsRoot } from "@/components/forms/root/RootContext"
import { useEffect, useRef, useState } from "react"

export function InputField({ onVerification }: { onVerification: (value: string) => boolean }) {
  const { register } = useCardsRoot()

  const inputRef = useRef<HTMLInputElement>(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    register(() => {
      const result = onVerification(inputRef.current?.value || "")
      setIsError(!result)
      return result
    })
  }, [])

  return (
    <>
      {isError && <p>Error message</p>}
      <input type="text" ref={inputRef} placeholder="Enter rrr" />
    </>
  )
}
