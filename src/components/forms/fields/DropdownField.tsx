"use client"
import { Select } from "@base-ui-components/react"
import { useCardsRoot } from "../root/RootContext"
import { useEffect, useRef, useState } from "react"
import { FaCheck } from "react-icons/fa6"
import { ChevronUpDownIcon } from "next/dist/next-devtools/dev-overlay/icons/chevron-up-down"
import { RiExpandUpDownFill } from "react-icons/ri"

interface DropdownFieldProps {
  className?: string
  type: "single" | "multi"
  name: string
  fields: { label: string; value: string }[]
  onVerification: (value: string) => InputVerificationStatus
}

export function DropdownField({ className, type, name, onVerification, fields }: DropdownFieldProps) {
  const { register, setFormField } = useCardsRoot()
  const valueRef = useRef<string | null | (string | null)[]>(null)
  const [verificationResult, setVerificationResult] = useState<InputVerificationStatus | undefined>(undefined)

  useEffect(() => {
    register(() => {
      const result = onVerification(valueRef.current?.toString() ?? "")
      setVerificationResult(result)
      if (result.isSuccess) {
        setFormField(name, valueRef.current?.toString() ?? "")
      }
      return result
    })
  }, [])

  return (
    <>
      <Select.Root
        multiple={type === "multi"}
        items={fields}
        onValueChange={(value) => {
          valueRef.current = value
        }}
      >
        <Select.Trigger className="flex h-10 w-fit min-w-36 cursor-default items-center justify-between gap-3 rounded-md border border-gray-200 pr-3 pl-3.5 text-base text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-[popup-open]:bg-gray-100">
          <Select.Value />
          <Select.Icon className="flex">
            <RiExpandUpDownFill />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className="z-10 outline-none select-none" sideOffset={8}>
            <Select.Popup className="group origin-[var(--transform-origin)] rounded-md bg-[canvas] bg-clip-padding text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none dark:shadow-none dark:outline-gray-300">
              <Select.ScrollUpArrow className="top-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:top-[-100%]" />
              <Select.List className="relative max-h-[var(--available-height)] scroll-py-6 overflow-y-auto py-1">
                {fields.map(({ label, value }) => (
                  <Select.Item
                    key={label}
                    value={value}
                    className="grid min-w-[var(--anchor-width)] cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"
                  >
                    <Select.ItemIndicator className="col-start-1">
                      <FaCheck />
                    </Select.ItemIndicator>
                    <Select.ItemText className="col-start-2">{label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
              <Select.ScrollDownArrow className="bottom-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:bottom-[-100%]" />
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </>
  )
}
