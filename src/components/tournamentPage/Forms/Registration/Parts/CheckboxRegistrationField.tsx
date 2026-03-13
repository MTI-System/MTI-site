import { Forms } from "@/components/forms"
import {
  TournamentRegistrationAnswerFieldInterface,
  TournamentRegistrationFormFieldInterface,
} from "@/types/TournamentRegistrationApi"

export default function CheckboxRegistrationField({
  field,
}: {
  field: TournamentRegistrationFormFieldInterface | TournamentRegistrationAnswerFieldInterface
}) {
  const fieldObject = "formField" in field ? field.formField : field
  const fieldContent = "formField" in field ? field.content : undefined
  return (
    <>
      <Forms.EdiatableItems>
        <label className="flex items-center gap-2 text-base text-gray-900">
          <Forms.CheckboxField
            title={fieldObject.title}
            value={fieldObject.key}
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
            name={fieldObject.key}
          />
          {fieldObject.title}
        </label>
      </Forms.EdiatableItems>
      <Forms.DefaultItems>
        {fieldContent && (
          <>
            <div className="border-border bg-bg-main-accent h-15 w-full rounded-md border px-2">
              {/* <p className="text-text-alt h-4 px-2 pt-1 text-[13px]">{fieldObject.title}</p>
              <p className="text-text-main px-2 pt-2 font-bold">{fieldContent}</p> */}
              {/* TODO: Make default items for checkbox */}
            </div>
          </>
        )}
        {!fieldContent && <p>Ошибка!</p>}
      </Forms.DefaultItems>
    </>
  )
}
