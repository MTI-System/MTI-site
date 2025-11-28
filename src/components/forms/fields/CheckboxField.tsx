"use client"

import { useCardsRoot } from "@/components/forms/root/RootContext"
import React, { useEffect, useRef, useState } from "react"
import { ErrorTooltip } from "../ui/ErrorTooltip"
import twclsx from "@/utils/twClassMerge"
import { Checkbox } from "@base-ui-components/react"

interface CheckboxFieldProps extends Omit<Checkbox.Root.Props, "inputRef" | "name"> {
  onVerification: (value: string) => InputVerificationStatus
  name: string
  value: string
  onChange?: (value: string, state: boolean) => void
  is_grouped?: boolean
}

export function CheckboxField({ onVerification, name, value, className, is_grouped=false, onChange=(value, is_chacked)=>{}, ...rest }: CheckboxFieldProps) {
  const { register, setFormField } = useCardsRoot()

  const inputRef = useRef<HTMLInputElement>(null)
  const [verificationResult, setVerificationResult] = useState<InputVerificationStatus | undefined>(undefined)

  useEffect(() => {
    register(() => {
      if (!is_grouped){
        const result = onVerification(inputRef.current?.value || "")
        setVerificationResult(result)
        if (result.isSuccess) {
          setFormField(name, inputRef.current?.value || "")
        }
        return result
      }

      return {
        isSuccess: true
      }
    })
  }, [])

  return (
    <>
      <ErrorTooltip
        errorMessage={verificationResult?.errorMessage ?? "Неизвестная ошибка"}
        isActive={!(verificationResult?.isSuccess ?? true)}
      >
        <Checkbox.Root
          name={name}
          inputRef={inputRef}
          onCheckedChange={(e)=>{
            // console.log("checked changed", value)
            onChange(name, e)
          }}

          value={value}
          className={twclsx(
            "flex size-5 items-center justify-center rounded-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-checked:bg-gray-900 data-unchecked:border data-unchecked:border-gray-300",
            className,
            { "border border-red-700": !(verificationResult?.isSuccess ?? true) },
          )}
          {...rest}
        >
          <Checkbox.Indicator className="flex text-gray-50 data-unchecked:hidden">
            <CheckIcon className="size-3" />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </ErrorTooltip>
    </>
  )
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  )
}
