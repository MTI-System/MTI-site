"use client"

import { useCardsRoot } from "@/components/forms/root/RootContext"
import React, { useEffect, useRef, useState } from "react"
import { ErrorTooltip } from "../ui/ErrorTooltip"
import twclsx from "@/utils/twClassMerge"

interface InputFieldProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onVerification: (value: string) => InputVerificationStatus
  name: string
}

export function InputField({ onVerification, name, ...rest }: InputFieldProps) {
  const { register, setFormField } = useCardsRoot()

  const inputRef = useRef<HTMLInputElement>(null)
  const [verificationResult, setVerificationResult] = useState<InputVerificationStatus | undefined>(undefined)

  useEffect(() => {
    register(() => {
      const result = onVerification(inputRef.current?.value || "")
      console.log("verif", JSON.stringify(result))
      setVerificationResult(result)
      if (result.isSuccess) {
        setFormField(name, inputRef.current?.value || "")
      }
      return result
    })
  }, [])

  return (
    <>
      <ErrorTooltip
        errorMessage={verificationResult?.errorMessage ?? "Неизвестная ошибка"}
        isActive={!(verificationResult?.isSuccess ?? true)}
      >
        <input
          onWheel={(e) => {
            e.preventDefault()
          }}
          name={name}
          className={twclsx({ "border border-red-700": !(verificationResult?.isSuccess ?? true) })}
          ref={inputRef}
          {...rest}
        />
      </ErrorTooltip>
    </>
  )
}
