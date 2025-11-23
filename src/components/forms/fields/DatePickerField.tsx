"use client"
import { useCardsRoot } from "@/components/forms/root/RootContext"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ErrorTooltip } from "../ui/ErrorTooltip"
import twclsx from "@/utils/twClassMerge"
import DatePicker, { DatePickerProps, formatDate } from "@/components/pickers/DatePicker"
import { MdDateRange } from "react-icons/md"
import { DateRange } from "react-day-picker"

interface DatePickerFieldProps {
  className?: string
  type: "single" | "range"
  name: string
  secondValueName?: string
  onVerification: (value: string) => InputVerificationStatus
}

export function DatePickerField({
  onVerification,
  type,
  name,
  secondValueName,
  className,
  ...rest
}: DatePickerFieldProps) {
  const { register, unregister, setFormField } = useCardsRoot()
  const [verificationResult, setVerificationResult] = useState<InputVerificationStatus | undefined>(undefined)
  const [pickedDate, setPickedDate] = useState<Date | DateRange | undefined>(undefined)
  const lastId = useRef<number>(-1)
  const verifyCallback = useCallback(() => {
    let stringDate = ""
    console.log("pickedDate", pickedDate)
    if (pickedDate instanceof Date) {
      stringDate = pickedDate.getTime().toString()
    } else {
      if (type == "range") {
        stringDate =  pickedDate?.from?.getTime().toString() + " " + pickedDate?.to?.getTime().toString()
      }
    }
    const result = onVerification(stringDate)
    setVerificationResult(result)
    if (result.isSuccess) {
      setFormField(name, stringDate)
    }
    return result
  }, [pickedDate])

  useEffect(() => {
    lastId.current = register(verifyCallback)
    return () => {
      if (lastId.current !== -1) unregister(lastId.current)
    }
  }, [pickedDate])

  useEffect(() => {
    console.log("pickedDate change", pickedDate)
  }, [pickedDate])

  return (
    <>
      <ErrorTooltip
        errorMessage={verificationResult?.errorMessage ?? "Неизвестная ошибка"}
        isActive={!(verificationResult?.isSuccess ?? true)}
      >
        <DatePicker
          className={className}
          type={type}
          onPick={(e: Date | DateRange) => {
            setPickedDate(e)
          }}
          defaultDate={new Date(0)}
        />
      </ErrorTooltip>
    </>
  )
}
