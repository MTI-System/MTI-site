import { Forms } from "@/components/forms"
import { formatDate } from "@/components/pickers/DatePicker"
import {
  TournamentRegistrationAnswerFieldInterface,
  TournamentRegistrationFormFieldInterface,
} from "@/types/TournamentRegistrationApi"

export default function DateRegistrationField({
  field,
}: {
  field: TournamentRegistrationFormFieldInterface | TournamentRegistrationAnswerFieldInterface
}) {
  const fieldObject = "formField" in field ? field.formField : field
  const fieldContent =
    "formField" in field ? field.content.split(" ").map((v) => `${formatDate(new Date(Number(v)))}`) : undefined

  return (
    <>
      <Forms.EdiatableItems>
        <>
          <label className="flex flex-col gap-1 text-sm leading-5 font-medium text-gray-900">{fieldObject.title}</label>
          {
            <Forms.DatePickerField
              className="border-border bg-bg-main-accent flex h-10 w-full items-center justify-between rounded-md border px-2"
              name={fieldObject.key}
              type={fieldObject?.metadata?.selectMode ?? "single"}
              onVerification={(value: string) => {
                if (fieldObject?.metadata?.optional != "true") {
                  if(!value) {
                    return {
                      isSuccess: false,
                      errorMessage: "Поле не может быть пустым"
                    }
                  }
                  else {
                    return {
                      isSuccess: true,
                    }
                  }
                }
                return {
                  isSuccess: true,
                }

              }}
            />
          }
        </>
      </Forms.EdiatableItems>
      <Forms.DefaultItems>
        {fieldContent && (
          <>
            <div className="border-border bg-bg-main-accent h-15 w-full rounded-md border px-2">
              <p className="text-text-alt h-4 px-2 pt-1 text-[13px]">{fieldObject.title}</p>
              <p className="text-text-main px-2 pt-2 font-bold">{fieldContent.join(" - ")}</p>
            </div>
          </>
        )}
        {!fieldContent && <p>Ошибка!</p>}
      </Forms.DefaultItems>
    </>
  )
}
