import { Forms } from "@/components/forms"
import {
  TournamentRegistrationAnswerFieldInterface,
  TournamentRegistrationFormFieldInterface,
} from "@/types/TournamentRegistrationApi"

export default function LineRegistrationField({
  field,
}: {
  field: TournamentRegistrationFormFieldInterface | TournamentRegistrationAnswerFieldInterface
}) {
  const fieldObject = "formField" in field ? field.formField : field
  const fieldContent = "formField" in field ? field.content : undefined

  console.log("field: ", field)
  return (
    <>
      <Forms.EdiatableItems>
        {
          <div className="border-border bg-bg-main-accent relative h-15 w-full rounded-md border">
            <p className="text-text-main absolute h-4 px-2 pt-1 text-sm font-bold">{fieldObject.title}</p>
            <Forms.InputField
              className="placeholder:text-text-alt size-full h-full px-2 pt-4 leading-11"
              type={fieldObject.type}
              name={fieldObject.key}
              placeholder={fieldObject?.metadata?.placeholder ?? fieldObject.title}
              onVerification={(value: string) => {
                if (fieldObject?.metadata?.optional != "true") {
                  if (!value) {
                    return {
                      isSuccess: false,
                      errorMessage: "Поле не может быть пустым",
                    }
                  } else {
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
          </div>
        }
      </Forms.EdiatableItems>
      <Forms.DefaultItems>
        {fieldContent && (
          <>
            <div className="border-border bg-bg-main-accent h-15 w-full rounded-md border px-2">
              <p className="text-text-alt h-4 px-2 pt-1 text-[13px]">{fieldObject.title}</p>
              <p className="text-text-main px-2 pt-2 font-bold">{fieldContent}</p>
            </div>
          </>
        )}
        {!fieldContent && (
          <div className="border-border bg-bg-main-accent h-15 w-full rounded-md border px-2">
            <p className="text-text-alt h-4 px-2 pt-1 text-[13px]">{fieldObject.title}</p>
            <p className="text-text-main px-2 pt-2 font-bold">{fieldContent}</p>
          </div>
        )}
      </Forms.DefaultItems>
    </>
  )
}
