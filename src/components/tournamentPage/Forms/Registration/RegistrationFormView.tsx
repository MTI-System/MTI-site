import {
  TournamentRegistrationAnswerInterface,
  TournamentRegistrationFormInfoInterface,
} from "@/types/TournamentRegistrationApi"
import UsersProviderWrapper from "@/api/users/ClientWrapper"
import LineRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/LineRegistrationField"
import DateRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/DateRegistrationField"
import DropdownRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/DropdownRegistrationField"
import PickPersonRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/PickPersonRegistrationField"
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"
import CheckboxesWithProblems from "@/components/tournamentPage/Forms/Registration/Parts/CheckboxesWithProblems"
import Loading from "@/app/loading"
import { Forms } from "@/components/forms"
import { useGetTournamentCardQuery } from "@/api/tournaments/clientApiInterface"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import RespondentUser from "@/components/tournamentPage/Forms/Registration/Parts/RespondentUser"
import RegisterRequest from "@/components/personalDataRequests/RegisterRequest"
import { useState } from "react"
import AddFileField from "@/components/materials/AddFileField"
import FileRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/FileRegistrationField"

export default function RegistrationFormView({
  formInfo,
  isEdit,
  onSubmit,
  tournamentId,
}: {
  isEdit: boolean
  onSubmit?: (formInfo: FormData) => void
  tournamentId: number
  formInfo: TournamentRegistrationFormInfoInterface | TournamentRegistrationAnswerInterface | null
}) {
  const { data: tournamentCard, isLoading: isTournamentCardLoading } = useGetTournamentCardQuery({ id: tournamentId })
  const [isPdAccepted, setIsPdAccepted] = useState(true)
  const token = useAppSelector((state) => state.auth.token)
  return (
    <>
      <h1 className={"text-text-main w-full text-center text-2xl font-bold"}>Регистрация на турнир</h1>
      <Forms.Root isEdit={isEdit} isExpanded={false}>
        <Forms.Trigger
          className="text-text-main mt-4 flex flex-col gap-2"
          onConfirm={(e) => {
            console.log("filled form", e.entries().toArray())
            e.set("token", token)
            onSubmit?.(e)
          }}
        >
          {formInfo && "respondingUser" in formInfo && (
            <UsersProviderWrapper>
              <RespondentUser userId={formInfo.respondingUser} />
            </UsersProviderWrapper>
          )}
          {formInfo?.fields?.map((fieldObject) => {
            const field = "type" in fieldObject ? fieldObject : fieldObject.formField
            return (
              <div key={field.key} className="flex w-full gap-2">
                <span className="w-10 text-red-800">{field?.metadata?.optional != "true" ? "(*)" : ""}</span>
                {(() => {
                  switch (field.type) {
                    case "number":
                    case "text":
                      return <LineRegistrationField key={field.key} field={fieldObject} />
                    case "file":
                      return (
                        <>
                          <FileRegistrationField field={fieldObject} />
                        </>
                      )
                    case "date":
                      return <DateRegistrationField key={field.key} field={fieldObject} />
                    case "dropdown":
                      return <DropdownRegistrationField key={field.key} field={fieldObject} />
                    case "player":
                      return (
                        <UsersProviderWrapper key={field.key}>
                          <PickPersonRegistrationField field={fieldObject} />
                        </UsersProviderWrapper>
                      )
                    case "coach":
                      return (
                        <UsersProviderWrapper key={field.key}>
                          <PickPersonRegistrationField field={fieldObject} />
                        </UsersProviderWrapper>
                      )
                    case "problems_checkboxes":
                      return (
                        <ProblemsProviderWrapper key={field.key}>
                          {isTournamentCardLoading && <Loading />}
                          {!isTournamentCardLoading && (
                            <CheckboxesWithProblems
                              field={fieldObject}
                              year={tournamentCard?.year ?? 2026}
                              ttype={tournamentCard?.tournament_type?.toString() ?? "1"}
                            />
                          )}
                        </ProblemsProviderWrapper>
                      )
                    case "title_ni":
                      return (
                        <div className="py-2">
                          <p className="text-2xl font-bold">{field.title}</p>
                          {field.metadata?.subtitle && <p className="text-md">{field.metadata?.subtitle}</p>}
                        </div>
                      )
                    default:
                      return <p>Unknown</p>
                  }
                })()}
              </div>
            )
          })}
          {/*{error && (<p className="text-red-500">При отправке формы произошла ошибка. Попробуйте позже</p>)}*/}

          {isEdit && (
            <>
              {/* <RegisterRequest updateCheck={(isOn: boolean) => {
              setIsPdAccepted(isOn)
            }}
                             checkboxText={"Даю согласие на обработку ПД с целью регистрации на турнир " + tournamentCard?.title}/> */}
              <p className="text-center text-red-600">
                Перед тем, как заявка попадет к организатору, необходимо чтобы каждый участник подтвердил её. Это можно
                будет сделать в уведомлениях.
              </p>
              <Forms.ConfirmButton
                disabled={!isPdAccepted}
                className="bg-accent-primary/30 border-accent-primary hover:bg-accent-primary/50 text-accent-primary disabled:bg-bg-alt h-10 cursor-pointer rounded-xl border px-10 font-bold disabled:cursor-not-allowed"
              >
                Отправить форму
              </Forms.ConfirmButton>
            </>
          )}
        </Forms.Trigger>
      </Forms.Root>
    </>
  )
}
