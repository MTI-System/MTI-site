"use client"
import {useCardsRoot} from "@/components/forms/root/RootContext"
import React, {useCallback, useEffect, useRef, useState} from "react"
import {ErrorTooltip} from "../ui/ErrorTooltip"
import twclsx from "@/utils/twClassMerge"
import DatePicker, {DatePickerProps, formatDate} from "@/components/pickers/DatePicker";
import {MdDateRange} from "react-icons/md";
import {DateRange} from "react-day-picker";


// function GetFormattedDateForVerification(
//   value: Date | DateRange | undefined
// ): string {
//   if (!value) {
//     return ""
//   }
//   if (value instanceof Date) {
//     return value.toISOString()
//   } else {
//     return `${value.from?.toString()} - ${value.to?.toString()}`
//   }
// }

interface DatePickerFieldProps {
  className?: string,
  type: "single" | "range",
  name: string
  secondValueName?: string
  onVerification: (value: string) => InputVerificationStatus
}

export function DatePickerField({
                                  onVerification,
                                  type,
                                  name,
                                  secondValueName,

                                  ...rest
                                }: DatePickerFieldProps) {
  const {register} = useCardsRoot()
  const [verificationResult, setVerificationResult] = useState<InputVerificationStatus | undefined>(undefined)
  const [pickedDate, setPickedDate] = useState<Date | DateRange | undefined>(undefined)
  const firstSelectedDateRef = useRef<HTMLInputElement>(null)
  const secondSelectedDateRef = useRef<HTMLInputElement>(null)

  const stringResultRef = useRef<string>("")

  useEffect(() => {
    if (pickedDate instanceof Date) {
      stringResultRef.current = formatDate(pickedDate)
    }
    else{
      stringResultRef.current = formatDate(pickedDate?.from ?? new Date()) + " " + formatDate(pickedDate?.to ?? new Date())
    }
  }, [pickedDate]);

  useEffect(() => {
    register(() => {
      const result = onVerification(stringResultRef.current)
      setVerificationResult(result)
      return result
    })
  }, [])

  return (
    <>
      {/*Пикер для первой даты*/}
      <input name={name} ref={firstSelectedDateRef} type={"date"} className="size-[0px] absolute"/>
      {/*Пикер для второй даты*/}
      {type == "range" && <input name={secondValueName} ref={secondSelectedDateRef} type={"date"} className="size-[0px] absolute"/>}
      <ErrorTooltip errorMessage={verificationResult?.errorMessage ?? "Неизвестная ошибка"}
                    isActive={!(verificationResult?.isSuccess ?? true)}>
        {/*<input className={twclsx({"border border-red-700": !(verificationResult?.isSuccess ?? true)})} ref={inputRef} {...rest} />*/}
        <DatePicker
          type={type}
          onPick={(e: Date | DateRange) => {
            setPickedDate(e)
            if (!firstSelectedDateRef.current) {
              return
            }
            if (e instanceof Date) {
              firstSelectedDateRef.current.valueAsDate = e
            } else if ("from" in e) {
              if (!secondSelectedDateRef.current) {
                return
              }
              firstSelectedDateRef.current.valueAsDate = e.from ?? null
              secondSelectedDateRef.current.valueAsDate = e.to ?? null
            }
          }}
          defaultDate={new Date(0)}
        />
      </ErrorTooltip>
    </>
  )
}
