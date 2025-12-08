"use client"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper";
import TournamentRegistrationForm from "@/components/tournamentPage/Forms/Registration/TournamentRegistrationForm";
import Loading from "@/app/loading";
import {Button, Form} from "@base-ui-components/react";
import RegisterRequest from "@/components/personalDataRequests/RegisterRequest";
import {TournamentRegistrationAnswerInterface} from "@/types/TournamentRegistrationApi";
import {useEffect, useState} from "react";
import {usePersonalDAtaRequestGrandMutation, usePersonalDataRequestsQuery} from "@/api/auth/clientApiInterface";
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore";
import {FaCircleCheck} from "react-icons/fa6";
import {useRouter} from "next/navigation";



export function ConfirmationForm(
  {filledForm, tournamentId}: { filledForm: TournamentRegistrationAnswerInterface, tournamentId: number }
) {

  // const personalDataRequests: any[] = []

  const isLoading = false
  const token = useAppSelector(store => store.auth.token)
  const [requestsChecks, setRequestsChecks] = useState<boolean[]>([])
  const [grandPermission, {isLoading: isGranting, isSuccess: isGranted}] = usePersonalDAtaRequestGrandMutation()
  const router = useRouter()
  const {data: personalDataRequests, isLoading: isPdLoading} = usePersonalDataRequestsQuery({token: token, neededPd: (filledForm.neededPd ?? [])})
  const changeFlag = (idx: number, isOn: boolean) => {
    setRequestsChecks((prevChecks) => prevChecks.map((x, id) => idx === id ? isOn : x))
  }

  useEffect(() => {
    if (personalDataRequests) {
      setRequestsChecks(personalDataRequests.map(() => false))
    }
  }, [personalDataRequests])

  const acceptAll = () => {
    grandPermission({token: token, pdIds: personalDataRequests?.map(item => item.requestId) ?? []})
    router.refresh()
  }

  return (
    <>
      <div>
        {isLoading && <Loading/>}
        {!isLoading && (
          <>
            <TournamentsProviderWrapper>
              {filledForm ? <TournamentRegistrationForm formInfo={filledForm} className={""} isEdit={false}
                                                        tournamentId={tournamentId} defaultForceAnswer={true}/> : <Loading/>}
            </TournamentsProviderWrapper>
            <Form
              className="flex flex-col gap-2 mt-2 bg-bg-main"
              onSubmit={async (e) => {
                e.preventDefault();
                acceptAll()
              }}>
              {personalDataRequests?.map((item, idx) => {
                switch (item.type.typeFlag) {
                  case "tournamentPdGifting":
                    return <RegisterRequest key={item.requestId} updateCheck={(isOn: boolean) => {
                      changeFlag(idx, isOn)
                    }}/>

                }
              })}
              {isPdLoading && <Loading/>}

              {(personalDataRequests?.length??0) > 0 && <Button
                disabled={!requestsChecks.every(Boolean)}
                focusableWhenDisabled
                type="submit"
                className="w-full h-12 bg-accent-primary/20 border border-accent-primary text-accent-primary  data-disabled:bg-accent-primary/5 data-disabled:cursor-not-allowed cursor-pointer hover:bg-accent-primary/50 rounded-2xl"
              >
                Подтвердить заявку
              </Button>}

              {(personalDataRequests?.length??0) == 0 && (
                <>
                  <p className="text-green-500 text-center py-5">Заявка подтверждена</p>
                </>
              )}

            </Form>

          </>
        )}
        {/*{(personalDataRequests?.length ?? 1) === 0 && (*/}
        {/*  <>*/}
        {/*    <FaCircleCheck className="text-green-700 w-full h-[300px]"/>*/}
        {/*    /!*{JSON.stringify(personalDataRequests)}*!/*/}
        {/*    <h1 className="w-full text-center text-3xl font-bold pt-2 text-text-main">Заявка подтверждена</h1>*/}
        {/*  </>*/}
        {/*)}*/}
      </div>
    </>
  )
}