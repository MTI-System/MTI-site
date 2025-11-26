"use client"
import { TournamentRegistrationFormInfoInterface } from "@/types/TournamentRegistrationApi"
import { Forms } from "@/components/forms"
import LineRegistrationField from "./Parts/LineRegistrationField"
import DateRegistrationField from "./Parts/DateRegistrationField"
import DropdownRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/DropdownRegistrationField"
import PickPersonRegistrationField from "./Parts/PickPersonRegistrationField"
import { useSubmitFormAnswerMutation } from "@/api/registration/clientApiInterface"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"

export default function TournamentRegistrationForm({
  formInfo,
  className,
  isEdit,
}: {
  formInfo: TournamentRegistrationFormInfoInterface | null
  className: string
  isEdit: boolean
}) {
  const [submitFormAnswer, { data, isLoading, isError, error }] = useSubmitFormAnswerMutation()
  const token = useAppSelector((state) => state.auth.token)
  return (
    <>
      <h1 className={"font-bold text-2xl text-center w-full"}>Регистрация на турнир</h1>

      <Forms.Root isEdit={isEdit} isExpanded={false}>
        <Forms.Trigger
          className="mt-4 flex flex-col gap-2"
          onConfirm={(e) => {
            console.log("filled form", e.entries().toArray())
            e.set("token", token)
            submitFormAnswer(
              {
                formData: e,
                formId: formInfo?.id ?? -1,
              }
            )
          }}
        >
          {formInfo?.fields.map((field) => {
            switch (field.type) {
              case "number":
              case "text":
                return (
                  <LineRegistrationField
                    key={field.key}
                    field={{
                      id: -1,
                      formField: field,
                      content: "Ответ",
                    }}
                  />
                )
              case "date":
                return <DateRegistrationField key={field.key} field={field} />
              case "dropdown":
                return <DropdownRegistrationField key={field.key} field={field} />
              case "player":
                return <PickPersonRegistrationField key={field.key} field={field} />
              default:
                return <p>Unknown</p>
            }
          })}
          {isEdit && (
            <Forms.ConfirmButton className="bg-accent-primary/30 border-accent-primary hover:bg-accent-primary/50 text-accent-primary h-10 rounded-xl border px-10 font-bold">
              Отправить форму
            </Forms.ConfirmButton>
          )}
        </Forms.Trigger>
      </Forms.Root>
    </>
  )
}
