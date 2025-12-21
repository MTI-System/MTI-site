"use client"

import * as React from "react"
import { Tabs } from "@base-ui-components/react/tabs"
import { Accordion } from "@base-ui-components/react/accordion"

import {
  FightInformationInterface,
} from "@/types/TournamentsAPI"

import { useGetActionInformationQuery } from "@/api/tournaments/clientApiInterface"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"

import { useGetUserByIdQuery } from "@/api/users/clientApiInterface"
import UsersProviderWrapper from "@/api/users/ClientWrapper"

import { FightTable } from "./FightTable"
import { useGetProblemsByIdQuery } from "@/api/problems/clientApiInterface"
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"
import Loading from "@/app/loading"
import Link from "next/link"

export default function Fight({
  fightData,
}: {
  fightData: FightInformationInterface
}) {
  return (
    <div className="flex flex-col p-6">
      <h1 className="mx-auto my-5 text-center text-2xl font-bold text-text-main">
        Действия боя
      </h1>

      <div className=" rounded-2xl border border-border overflow-x-auto">
        <FightTable teams={fightData.teams} />
      </div>

      <ActionTabs fightData={fightData} />
    </div>
  )
}

function ActionTabs({
  fightData,
}: {
  fightData: FightInformationInterface
}) {
  return (
    <Tabs.Root defaultValue={`${fightData.actions[0]}_action`}>
      <Tabs.List className="relative z-0 mt-6 flex justify-center gap-1 px-1">
        {fightData.actions.map((id, index) => (
          <Tabs.Tab
            key={id}
            value={`${id}_action`}
            className="flex h-8 items-center justify-center whitespace-nowrap px-2 text-sm font-medium text-gray-600 outline-none hover:text-gray-900 data-active:text-gray-900"
          >
            {`Действие ${index+1}`}
          </Tabs.Tab>
        ))}

        <Tabs.Indicator className="absolute left-0 top-1/2 z-[-1] h-6 w-(--active-tab-width) -translate-y-1/2 translate-x-(--active-tab-left) rounded-sm bg-gray-100 transition-all duration-200" />
      </Tabs.List>

      {fightData.actions.map((id) => (
        <Tabs.Panel
          key={id}
          value={`${id}_action`}
          className="mt-5"
        >
          <TournamentsProviderWrapper>
            <ProblemsProviderWrapper>
            <FightAction actionId={id} />
            </ProblemsProviderWrapper>
          </TournamentsProviderWrapper>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  )
}

function FightAction({ actionId }: { actionId: number }) {
  const { data: actionData, isLoading: isActionData, error:actionErr } =
    useGetActionInformationQuery({ actionId })
    const { data: problemData, isLoading: isProblemLoading, error: problemErr } = useGetProblemsByIdQuery({problemId: actionData?.pickedProblem}, {skip: !actionData || !actionData.pickedProblem})

  if (isActionData || isProblemLoading) return <Loading/>
    if (actionErr) {
    return (
      <div className="p-4">
        <h1 className="text-red-600 text-xl font-bold">Error</h1>
        <p className="mt-2">{JSON.stringify(actionErr)}</p>
      </div>
    )
  }
  if (!actionData) return <p className="text-red-500">Error</p>
  


  return (
    <div className="flex w-full gap-6 flex-col">
      <div className="w-full  p-4 text-center">
        <div className="mb-1 text-sm uppercase text-text-alt">
          Задача
        </div>
        <Link href={`/problems/${problemData?.id}`} className="text-lg font-bold uppercase">
          {problemData?.global_number+". " + problemData?.problem_translations[0].problem_name}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3  gap-6">
        {actionData.playerLines.map((line) => (
            <div key={line.role?.id} className="flex flex-col flex-1 w-full border border-border rounded-2xl ">
                  <div className="flex flex-col gap-3 flex-none text-center m-2">

                    <div className="text-text-alt uppercase bg-">
                      {line.role?.title ?? "—"}
                    </div>

                    <div className="font-medium">
                      {line.team.name}
                    </div>
                  
                  <UsersProviderWrapper>
                    <UserCell userId={line.playerId} />
                  </UsersProviderWrapper>

                  <div className="bg-muted/40 px-6 py-4">
                  <JuryScores scores={line.scores} />
                </div>

                  </div>
            </div>

        ))}

      </div>
      {/* <div className="flex-1">
        <Accordion.Root
          className="flex flex-col overflow-hidden rounded-2xl border border-border"
        >
          {data.playerLines.map((line, index) => (
            <Accordion.Item
              key={index}
              className="border-b border-border last:border-b-0"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group grid w-full grid-cols-[2fr_2fr_3fr_1fr_auto] items-center gap-4 bg-background px-4 py-3 text-left text-sm hover:bg-hover focus-visible:outline focus-visible:outline-blue-800">
                  <div className="flex flex-row">
                  <div className="flex flex-col gap-3 flex-none">
                    <div className="font-medium">
                      {line.team.name}
                    </div>

                    <div className="text-text-alt">
                      {line.role?.title ?? "—"}
                    </div>
                  
                  <UsersProviderWrapper>
                    <UserCell userId={line.playerId} />
                  </UsersProviderWrapper>

                  </div>
                    <div className="text-center font-semibold mx-auto justify-center flex flex-1 flex-row">
                      {line.finalScore.toFixed(2)}
                    </div>
                  <CheckIcon className="items-end justify-end size-3 shrink-0 transition-all ease-out group-data-panel-open:scale-110 group-data-panel-open:rotate-45" />
                </div>
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] ease-out data-starting-style:h-0 data-ending-style:h-0">
                <div className="bg-muted/40 px-6 py-4">
                  <JuryScores scores={line.scores} />
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root> */}
      </div>
  )
}

function JuryScores({scores,}: {scores: { id: number; value: number; jury: number }[]}) {
  if (!scores.length) {
    return <p className="text-sm text-text-alt">Оценки отсутствуют</p>
  }

  return (
    <div className="max-w-md">
      <div className="mb-2 text-sm font-medium">Оценки жюри</div>

      <div className="grid grid-cols-2 gap-2">
        {scores.map((score, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <div className="text-text-alt"><UsersProviderWrapper><UserCell userId={score.jury}/></UsersProviderWrapper></div>
            <div className="font-semibold">{score.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function UserCell({ userId }: { userId?: number }) {
  if (!userId) return <span>—</span>

  const { data, isLoading } = useGetUserByIdQuery({ id: userId })

  if (isLoading) {
    return (
      <div className="h-5 w-40 animate-pulse rounded bg-hover" />
    )
  }

  if (!data) return <span>not found</span>

  return (
    <div className="text-center text-wrap justify-center items-center">
      {data.secondName} {data.firstName}
      {data.auth === null ? "." : ""} {data.thirdName}
    </div>
  )
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  );
}
