"use client"

import { useCardsRoot } from "@/components/forms/root/RootContext"
import React, { useEffect, useRef, useState } from "react"
import { ErrorTooltip } from "../ui/ErrorTooltip"
import twclsx from "@/utils/twClassMerge"

interface FileInputFieldProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onVerification: (value: string) => InputVerificationStatus
  name: string
}

export function FileInputField({ onVerification, name, ...rest }: FileInputFieldProps) {
  const { register, setFormField } = useCardsRoot()

  const inputRef = useRef<HTMLInputElement>(null)
  const [verificationResult, setVerificationResult] = useState<InputVerificationStatus | undefined>(undefined)
  const [fileName, setFileName] = useState<string>("")

  useEffect(() => {
    register(() => {
      const result = onVerification(inputRef.current?.value || "")
      console.log("verif", JSON.stringify(result))
      setVerificationResult(result)
      if (result.isSuccess) {
        //@ts-ignore
        setFormField(name, inputRef.current?.files[0] || "")
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
        <label
          htmlFor={name}
          className={twclsx({ "border border-red-700": !(verificationResult?.isSuccess ?? true) }, rest.className)}
        >
          {fileName || "Выберите файл"}
        </label>
        <input
          name={name}
          {...rest}
          ref={inputRef}
          onChange={(e) => {
            const file = e.target.files?.[0]
            setFileName(file?.name ?? "")
          }}
          className="hidden"
        />
      </ErrorTooltip>
    </>
  )
}
