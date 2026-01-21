"use client"
import { usePersonalDAtaRequestGrandMutation, usePersonalDataRequestsQuery } from "@/api/auth/clientApiInterface"
import Loading from "@/app/loading"
import RegisterRequest from "@/components/personalDataRequests/RegisterRequest"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { Accordion, Button, Form } from "@base-ui-components/react"
import React, { useEffect, useState } from "react"
import { FaCircleCheck } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import { useGetAnswerQuery, useGetUserAnswersQuery } from "@/api/registration/clientApiInterface"
import TournamentRegistrationForm from "@/components/tournamentPage/Forms/Registration/TournamentRegistrationForm"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"
import { ConfirmationForm } from "@/components/tournamentPage/Forms/Confirmation/ConfirmationForm"

export default function ConfirmationPage({ tournamentId }: { tournamentId: number }) {
  // Сначала ищется заявка с этим пользователем (сделать эндпоинт)
  // Эта заявка отображается.
  // Далее галочки, которые летят со специального эндпоинта и кнопка подтвердить заявку. ready
  const token = useAppSelector((store) => store.auth.token)
  // const {data: personalDataRequests, isLoading, isSuccess, refetch} = usePersonalDataRequestsQuery({
  //   token: token,
  //   tournamentId: tournamentId
  // })
  const [requestsChecks, setRequestsChecks] = useState<boolean[]>([])
  const [grandPermission, { isLoading: isGranting, isSuccess: isGranted }] = usePersonalDAtaRequestGrandMutation()
  // const {data: filledForm} = useGetAnswerQuery(
  //   {
  //     tournamentId: tournamentId,
  //     token: token,
  //     formTypeFlag: "registration"
  //   }
  // )
  const {
    data: filledForms,
    isLoading: isFilledFormsLoading,
    isError: isFilledFormsError,
  } = useGetUserAnswersQuery({ token: token, tournamentId: tournamentId, formTypeFlag: "registration" })

  const router = useRouter()
  // useEffect(() => {
  //   if (personalDataRequests) {
  //     setRequestsChecks(personalDataRequests.map(() => false))
  //   }
  // }, [personalDataRequests])

  // useEffect(() => {
  //   console.log("granted", isGranted)
  //   if (isGranted) {
  //     refetch()
  //     // router.refresh()
  //   }
  // }, [isGranted]);

  // const acceptAll = () => {
  //   grandPermission({token: token, pdIds: personalDataRequests?.map(item => item.requestId) ?? []})
  //   router.refresh()
  // }

  return (
    <>
      {isFilledFormsLoading && <Loading />}
      {isFilledFormsError && <p>Ошибка загрузки заполненных форм</p>}
      <Accordion.Root className="text-text-main flex w-full flex-col justify-center gap-2">
        {filledForms?.map((filledForm, idx) => (
          <Accordion.Item className="border-border overflow-hidden rounded-xl border" key={idx}>
            <Accordion.Header>
              <Accordion.Trigger className="group bg-ba-main hover:bg-hover focus-visible:outline-accent-primary relative flex w-full items-baseline justify-between gap-4 py-2 pr-1 pl-3 text-left font-medium focus-visible:z-1 focus-visible:outline focus-visible:outline-2">
                Заявка {idx + 1}
                <PlusIcon className="mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-gray-600 transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
              <ConfirmationForm key={idx} filledForm={filledForm} tournamentId={tournamentId} />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      <p className="text-center text-red-500">
        Организатор увидит только те заявки, в которых есть подпись "все разрешения выданы"
      </p>
    </>
  )
}

function PlusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  )
}
