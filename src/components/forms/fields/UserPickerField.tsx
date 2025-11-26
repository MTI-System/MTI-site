"use client"

import { useCardsRoot } from "@/components/forms/root/RootContext"
import React, { useEffect, useRef, useState } from "react"
import { ErrorTooltip } from "../ui/ErrorTooltip"
import twclsx from "@/utils/twClassMerge"
import PersonPicker from "@/components/pickers/PersonPicker"
import UsersProviderWrapper from "@/api/users/ClientWrapper"
import { User } from "@/types/UsersApi"

interface UserPickerFieldProps {
  onVerification: (value: string) => InputVerificationStatus
  name: string
  title: string
}

export function UserPickerField({ onVerification, name, title, ...rest }: UserPickerFieldProps) {
  const { register, setFormField } = useCardsRoot()

  const [verificationResult, setVerificationResult] = useState<InputVerificationStatus | undefined>(undefined)
  const selectedUser = useRef<User | null>(null)

  useEffect(() => {
    register(() => {
      const result = onVerification(selectedUser.current?.id.toString() || "")
      setVerificationResult(result)
      if (result.isSuccess) {
        setFormField(name, selectedUser.current?.id.toString() || "")
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
        {/*<input name={name} className={twclsx({"border border-red-700": !(verificationResult?.isSuccess ?? true)})} ref={inputRef} {...rest} />*/}
        <UsersProviderWrapper>
          <PersonPicker selectedValue={selectedUser} label={title} placeholder={title} name={name} />
        </UsersProviderWrapper>
      </ErrorTooltip>
    </>
  )
}
