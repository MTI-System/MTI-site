"use client"
import {
  TournamentRegistrationAnswerInterface,
  TournamentRegistrationFormInfoInterface
} from "@/types/TournamentRegistrationApi"
import {Forms} from "@/components/forms"
import LineRegistrationField from "./Parts/LineRegistrationField"
import DateRegistrationField from "./Parts/DateRegistrationField"
import DropdownRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/DropdownRegistrationField"
import PickPersonRegistrationField from "./Parts/PickPersonRegistrationField"
import {useIsFormFilledQuery, useSubmitFormAnswerMutation} from "@/api/registration/clientApiInterface"
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore"
import RespondentUser from "@/components/tournamentPage/Forms/Registration/Parts/RespondentUser";
import UsersProviderWrapper from "@/api/users/ClientWrapper";
import {FaCircleCheck} from "react-icons/fa6";
import {useEffect} from "react";
import CheckboxGroupRegistrationField
  from "@/components/tournamentPage/Forms/Registration/Parts/CheckboxGroupRegistrationField";
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper";
import CheckboxesWithProblems from "@/components/tournamentPage/Forms/Registration/Parts/CheckboxesWithProblems";
import {useGetTournamentCardQuery} from "@/api/tournaments/clientApiInterface";
import Loading from "@/app/loading";

export default function TournamentRegistrationForm({
                                                     formInfo,
                                                     className,
                                                     isEdit,
                                                     tournamentId
                                                   }: {
  formInfo: TournamentRegistrationFormInfoInterface | TournamentRegistrationAnswerInterface | null
  className: string
  isEdit: boolean,
  tournamentId: number
}) {
  const [submitFormAnswer, {data, isLoading, isError, error, isSuccess}] = useSubmitFormAnswerMutation()
  const authId = useAppSelector(state => state.auth.authInfo?.user_id)
  const {data: tournamentCard, isLoading: isTournamentCardLoading} = useGetTournamentCardQuery({id: tournamentId})
  // const year = useAppSelecto
  const {data: isFromFilled, refetch} = useIsFormFilledQuery({
    userId: authId ?? 0,
    tournamentId: tournamentId,
    formFlag: "registration",
  }, {skip: !authId || !formInfo || !isEdit})
  const token = useAppSelector((state) => state.auth.token)

  useEffect(()=>{
    if (isSuccess){
      refetch()
    }

  }, [isSuccess])

  return (
    <>
      {isFromFilled ? (
          <>
            <FaCircleCheck className="text-green-700 w-full h-[300px]"/>
            <h1 className="w-full text-center text-3xl font-bold pt-2">Форма заполнена</h1>
          </>
        ) :
        (
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
                {isEdit && (
                  <Forms.ConfirmButton
                    className="bg-accent-primary/30 border-accent-primary hover:bg-accent-primary/50 text-accent-primary h-10 rounded-xl border px-10 font-bold">
                    Отправить форму
                  </Forms.ConfirmButton>
                )}
              </Forms.Trigger>
            </Forms.Root>
          </>)
    }
    </>
  )
}
