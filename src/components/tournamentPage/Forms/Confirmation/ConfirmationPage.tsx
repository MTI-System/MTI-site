"use client"
import {usePersonalDAtaRequestGrandMutation, usePersonalDataRequestsQuery} from "@/api/auth/clientApiInterface"
import Loading from "@/app/loading"
import RegisterRequest from "@/components/personalDataRequests/RegisterRequest"
import {useAppSelector} from "@/redux_stores/Global/tournamentTypeRedixStore"
import {Button, Form} from "@base-ui-components/react"
import {useEffect, useState} from "react";
import {FaCircleCheck} from "react-icons/fa6";
import {useRouter} from "next/navigation";
import {useGetAnswerQuery} from "@/api/registration/clientApiInterface";
import TournamentRegistrationForm from "@/components/tournamentPage/Forms/Registration/TournamentRegistrationForm";
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper";


export default function ConfirmationPage(
  {tournamentId}: { tournamentId: number }
) {
  // Сначала ищется заявка с этим пользователем (сделать эндпоинт)
  // Эта заявка отображается.
  // Далее галочки, которые летят со специального эндпоинта и кнопка подтвердить заявку. ready
  const token = useAppSelector(store => store.auth.token)
  const {data: personalDataRequests, isLoading, isSuccess, refetch} = usePersonalDataRequestsQuery({
    token: token,
    tournamentId: tournamentId
  })
  const [requestsChecks, setRequestsChecks] = useState<boolean[]>([])
  const [grandPermission, {isLoading: isGranting, isSuccess: isGranted}] = usePersonalDAtaRequestGrandMutation()
  const {data: filledForm} = useGetAnswerQuery(
    {
      tournamentId: tournamentId,
      token: token,
      formTypeFlag: "registration"
    }
  )
  const router = useRouter()
  useEffect(() => {
    if (personalDataRequests) {
      setRequestsChecks(personalDataRequests.map(() => false))
    }
  }, [personalDataRequests])

  const changeFlag = (idx: number, isOn: boolean) => {
    setRequestsChecks((prevChecks) => prevChecks.map((x, id) => idx === id ? isOn : x))
  }

  useEffect(() => {
    console.log("granted", isGranted)
    if (isGranted) {
      refetch()
      // router.refresh()
    }
  }, [isGranted]);


  const acceptAll = () => {
    grandPermission({token: token, pdIds: personalDataRequests?.map(item => item.requestId) ?? []})
    router.refresh()
  }


  return (
    <>
      <div>
        {isLoading && <Loading/>}
        {!isLoading && ((personalDataRequests?.length ?? 0) > 0) && (
          <>
            <TournamentsProviderWrapper>
              {filledForm ? <TournamentRegistrationForm formInfo={filledForm} className={""} isEdit={false}
                                                        tournamentId={tournamentId}/> : <Loading/>}
            </TournamentsProviderWrapper>
            <Form
              className="flex flex-col gap-2 mt-2"
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
              <Button
                disabled={!requestsChecks.every(Boolean)}
                focusableWhenDisabled
                type="submit"
                className="flex items-center justify-center h-10 px-3.5 m-0 outline-0 border border-gray-200 rounded-md bg-gray-50 font-inherit text-base font-medium leading-6 text-gray-900 select-none hover:data-[disabled]:bg-gray-50 hover:bg-gray-100 active:data-[disabled]:bg-gray-50 active:bg-gray-200 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] active:border-t-gray-300 active:data-[disabled]:shadow-none active:data-[disabled]:border-t-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800 focus-visible:-outline-offset-1 data-[disabled]:text-gray-500"
              >
                Подтвердить заявку
              </Button>
            </Form>

          </>
        )}
        {(personalDataRequests?.length ?? 1) === 0 && (
          <>
            <FaCircleCheck className="text-green-700 w-full h-[300px]"/>
            <h1 className="w-full text-center text-3xl font-bold pt-2">Заявка подтверждена</h1>
          </>
        )}
      </div>
    </>
  )
}