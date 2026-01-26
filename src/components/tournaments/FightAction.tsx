"use client"

import * as React from "react"
import { Tabs } from "@base-ui-components/react/tabs"
import { Accordion } from "@base-ui-components/react/accordion"

import { FightInformationInterface } from "@/types/TournamentsAPI"

import { useGetActionInformationQuery } from "@/api/tournaments/clientApiInterface"
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"

import { useGetUserByIdQuery } from "@/api/users/clientApiInterface"
import UsersProviderWrapper from "@/api/users/ClientWrapper"

import { FightTable } from "./FightTable"
import { useGetProblemsByIdQuery } from "@/api/problems/clientApiInterface"
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"
import Loading from "@/app/loading"
import Link from "next/link"
import DraftList from "@/components/tournamentPage/FightsPage/DraftList";

export function ActionTabs({ fightData }: { fightData: FightInformationInterface }) {
  return (
    <Tabs.Root defaultValue={`${fightData.actions[0]}_action`}>
      <Tabs.List className="relative z-0 mt-10 flex justify-center gap-1 px-1">
        {fightData.actions.map((id, index) => (
          <Tabs.Tab
            key={id}
            value={`${id}_action`}
            className="text-text-alt hover:text-text-main data-active:text-text-main flex h-8 items-center justify-center px-2 text-sm font-medium whitespace-nowrap transition-colors outline-none"
          >
            {`Действие ${index + 1}`}
          </Tabs.Tab>
        ))}

        <Tabs.Indicator className="bg-bg-main absolute top-1/2 left-0 z-[-1] h-6 w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-1/2 rounded-sm transition-all duration-200" />
      </Tabs.List>

      {fightData.actions.map((id) => (
        <Tabs.Panel key={id} value={`${id}_action`} className="mt-5">
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
  const { data: actionData, isLoading: isActionData, error: actionErr } = useGetActionInformationQuery({ actionId })
  console.log(actionData)
  const {
    data: problemData,
    isLoading: isProblemLoading,
    error: problemErr,
  } = useGetProblemsByIdQuery({ problemId: actionData?.pickedProblem }, { skip: !actionData?.pickedProblem })

  if (isActionData || isProblemLoading) return <Loading />
  if (actionErr) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-red-600">Error</h1>
        <p className="mt-2">{JSON.stringify(actionErr)}</p>
      </div>
    )
  }
  if (!actionData) return <p className="text-red-500">Error</p>

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="w-full px-4 pt-4 text-center">
        <div className="text-text-alt mb-4 sm:text-xl text-md uppercase">Задача</div>
        {problemData?.id ? (
          <Link href={`/problems/${problemData?.id}`} className="text-text-main text-lg font-bold uppercase">
            {(problemData?.local_number ?? `(${problemData?.local_number})`) + ". " + problemData?.problem_translations[0].problem_name}
          </Link>
        ) : (
          <p className="text-text-main text-lg font-bold uppercase">-</p>
        )}
      </div>


      <div className="w-full text-center">
          <h3 className="text-text-main text-lg font-bold uppercase py-4">
            Процедура вызова
          </h3>
          <DraftList actionId={actionId}/>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {actionData.playerLines.map((line) => (
          <>{line.role?.title && line.role.title !== "Наблюдатель" && (
          <div key={line.role?.id} className="border-border flex w-full flex-1 flex-col rounded-2xl border">
            <div className="text-text-main m-2 flex flex-none flex-col gap-3 text-center items-center justify-center">
              <div className="text-text-alt mt-2 uppercase">{line.role?.title ?? "—"}</div>

              <div className="text-text-main font-medium">{line.team.name}</div>

              <UsersProviderWrapper>
                <UserCell userId={line.playerId} />
              </UsersProviderWrapper>

              <div className="bg-muted/40 px-6 py-4">
                <JuryScores scores={line.scores} />
              </div>
            </div>
          </div>)}</>
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

function JuryScores({ scores }: { scores: { id: number; value: number; jury: number }[] }) {
  if (!scores.length) {
    return <p className="text-text-alt text-sm">Оценки отсутствуют</p>
  }

  return (
    <div className="text-text-main max-w-md">
      <div className="mb-2 sm:text-sm text-md lg:text-lg font-medium">Оценки жюри</div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
        {scores.map((score, index) => (
          <div
            key={index}
            className="border-border bg-background flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2"
          >
            <div className="text-text-alt text-wrap flex-3">
              <UsersProviderWrapper>
                <UserCell userId={score.jury}/>
              </UsersProviderWrapper>
            </div>
            <div className="font-semibold flex-1">{score.value}</div>
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
    return <div className="bg-hover h-5 w-20 animate-pulse rounded" />
  }

  if (!data) return <span>not found</span>

  return data.id < 0 ? (
    <p className="text-accent-warning font-bold">Неявка на бой</p>
  ) : (
    <div className="items-center justify-center text-center text-wrap">
      {data.secondName}{" "}
      {data.auth === null
        ? `${data.firstName}.${data.thirdName && data.thirdName + "."}`
        : `${data.firstName} ${data.thirdName}`}
    </div>
  )
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  )
}
