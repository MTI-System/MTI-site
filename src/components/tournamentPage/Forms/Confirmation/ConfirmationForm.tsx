"use client"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"
import TournamentRegistrationForm from "@/components/tournamentPage/Forms/Registration/TournamentRegistrationForm"
import Loading from "@/app/loading"
import { Button, Form } from "@base-ui-components/react"
import RegisterRequest from "@/components/personalDataRequests/RegisterRequest"
import { TournamentRegistrationAnswerInterface } from "@/types/TournamentRegistrationApi"
import { useEffect, useState } from "react"
import { usePersonalDAtaRequestGrandMutation, usePersonalDataRequestsQuery } from "@/api/auth/clientApiInterface"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { FaCircleCheck } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import twclsx from "@/utils/twClassMerge"

export function ConfirmationForm({
  filledForm,
  tournamentId,
}: {
  filledForm: TournamentRegistrationAnswerInterface
  tournamentId: number
}) {
  // const personalDataRequests: any[] = []

  const isLoading = false
  const token = useAppSelector((store) => store.auth.token)
  const [requestsChecks, setRequestsChecks] = useState<boolean[]>([])
  const [grandPermission, { isLoading: isGranting, isSuccess: isGranted }] = usePersonalDAtaRequestGrandMutation()

  const router = useRouter()
  const {
    data: personalDataRequests,
    isLoading: isPdLoading,
    refetch: updatePermissions,
  } = usePersonalDataRequestsQuery({ token: token, neededPd: filledForm.neededPd ?? [] })
  const changeFlag = (idx: number, isOn: boolean) => {
    setRequestsChecks((prevChecks) => prevChecks.map((x, id) => (idx === id ? isOn : x)))
  }

  useEffect(() => {
    if (personalDataRequests) {
      setRequestsChecks(personalDataRequests.map(() => false))
    }
  }, [personalDataRequests])

  const acceptAll = () => {
    grandPermission({ token: token, pdIds: personalDataRequests?.map((item) => item.requestId) ?? [] })
    updatePermissions()
  }

  return (
    <>
      <div>
        {isLoading && <Loading />}
        {!isLoading && (
          <>
            <TournamentsProviderWrapper>
              {filledForm ? (
                <TournamentRegistrationForm
                  formInfo={filledForm}
                  className={""}
                  isEdit={false}
                  tournamentId={tournamentId}
                  defaultForceAnswer={true}
                />
              ) : (
                <Loading />
              )}
            </TournamentsProviderWrapper>
            <Form
              className="bg-bg-main mt-2 flex flex-col gap-2"
              onSubmit={async (e) => {
                e.preventDefault()
                acceptAll()
              }}
            >
              {personalDataRequests?.map((item, idx) => {
                switch (item.type.typeFlag) {
                  case "tournamentPdGifting":
                    return (
                      <RegisterRequest
                        key={item.requestId}
                        updateCheck={(isOn: boolean) => {
                          changeFlag(idx, isOn)
                        }}
                        checkboxText={"Даю согласие на передачу персональных данных организатору турнира"}
                      />
                    )
                }
              })}
              {isPdLoading && <Loading />}

              {(personalDataRequests?.length ?? 0) > 0 && !isGranting && (
                <Button
                  disabled={!requestsChecks.every(Boolean)}
                  focusableWhenDisabled
                  type="submit"
                  className={twclsx(
                    "bg-accent-primary/20 border-accent-primary text-accent-primary data-disabled:bg-accent-primary/5 hover:bg-accent-primary/50 h-12 w-full cursor-pointer items-center rounded-2xl border text-center data-disabled:cursor-not-allowed",
                  )}
                >
                  Подтвердить заявку
                </Button>
              )}
              {isGranting && (
                <>
                  <div className="border-accent-primary text-accent-primary bg-accent-primary/5 flex h-12 w-full animate-pulse cursor-progress items-center rounded-2xl border">
                    <p className="w-full text-center">Выдача разрешений</p>
                  </div>
                </>
              )}
              {(personalDataRequests?.length ?? 0) == 0 && (
                <>
                  <p className="py-5 text-center text-green-500">Заявка подтверждена</p>
                </>
              )}
            </Form>
          </>
        )}
      </div>
    </>
  )
}
