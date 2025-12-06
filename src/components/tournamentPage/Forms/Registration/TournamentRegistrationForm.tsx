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
import {
  useGetUserAnswersQuery,
  useIsFormFilledQuery,
  useSubmitFormAnswerMutation
} from "@/api/registration/clientApiInterface"
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore"
import RespondentUser from "@/components/tournamentPage/Forms/Registration/Parts/RespondentUser";
import UsersProviderWrapper from "@/api/users/ClientWrapper";
import {FaCircleCheck} from "react-icons/fa6";
import {useEffect, useState} from "react";
import CheckboxGroupRegistrationField
  from "@/components/tournamentPage/Forms/Registration/Parts/CheckboxGroupRegistrationField";
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper";
import CheckboxesWithProblems from "@/components/tournamentPage/Forms/Registration/Parts/CheckboxesWithProblems";
import {useGetTournamentCardQuery} from "@/api/tournaments/clientApiInterface";
import Loading from "@/app/loading";
import {useRouter} from "next/navigation";
import ApplicationsList from "@/components/tournamentPage/Forms/Registration/ApplicationsList";
import RegistrationFormView from "@/components/tournamentPage/Forms/Registration/RegistrationFormView";

export default function TournamentRegistrationForm({
                                                     className,
                                                     isEdit,
                                                     tournamentId,
                                                     formInfo
                                                   }: {
  formInfo: TournamentRegistrationFormInfoInterface | TournamentRegistrationAnswerInterface | null,
  className: string
  isEdit: boolean,
  tournamentId: number
}) {
  const [submitFormAnswer, {data, isLoading, isError, error, isSuccess}] = useSubmitFormAnswerMutation()
  const authId = useAppSelector(state => state.auth.authInfo?.user_id)
  const [forceRegistration, setForceRegistration] = useState(false)
  // const year = useAppSelecto
  const token = useAppSelector((state) => state.auth.token)

  const {data: oldAnswers, isLoading: isFormsLoading, refetch} = useGetUserAnswersQuery({
    token: token,
    tournamentId: tournamentId,
    formTypeFlag: "registration"
  })


  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push("/login")
    }

  }, [token]);

  return (
    <>
      {((oldAnswers || isFormsLoading) && !forceRegistration) ? (
          <>
            {oldAnswers && (
              <>
                <ApplicationsList answers={oldAnswers} tournamentId={tournamentId}/>
                <button className="w-full px-4 py-2 bg-accent-primary/20 hover:bg-accent-primary/50 border-accent-primary text-accent-primary border rounded-xl mt-2" onClick={()=>setForceRegistration(true)}>Создать еще одну заявку на турнир</button>
              </>
            )
            }
              {!oldAnswers && <Loading/>}
          </>
        ) :
        (
          <RegistrationFormView
            formInfo={formInfo}
            isEdit={isEdit}
            onSubmit={function (formData: FormData): void {
              submitFormAnswer(
                {
                  formData: formData,
                  formId: formInfo?.id ?? -1,
                }
              )
              setForceRegistration(false)
              refetch()
            }}
            tournamentId={tournamentId}/>
        )
      }
    </>
  )
}
