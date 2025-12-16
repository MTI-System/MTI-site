"use client"
import { Accordion } from "@base-ui-components/react"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"
import TournamentRegistrationForm from "@/components/tournamentPage/Forms/Registration/TournamentRegistrationForm"
import {
  TournamentRegistrationAnswerFieldInterface,
  TournamentRegistrationAnswerInterface,
} from "@/types/TournamentRegistrationApi"
import React from "react"
import RegistrationFormView from "@/components/tournamentPage/Forms/Registration/RegistrationFormView"

export default function ApplicationsList({
  answers,
  tournamentId,
}: {
  answers: TournamentRegistrationAnswerInterface[]
  tournamentId: number
}) {
  return (
    <>
      {/*{JSON.stringify(answers)}*/}
      <Accordion.Root className="flex w-full max-w-[calc(100vw-8rem)] flex-col justify-center gap-2 text-gray-900">
        {answers.map((answer, idx) => (
          <Accordion.Item key={idx} className="border-b border-gray-200">
            <Accordion.Header>
              <Accordion.Trigger className="group relative flex w-full items-baseline justify-between gap-4 bg-gray-50 py-2 pr-1 pl-3 text-left font-medium hover:bg-gray-100 focus-visible:z-1 focus-visible:outline focus-visible:outline-blue-800">
                Заявка {idx + 1}
                <PlusIcon className="mr-2 size-3 shrink-0 transition-all ease-out group-data-panel-open:scale-110 group-data-panel-open:rotate-45" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden text-base text-gray-600 transition-[height] ease-out data-ending-style:h-0 data-starting-style:h-0">
              <TournamentsProviderWrapper>
                <>
                  <RegistrationFormView formInfo={answer} isEdit={false} tournamentId={tournamentId} />
                </>
              </TournamentsProviderWrapper>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
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
