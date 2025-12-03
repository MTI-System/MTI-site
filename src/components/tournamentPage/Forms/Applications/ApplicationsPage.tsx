"use client"

import { useFormsInformationQuery, useGetAnswersQuery } from "@/api/registration/clientApiInterface"
import Loading from "@/app/loading"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import TournamentRegistrationForm from "../Registration/TournamentRegistrationForm"
import { Accordion } from "@base-ui-components/react"
import {useGetTournamentCardQuery} from "@/api/tournaments/clientApiInterface";
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper";

export default function ApplicationsPage(
    {id}: {id: number}
){
    const {data, isLoading} = useFormsInformationQuery({
        id: id
    })
    const formId = data?.available_forms?.find(f=>f.form_type_flag==="registration")?.form_id
    const token = useAppSelector(state=>state.auth.token)
    const {data: answers, isLoading: isAnswersLoading} = useGetAnswersQuery({
        token: token,
        id: formId
    }, {skip: formId===undefined})
    console.log("answers: ", answers, formId, isAnswersLoading)
    return (
        <>
            {isAnswersLoading && <Loading/>}
            {answers ? (
              <>
                <Accordion.Root className="flex w-full max-w-[calc(100vw-8rem)] flex-col justify-center text-gray-900 gap-2">
                  {answers.map((answer, idx)=>
                    <Accordion.Item key={idx} className="border-b border-gray-200">
                      <Accordion.Header>
                        <Accordion.Trigger className="group relative flex w-full items-baseline justify-between gap-4 bg-gray-50 py-2 pr-1 pl-3 text-left font-medium hover:bg-gray-100 focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
                          Заявка {idx}
                          <PlusIcon className="mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45" />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-gray-600 transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
                        <TournamentsProviderWrapper>
                          <TournamentRegistrationForm formInfo={answer} isEdit={false} className={""} tournamentId={id}/> </TournamentsProviderWrapper>
                      </Accordion.Panel>
                    </Accordion.Item>
                )}
              </Accordion.Root>
              </>  
            ): <p>Нет заявок</p>}
        </>
    )
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  );
}
