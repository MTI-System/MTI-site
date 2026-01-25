"use client"

import {
  useGetActionInformationQuery,
  useGetTournamentTableQuery,
  useSetDraftResultMutation,
  useSetJuryToFightMutation,
  useSetPlayerToPerformanceMutation,
  useSetScoresMutation,
} from "@/api/tournaments/clientApiInterface"
import { useGetProblemsByIdQuery, useGetProblemsQuery } from "@/api/problems/clientApiInterface"
import Loading from "@/app/loading"
import { Accordion, Select } from "@base-ui-components/react"
import FightsAdmin from "@/components/tournamentPage/adminPanel/FightsAdmin"
import { FightInformationInterface } from "@/types/TournamentsAPI"
import { useGetUserByIdQuery } from "@/api/users/clientApiInterface"
import UsersProviderWrapper from "@/api/users/ClientWrapper"
import { ComponentProps, useState } from "react"
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"

export default function ActionAdmin({
  actionId,
  idx,
  fight,
}: {
  actionId: number
  idx: number
  fight: FightInformationInterface
}) {
  const { data: actionInfo, isLoading: isActionLoading } = useGetActionInformationQuery({ actionId: actionId })
  const { data: pickedProblemInfo, isLoading: isProblemLoading } = useGetProblemsByIdQuery({
    problemId: actionInfo?.pickedProblem ?? 0,
  })
  const [setDraftResult] = useSetDraftResultMutation()

  const [setScores] = useSetScoresMutation()
  const [setPlayer] = useSetPlayerToPerformanceMutation()
  const { data } = useGetProblemsQuery({ tournament: "1", year: 2026 })
  const problems =
    data?.map((problem) => {
      return {
        value: problem.id.toString(),
        label: `${problem.global_number}. ${problem.problem_translations[0].problem_name}`,
      }
    }) ?? []
  const token = useAppSelector((state) => state.auth.token)

  const isLoading = isProblemLoading || isProblemLoading
  return (
    <div className="border-border mx-2 my-2 border px-2">
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <div className="text-text-main">
            <h2 className="text-text-main text-xl font-bold">Действие {idx + 1}</h2>
            {/*<div>*/}
            {/*  <form*/}
            {/*    onSubmit={(e) => {*/}
            {/*      e.preventDefault()*/}
            {/*      const form = new FormData(e.currentTarget)*/}
            {/*      form.set("token", token)*/}
            {/*      form.set("actionId", actionId.toString())*/}
            {/*      const data = Object.fromEntries(form.entries())*/}
            {/*      //@ts-ignore*/}
            {/*      setDraftResult(data)*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <ProblemsProviderWrapper>*/}
            {/*      {data ? (*/}
            {/*        <>*/}
            {/*          <ProblemPicker name="problemId" defaultValue={pickedProblemInfo?.id.toString()} teams={problems} />*/}
            {/*        </>*/}

            {/*      ) : (*/}
            {/*        <Loading />*/}
            {/*      )}*/}
            {/*    </ProblemsProviderWrapper>*/}

            {/*    <button className="mx-2 my-2 cursor-pointer bg-black/20" type="submit">*/}
            {/*      Сохранить задачу*/}
            {/*    </button>*/}


            {/*  </form>*/}
            {/*</div>*/}
            <Drafts/>
            <div></div>
            <div>
              <Accordion.Root className="text-text-main flex w-full flex-col justify-center">
                {actionInfo?.playerLines.map((playerLine, idx) => (
                  <Accordion.Item className="border-border border" key={playerLine.playerId + "player" + idx}>
                    <Accordion.Header>
                      <Accordion.Trigger className="group bg-bg-alt hover:bg-hover relative flex w-full items-baseline justify-between gap-4 py-2 pr-1 pl-3 text-left font-medium focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
                        <p>
                          Выступление - {playerLine.team.name} - {playerLine?.role?.title ?? "Роль не определена"}
                        </p>
                        <PlusIcon className="text-text-main mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel className="text-text-main h-[var(--accordion-panel-height)] overflow-hidden text-base transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
                      <div>
                        <CoeffPicker value={playerLine.coefficient}/>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            const fd = new FormData(e.currentTarget)
                            const playerId = Number(fd.get("player_id"))
                            console.log(playerId)
                            setPlayer({
                              token: token,
                              performanceId: playerLine.performanceId,
                              playerId: playerId,
                            })
                          }}
                        >
                          <input
                            defaultValue={Number(playerLine.playerId)}
                            name="player_id"
                            placeholder={"id участника"}
                            type="number"
                          />
                          <button className="mx-2 my-2 cursor-pointer bg-black/20" type="submit">
                            Сохранить участника
                          </button>
                        </form>
                        <form
                          className="flex w-full flex-col items-center"
                          onSubmit={(e) => {
                            e.preventDefault()
                            const fd = new FormData(e.currentTarget)
                            console.log(fd.entries().toArray())
                            setScores({
                              token: token,
                              performanceId: playerLine.performanceId,
                              scores: fd
                                .entries()
                                .toArray()
                                .map((e) => {
                                  return {
                                    jury: Number(e[0].split("_")[1]),
                                    score: Number(e[1]),
                                  }
                                }),
                            })
                          }}
                        >
                          <table className="border-border w-full border">
                            <thead className="w-full">
                              <tr className="flex w-full justify-between">
                                <th className="border-border w-full border" scope="col">
                                  Жюри
                                </th>
                                <th className="border-border w-full border" scope="col">
                                  Оценка
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <UsersProviderWrapper>
                                {fight.jouries.map((jury) => (
                                  <JuryRow
                                    juryId={jury}
                                    key={jury}
                                    defaultScore={playerLine.scores.find((score) => score.jury === jury)?.value}
                                  />
                                ))}
                              </UsersProviderWrapper>
                            </tbody>
                          </table>
                          <button className="mx-2 my-2 cursor-pointer bg-black/20" type="submit">
                            Сохранить оценки
                          </button>
                        </form>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function JuryRow({ juryId, defaultScore = 0 }: { juryId: number; defaultScore?: number }) {
  const { data: jury, isLoading } = useGetUserByIdQuery({ id: juryId })
  return (
    <>
      {isLoading && (
        <tr>
          <th>
            <Loading />
          </th>
        </tr>
      )}
      {jury && (
        <tr className="flex w-full justify-between">
          <th className="border-border w-full border" scope="col">
            {jury.secondName} {jury.firstName} {jury.thirdName}
          </th>
          <th className="border-border w-full border" scope="col">
            <input className="w-full" type="number" name={`juryScore_${juryId}`} defaultValue={defaultScore} />
          </th>
        </tr>
      )}
    </>
  )
}

function ProblemPicker({
  name,
  defaultValue,
  teams,
}: {
  name: string
  defaultValue?: string
  teams: {
    label: string
    value: string
  }[]
}) {
  const [pickedTeam, setPickedTeam] = useState<string | undefined>(defaultValue)

  return (
    <>
        <div className="flex gap-2">
          <p>Выбрана задача: </p>
          <Select.Root
            items={teams}
            onValueChange={(selected) => {
              console.log(selected)
              setPickedTeam(selected ?? "")
            }}
            value={pickedTeam ?? ""}
          >
            <input name={name} value={pickedTeam ?? ""} onChange={() => {}} className="hidden" />
            <Select.Trigger className="flex h-10 min-w-36 items-center justify-between gap-3 rounded-md border border-gray-200 bg-[canvas] pr-3 pl-3.5 text-base text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-[popup-open]:bg-gray-100">
              <Select.Value />
              <Select.Icon className="flex">
                <ChevronUpDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner className="z-10 outline-none select-none" sideOffset={8}>
                <Select.Popup className="group min-w-[var(--anchor-width)] origin-[var(--transform-origin)] rounded-md bg-[canvas] bg-clip-padding text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none dark:shadow-none dark:outline-gray-300">
                  <Select.ScrollUpArrow className="top-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:top-[-100%]" />
                  <Select.List className="relative max-h-[var(--available-height)] scroll-py-6 overflow-y-auto py-1">
                    {teams.map(({ label, value }) => (
                      <Select.Item
                        key={label}
                        value={value}
                        className="grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"
                      >
                        <Select.ItemIndicator className="col-start-1">
                          <CheckIcon className="size-3" />
                        </Select.ItemIndicator>
                        <Select.ItemText className="col-start-2">{label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.List>
                  <Select.ScrollDownArrow className="bottom-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:bottom-[-100%]" />
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </div>

    </>


  )
}

function CoeffPicker({
  value
                     }:{value: number}){
  return (
    <>
      <p>Коэффициент:</p>
      <form>
        <input className="border border-border" type={"number"} defaultValue={value}/>
        <button className="mx-2 my-2 cursor-pointer bg-black/20" type="submit">
          Сохранить коэффициент
        </button>
      </form>
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

function ChevronUpDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentcolor" strokeWidth="1.5" {...props}>
      <path d="M0.5 4.5L4 1.5L7.5 4.5" />
      <path d="M0.5 7.5L4 10.5L7.5 7.5" />
    </svg>
  )
}


function Drafts(){
  const [drafts, setDraft] = useState<number[]>([])

  return (
    <>
      {drafts.map(it=><>
        <DraftItem/>
      </>)}
      <button className="mx-2 my-2 cursor-pointer bg-black/20" onClick={()=>{
        setDraft(prev => [...prev, 1])
      }}>
        Добавить выбор
      </button>
      <button className="mx-2 my-2 cursor-pointer bg-black/20" type="submit">
        Сохранить процедуру выбора
      </button>

    </>
  )
}


function DraftItem(){
  const teams = ["Задача 1"]
  return (
    <>
      <Select.Root
        items={[]}
        onValueChange={(selected) => {
          console.log(selected)
        }}
        value={ ""}
      >
        <input name={"aaaa"} value={ ""} onChange={() => {}} className="hidden" />
        <Select.Trigger className="flex h-10 min-w-36 items-center justify-between gap-3 rounded-md border border-gray-200 bg-[canvas] pr-3 pl-3.5 text-base text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-[popup-open]:bg-gray-100">
          <Select.Value />
          <Select.Icon className="flex">
            <ChevronUpDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className="z-10 outline-none select-none" sideOffset={8}>
            <Select.Popup className="group min-w-[var(--anchor-width)] origin-[var(--transform-origin)] rounded-md bg-[canvas] bg-clip-padding text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none dark:shadow-none dark:outline-gray-300">
              <Select.ScrollUpArrow className="top-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:top-[-100%]" />
              <Select.List className="relative max-h-[var(--available-height)] scroll-py-6 overflow-y-auto py-1">
                {/*{teams.map(({ label, value }) => (*/}
                {/*  <Select.Item*/}
                {/*    key={label}*/}
                {/*    value={value}*/}
                {/*    className="grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"*/}
                {/*  >*/}
                {/*    <Select.ItemIndicator className="col-start-1">*/}
                {/*      <CheckIcon className="size-3" />*/}
                {/*    </Select.ItemIndicator>*/}
                {/*    <Select.ItemText className="col-start-2">{label}</Select.ItemText>*/}
                {/*  </Select.Item>*/}
                {/*))}*/}
              </Select.List>
              <Select.ScrollDownArrow className="bottom-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:bottom-[-100%]" />
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </>
  )
}


function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  )
}
