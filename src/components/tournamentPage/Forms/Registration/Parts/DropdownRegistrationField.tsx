import { Forms } from "@/components/forms"
import { TournamentRegistrationFormFieldInterface } from "@/types/TournamentRegistrationApi"

export default function DropdownRegistrationField({ field }: { field: TournamentRegistrationFormFieldInterface }) {
  return (
    <>
      <Forms.EdiatableItems>
        {
          <>
            <label className="flex flex-col gap-1 text-sm leading-5 font-medium text-gray-900">{field.title}</label>
            <Forms.DropdownField
              fields={field.metadata.dropdown_options ?? []}
              key={field.id}
              name={field.key}
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
        <p>Дропдаун заполненный</p>
      </Forms.DefaultItems>
    </>
  )
}
