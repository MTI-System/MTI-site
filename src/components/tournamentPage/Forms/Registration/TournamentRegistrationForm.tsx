"use client"
import {
  TournamentRegistrationAnswerInterface,
  TournamentRegistrationFormInfoInterface,
} from "@/types/TournamentRegistrationApi"
import { useGetUserAnswersQuery, useSubmitFormAnswerMutation } from "@/api/registration/clientApiInterface"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useEffect, useState } from "react"
import Loading from "@/app/loading"
import { useRouter } from "next/navigation"
import ApplicationsList from "@/components/tournamentPage/Forms/Registration/ApplicationsList"
import RegistrationFormView from "@/components/tournamentPage/Forms/Registration/RegistrationFormView"

export default function TournamentRegistrationForm({
  isEdit,
  tournamentId,
  formInfo,
  defaultForceAnswer = false,
}: {
  formInfo: TournamentRegistrationFormInfoInterface | TournamentRegistrationAnswerInterface | null
  className: string
  isEdit: boolean
  tournamentId: number
  defaultForceAnswer?: boolean
}) {
  const [submitFormAnswer, { data, isLoading, isError, error, isSuccess }] = useSubmitFormAnswerMutation()
  const authId = useAppSelector((state) => state.auth.authInfo?.user_id)
  const [forceRegistration, setForceRegistration] = useState(defaultForceAnswer ?? false)
  // const year = useAppSelecto
  const token = useAppSelector((state) => state.auth.token)

  useEffect(() => {
    if (isSuccess) {
      setForceRegistration(false)
      refetch()
    }
  }, [isSuccess])

  const {
    data: oldAnswers,
    isLoading: isFormsLoading,
    refetch,
  } = useGetUserAnswersQuery({
    token: token,
    tournamentId: tournamentId,
    formTypeFlag: "registration",
  })

  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [token])

  return (
    <>
      {(oldAnswers || isFormsLoading) && !forceRegistration ? (
        <>
          {oldAnswers && (
            <>
              <ApplicationsList answers={oldAnswers} tournamentId={tournamentId} />
              <button
                className="bg-accent-primary/20 hover:bg-accent-primary/50 border-accent-primary text-accent-primary mt-2 w-full rounded-xl border px-4 py-2"
                onClick={() => setForceRegistration(true)}
              >
                Создать еще одну заявку на турнир
              </button>
            </>
          )}
          {!oldAnswers && <Loading />}
        </>
      ) : (
        <div className="relative">
          {isLoading && (
            <div className="bg-bg-alt/60 absolute z-2 size-full animate-pulse">
              <Loading />
            </div>
          )}
          <RegistrationFormView
            formInfo={formInfo}
            isEdit={isEdit}
            onSubmit={function (formData: FormData): void {
              submitFormAnswer({
                formData: formData,
                formId: formInfo?.id ?? -1,
              })
            }}
            tournamentId={tournamentId}
          />
        </div>
      )}
    </>
  )
}
