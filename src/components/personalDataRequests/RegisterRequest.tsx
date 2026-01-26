"use client"
import { Checkbox, Field } from "@base-ui-components/react"

const fieldRootClass = "flex w-full flex-col items-start gap-1 text-text-main"
const fieldErrorClass = "text-sm font-medium text-accent-warning"
const policyCardClass =
  "flex w-full h-15 flex-col gap-3 rounded-xl border border-border bg-bg-alt p-4 text-sm leading-relaxed text-text-main sm:flex-row sm:items-center sm:justify-between sm:gap-4 select-none"
const checkboxRootClass =
  "flex size-5 items-center justify-center rounded-md border border-border bg-bg-main transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white data-checked:border-transparent data-checked:bg-text-main"

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  )
}

export default function RegisterRequest({
  updateCheck,
  checkboxText,
}: {
  updateCheck: (isOn: boolean) => void
  checkboxText: string
}) {
  return (
    <>
      {/* <p>Галочка для подтверждения регистрационного разрешения</p> */}
      <Field.Root name="isAcceptedPolicy" className={fieldRootClass}>
        <Field.Error className={fieldErrorClass} match="customError" />
        <div className={policyCardClass}>
          <p>{checkboxText}</p>
          <Field.Item className="shrink-0">
            <Checkbox.Root className={checkboxRootClass} onCheckedChange={updateCheck}>
              <Checkbox.Indicator className="text-bg-alt flex transition data-unchecked:hidden">
                <CheckIcon className="size-3" />
              </Checkbox.Indicator>
            </Checkbox.Root>
          </Field.Item>
        </div>
      </Field.Root>
    </>
  )
}
