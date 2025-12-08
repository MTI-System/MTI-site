import {
  TournamentRegistrationAnswerInterface,
  TournamentRegistrationFormInfoInterface
} from "@/types/TournamentRegistrationApi";
import UsersProviderWrapper from "@/api/users/ClientWrapper";
import LineRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/LineRegistrationField";
import DateRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/DateRegistrationField";
import DropdownRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/DropdownRegistrationField";
import PickPersonRegistrationField
  from "@/components/tournamentPage/Forms/Registration/Parts/PickPersonRegistrationField";
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper";
import CheckboxesWithProblems from "@/components/tournamentPage/Forms/Registration/Parts/CheckboxesWithProblems";
import Loading from "@/app/loading";
import { Forms } from "@/components/forms";
import {useGetTournamentCardQuery} from "@/api/tournaments/clientApiInterface";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";
import RespondentUser from "@/components/tournamentPage/Forms/Registration/Parts/RespondentUser";

export default function RegistrationFormView(
  {formInfo, isEdit, onSubmit, tournamentId}: {

    isEdit: boolean,
    onSubmit?: (formInfo: FormData) => void,
    tournamentId: number
    formInfo: TournamentRegistrationFormInfoInterface | TournamentRegistrationAnswerInterface | null,
  }

){

  const {data: tournamentCard, isLoading: isTournamentCardLoading} = useGetTournamentCardQuery({id: tournamentId})
  const token = useAppSelector((state) => state.auth.token)
  return <>
    <h1 className={"font-bold text-2xl text-center w-full text-text-main"}>Регистрация на турнир</h1>
    <Forms.Root isEdit={isEdit} isExpanded={false}>
      <Forms.Trigger
        className="mt-4 flex flex-col gap-2 text-text-main"
        onConfirm={(e) => {
          console.log("filled form", e.entries().toArray())
          e.set("token", token)
          onSubmit?.(e)



        }}
      >

        {formInfo && "respondingUser" in formInfo && <UsersProviderWrapper><RespondentUser userId={formInfo.respondingUser}/></UsersProviderWrapper>}
        {formInfo?.fields?.map((fieldObject) => {
          const field = "type" in fieldObject ? fieldObject : fieldObject.formField
          switch (field.type) {
            case "number":
            case "text":
              return (
                <LineRegistrationField
                  key={field.key}
                  field={fieldObject}
                />
              )
            case "date":
              return <DateRegistrationField key={field.key} field={fieldObject}/>
            case "dropdown":
              return <DropdownRegistrationField key={field.key} field={fieldObject}/>
            case "player":
              return (
                <UsersProviderWrapper key={field.key} >
                  <PickPersonRegistrationField field={fieldObject}/>
                </UsersProviderWrapper>

              )
            case "coach":
              return (
                <UsersProviderWrapper key={field.key} >
                  <PickPersonRegistrationField field={fieldObject}/>
                </UsersProviderWrapper>

              )
            case "problems_checkboxes":
              return (
                <ProblemsProviderWrapper key={field.key}>
                  {isTournamentCardLoading && <Loading/>}
                  {!isTournamentCardLoading
                    &&
                      <CheckboxesWithProblems field={fieldObject}
                                              year={tournamentCard?.year ?? 2026}
                                              ttype={tournamentCard?.tournament_type?.toString() ?? "1"}/>}
                </ProblemsProviderWrapper>
              )
            default:
              return <p>Unknown</p>
          }
        })}
        {/*{error && (<p className="text-red-500">При отправке формы произошла ошибка. Попробуйте позже</p>)}*/}

        {isEdit && (
          <>
            <p className="text-center text-red-600">
                Перед тем, как заявка попадет к организатору, необходимо чтобы каждый участник подтвердил её. Это можно будет сделать в уведомлениях.
            </p>
            <Forms.ConfirmButton
              className="bg-accent-primary/30 border-accent-primary hover:bg-accent-primary/50 text-accent-primary h-10 rounded-xl border px-10 font-bold cursor-pointer">
              Отправить форму
            </Forms.ConfirmButton>
          </>

        )}
      </Forms.Trigger>
    </Forms.Root>
  </>
}