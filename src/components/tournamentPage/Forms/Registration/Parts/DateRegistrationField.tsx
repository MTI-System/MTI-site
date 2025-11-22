import { Forms } from "@/components/forms"
import { TournamentRegistrationFormFieldInterface } from "@/types/TournamentRegistrationApi"

export default function DateRegistrationField({ field }: { field: TournamentRegistrationFormFieldInterface }) {
  return (
    <>
      <Forms.EdiatableItems>
        <>
          <label className="flex flex-col gap-1 text-sm leading-5 font-medium text-gray-900">{field.title}</label>
          {
            <Forms.DatePickerField
              className="border-border bg-bg-main-accent flex h-10 w-full items-center justify-between rounded-md border px-2"
              name={field.key}
              type={"single"}
              onVerification={(value: string) => {
                return {
                  isSuccess: true,
                }
              }}
            />
          }
        </>
      </Forms.EdiatableItems>
      <Forms.DefaultItems>
        <p>Объект заполненный</p>
      </Forms.DefaultItems>
    </>
  )
}
