"use client"

import {usePersonalDataRequestsQuery} from "@/api/auth/clientApiInterface";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";
import Loading from "@/app/loading";
import { Checkbox, Field } from "@base-ui-components/react";

const formCardClass =
  "flex w-full max-w-3xl flex-col gap-6 rounded-2xl bg-white/95 py-5 overflow-visible max-h-[calc(100vh-6rem)] min-h-[14rem] sm:min-h-[20rem] lg:min-h-[26rem] min-w-[18rem]"
const fieldRootClass = "flex w-full flex-col items-start gap-1 text-gray-900"
const fieldLabelClass = "text-sm font-semibold uppercase tracking-wide text-gray-700"
const fieldErrorClass = "text-sm font-medium text-red-600"
const inputClass =
  "h-15 w-full rounded-xl border border-border bg-white/80 px-4 text-lg text-gray-900 placeholder:text-gray-400 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
const actionButtonClass =
  "bg-accent-primary-alt border border-accent-primary text-accent-primary h-15 w-full rounded-xl font-semibold tracking-wide transition duration-200 outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70"
const inlineGridClass = "grid w-full gap-5 md:grid-cols-2"
const datePickerClass =
  "outline-none flex h-15 w-full items-center justify-between rounded-xl border border-border bg-white/70 px-4 text-lg text-gray-900 transition duration-200 focus-within:ring-2 focus-within:ring-accent-primary focus-within:ring-offset-2 focus-within:ring-offset-white"
const policyCardClass =
  "flex w-full h-15 flex-col gap-3 rounded-xl border border-border bg-white/80 p-4 text-sm leading-relaxed text-gray-900 sm:flex-row sm:items-center sm:justify-between sm:gap-4 select-none"
const checkboxRootClass =
  "flex size-5 items-center justify-center rounded-md border border-gray-300 bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white data-checked:border-transparent data-checked:bg-gray-900"

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  )
}


export default function RegisterRequest() {

  return (
    <>
      {/* <p>Галочка для подтверждения регистрационного разрешения</p> */}
      <Field.Root name="isAcceptedPolicy" className={fieldRootClass}>
        <Field.Error className={fieldErrorClass} match="customError" />
        <div className={policyCardClass}>
          <p>
            Я соглашаюсь с{" "}
            <a
              className="text-accent-primary underline underline-offset-4 transition hover:opacity-80"
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            >
              Политикой политикой передачи информации турнирным операторам
            </a>
          </p>
          <Field.Item className="shrink-0">
            <Checkbox.Root className={checkboxRootClass}>
              <Checkbox.Indicator className="flex text-gray-50 transition data-unchecked:hidden">
                <CheckIcon className="size-3" />
              </Checkbox.Indicator>
            </Checkbox.Root>
          </Field.Item>
        </div>
      </Field.Root>
    </>
  )
}


