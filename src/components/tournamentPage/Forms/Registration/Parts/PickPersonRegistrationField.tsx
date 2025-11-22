import { Forms } from "@/components/forms"
import { TournamentRegistrationFormFieldInterface } from "@/types/TournamentRegistrationApi"

export default function PickPersonRegistrationField({ field }: { field: TournamentRegistrationFormFieldInterface }) {
  return (
    <>
      <Forms.EdiatableItems>
        {
          <Forms.UserPickerField
            key={field.id}
            name="drop_multi"
            onVerification={() => {
              return {
                isSuccess: true,
              }
            }}
          />
        }
      </Forms.EdiatableItems>
      <Forms.DefaultItems>
        <p>Человек заполненный</p>
      </Forms.DefaultItems>
    </>
  )
}
