import { Forms } from "@/components/forms"
import { TournamentRegistrationAnswerFieldInterface, TournamentRegistrationFormFieldInterface } from "@/types/TournamentRegistrationApi"

export default function DropdownRegistrationField({
  field,
}: {
  field: TournamentRegistrationFormFieldInterface | TournamentRegistrationAnswerFieldInterface
}) {
  const fieldObject = "formField" in field ? field.formField : field
  const fieldContent = "formField" in field ? field.content : undefined

  return (
    <>
      <Forms.EdiatableItems>
        {
          <>
            <label className="flex flex-col gap-1 text-sm leading-5 font-medium text-gray-900">{fieldObject.title}</label>
            <Forms.DropdownField
              fields={fieldObject.metadata.dropdown_options ?? []}
              key={fieldObject.id}
              name={fieldObject.key}
              onVerification={() => {
                return {
                  isSuccess: true,
                }
              }}
              type="single"
            />
          </>
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
        {!fieldContent && <p>Ошибка!</p>}
      </Forms.DefaultItems>
    </>
  )
}
