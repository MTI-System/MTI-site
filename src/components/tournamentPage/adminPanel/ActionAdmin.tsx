"use client"

import {
  useGetActionInformationQuery,
  useGetTournamentTableQuery,
  useSetDraftResultMutation,
  useSetDraftsResultsMutation,
  useSetJuryToFightMutation,
  useSetPlayerCoeffMutation,
  useSetPlayerPunishmentMutation,
  useSetPlayerToPerformanceMutation,
  useSetScoresMutation,
} from "@/api/tournaments/clientApiInterface"
import {
  useGetProblemsByIdQuery,
  useGetProblemsForTournamentQuery,
  useGetProblemsQuery,
} from "@/api/problems/clientApiInterface"
import Loading from "@/app/loading"
import { Accordion, Select } from "@base-ui-components/react"
import FightsAdmin from "@/components/tournamentPage/adminPanel/FightsAdmin"
import {
  CallActionInterface,
  DraftActionInterface,
  FightInformationInterface,
  TournamentCardInterface,
} from "@/types/TournamentsAPI"
import { useGetUserByIdQuery } from "@/api/users/clientApiInterface"
import { ComponentProps, useEffect, useRef, useState } from "react"
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useParams } from "next/navigation"
import PersonPicker from "@/components/pickers/PersonPicker"
import { AdminButton, adminButtonClass, useAdminFeedback } from "@/components/tournamentPage/adminPanel/adminUi"
const adminInputClass =
  "bg-bg-alt text-text-main border-border h-10 w-full max-w-xs rounded-md border px-3 text-base focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-accent-primary"
const selectTriggerClass =
  "border-border bg-bg-alt text-text-main hover:bg-hover flex h-10 w-full max-w-2xl min-w-36 items-center justify-between gap-3 rounded-md border pr-3 pl-3.5 text-base select-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-accent-primary data-[popup-open]:bg-hover"
const selectPopupClass =
  "group border-border bg-bg-alt text-text-main min-w-[var(--anchor-width)] origin-[var(--transform-origin)] rounded-md border bg-clip-padding shadow-lg outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none dark:shadow-none"
const selectItemClass =
  "grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-text-main data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-hover pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"

export default function ActionAdmin({
  actionId,
  idx,
  fight,
  juryIds,
  tournamentInfo,
}: {
  actionId: number
  idx: number
  fight: FightInformationInterface
  juryIds?: number[]
  tournamentInfo: TournamentCardInterface
}) {
  const { data: actionInfo, isLoading: isActionLoading, refetch: refetchAction } = useGetActionInformationQuery({
    actionId: actionId,
  })
  const { data: pickedProblemInfo, isLoading: isProblemLoading } = useGetProblemsByIdQuery({
    problemId: actionInfo?.pickedProblem ?? 0,
  })
  const isYNT = tournamentInfo.tournament_type === 2
  const { run } = useAdminFeedback()
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [openPerformances, setOpenPerformances] = useState<Array<number | string>>([])
  const [scoreDrafts, setScoreDrafts] = useState<Record<number, Record<number, number>>>({})

  const [setScores] = useSetScoresMutation()
  const [setPlayer] = useSetPlayerToPerformanceMutation()
  const [setCoeff] = useSetPlayerCoeffMutation()
  const [setPunishment] = useSetPlayerPunishmentMutation()
  const [pun, setPun] = useState<{ nt: number; nr: number; np: number; ny: number }[]>(
    actionInfo?.playerLines.map((playerLine) => ({
      nt: playerLine.nt ?? 0,
      nr: playerLine.nr ?? 0,
      np: playerLine.np ?? 0,
      ny: playerLine.ny ?? 0,
    })) ?? [],
  )
  useEffect(() => {
    setPun(
      actionInfo?.playerLines.map((playerLine) => ({
        nt: playerLine.nt ?? 0,
        nr: playerLine.nr ?? 0,
        np: playerLine.np ?? 0,
        ny: playerLine.ny ?? 0,
      })) ?? [],
    )
  }, [actionInfo?.playerLines])

  const token = useAppSelector((state) => state.auth.token)
  const resolvedJuryIds = juryIds ?? fight.jouries
  const juryKey = resolvedJuryIds.join(",")
  const scoreDraftsRef = useRef(scoreDrafts)
  scoreDraftsRef.current = scoreDrafts
  const previousJuryIdsRef = useRef<number[] | null>(null)
  useEffect(() => {
    if (!actionInfo) return
    const nextJuryIds = juryKey
      .split(",")
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0)
    setScoreDrafts((prev) => {
      const next: Record<number, Record<number, number>> = {}
      for (const line of actionInfo.playerLines) {
        const prevRow = prev[line.performanceId] ?? {}
        const row: Record<number, number> = {}
        for (const juryId of nextJuryIds) {
          row[juryId] =
            prevRow[juryId] ?? scoreForJury(line.scores, juryId) ?? 0
        }
        next[line.performanceId] = row
      }
      return next
    })
  }, [actionInfo, juryKey])

  useEffect(() => {
    if (!actionInfo) return
    const nextJuryIds = juryKey
      .split(",")
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0)
    if (previousJuryIdsRef.current === null) {
      previousJuryIdsRef.current = nextJuryIds
      return
    }
    const previousJuryIds = previousJuryIdsRef.current
    previousJuryIdsRef.current = nextJuryIds
    const removedJuryIds = previousJuryIds.filter((id) => !nextJuryIds.includes(id))
    if (removedJuryIds.length === 0) return
    let cancelled = false
    const persist = async () => {
      try {
        await Promise.all(
          actionInfo.playerLines.map((line) =>
            setScores({
              token,
              performanceId: line.performanceId,
              scores: nextJuryIds.map((jury) => ({
                jury,
                score: Math.max(
                  0,
                  scoreDraftsRef.current[line.performanceId]?.[jury] ??
                    scoreForJury(line.scores, jury) ??
                    0,
                ),
              })),
            }).unwrap(),
          ),
        )
        if (!cancelled) await refetchAction()
      } catch (error) {
        console.error("Failed to persist scores after jury change", error)
      }
    }
    void persist()
    return () => {
      cancelled = true
    }
  }, [actionInfo, juryKey, token, setScores, refetchAction])

  const isLoading = isProblemLoading || isProblemLoading
  return (
    <div className="border-border bg-bg-alt rounded-2xl border p-3">
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

            {/*    <button className={adminButtonClass} type="submit">*/}
            {/*      Сохранить задачу*/}
            {/*    </button>*/}

            {/*  </form>*/}
            {/*</div>*/}
            <Drafts
              defaultValue={actionInfo?.drafts?.calls ?? []}
              actionId={actionId}
              onSaved={refetchAction}
            />
            <div>
              <Accordion.Root
                className="text-text-main flex w-full flex-col gap-2"
                value={openPerformances}
                onValueChange={(next) => setOpenPerformances((next ?? []).filter((item) => item != null))}
              >
                {actionInfo?.playerLines.map((playerLine, idx) => (
                  <Accordion.Item
                    className="border-border overflow-hidden rounded-2xl border"
                    key={playerLine.performanceId}
                    value={playerLine.performanceId}
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className="group bg-bg-accent text-text-main hover:bg-hover relative flex w-full cursor-pointer items-baseline justify-between gap-4 py-3 pr-3 pl-4 text-left font-medium focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary">
                        <p>
                          Выступление - {playerLine.team.name} - {playerLine?.role?.title ?? "Роль не определена"}
                        </p>
                        <PlusIcon className="text-text-main mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel className="text-text-main h-[var(--accordion-panel-height)] overflow-hidden border-t border-border text-base transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0 data-[open]:h-auto">
                      <div className="flex flex-col gap-3 p-3">
                        <form
                          className="flex flex-col items-start gap-2"
                          onSubmit={async (e) => {
                            e.preventDefault()
                            const fd = new FormData(e.currentTarget)
                            const coeff = Number(fd.get("c"))
                            const key = `coeff-${playerLine.performanceId}`
                            setSavingKey(key)
                            const ok = await run(
                              setCoeff({
                                performanceId: playerLine.performanceId,
                                coeff: coeff,
                                token: token,
                              }).unwrap(),
                              { success: "Коэффициент сохранён" },
                            )
                            if (ok) await refetchAction()
                            setSavingKey(null)
                          }}
                        >
                          <CoeffPicker
                            value={playerLine.coefficient ?? 3}
                            name={isYNT ? "Количество карточек" : "Коэффициент"}
                            isShown
                            setter={(value) => {}}
                          />
                          <AdminButton type="submit" loading={savingKey === `coeff-${playerLine.performanceId}`}>
                            Сохранить коэффициент
                          </AdminButton>
                        </form>
                        {isYNT && (
                          <>
                            <CoeffPicker
                              value={playerLine.nr ?? 0}
                              name="Нарушение в количестве отказов (nr)"
                              isShown
                              setter={(value) => {
                                setPun((prev) => ({ ...prev, [idx]: { ...prev[idx], nr: value } }))
                              }}
                            />
                            <CoeffPicker
                              value={playerLine.np ?? 0}
                              name="Нарушение в количестве выступлений на одном бое (np)"
                              isShown
                              setter={(value) => {
                                setPun((prev) => ({ ...prev, [idx]: { ...prev[idx], np: value } }))
                              }}
                            />
                            <CoeffPicker
                              value={playerLine.nt ?? 0}
                              name="Нарушение в количестве выступлений на всех боях (nt)"
                              isShown
                              setter={(value) => {
                                setPun((prev) => ({ ...prev, [idx]: { ...prev[idx], nt: value } }))
                              }}
                            />
                            <CoeffPicker
                              value={playerLine.ny ?? 0}
                              name="Нарушение в представлении оригинальных задач (ny)"
                              isShown
                              setter={(value) => {
                                setPun((prev) => ({ ...prev, [idx]: { ...prev[idx], ny: value } }))
                              }}
                            />
                            <AdminButton
                              type="button"
                              loading={savingKey === `punish-${playerLine.performanceId}`}
                              onClick={async () => {
                                const key = `punish-${playerLine.performanceId}`
                                setSavingKey(key)
                                const ok = await run(
                                  setPunishment({
                                    token: token,
                                    performanceId: playerLine.performanceId,
                                    nt: pun[idx].nt,
                                    nr: pun[idx].nr,
                                    np: pun[idx].np,
                                    ny: pun[idx].ny,
                                  }).unwrap(),
                                  { success: "Штрафы сохранены" },
                                )
                                if (ok) await refetchAction()
                                setSavingKey(null)
                              }}
                            >
                              Сохранить штрафы
                            </AdminButton>
                          </>
                        )}
                        <form
                          className="flex flex-col items-start gap-2"
                          onSubmit={async (e) => {
                            e.preventDefault()
                            const fd = new FormData(e.currentTarget)
                            const playerId = Number(fd.get("player_id"))
                            const key = `player-${playerLine.performanceId}`
                            setSavingKey(key)
                            const ok = await run(
                              setPlayer({
                                token: token,
                                performanceId: playerLine.performanceId,
                                playerId: playerId,
                              }).unwrap(),
                              { success: "Участник сохранён" },
                            )
                            if (ok) await refetchAction()
                            setSavingKey(null)
                          }}
                        >
                          <PersonPicker
                            label="Участник"
                            placeholder="Найдите участника"
                            name="player_id"
                            defaultUserId={playerLine.playerId}
                          />
                          <AdminButton type="submit" loading={savingKey === `player-${playerLine.performanceId}`}>
                            Сохранить участника
                          </AdminButton>
                        </form>
                        <form
                          className="flex w-full flex-col items-start gap-2"
                          onSubmit={async (e) => {
                            e.preventDefault()
                            const fd = new FormData(e.currentTarget)
                            const key = `scores-${playerLine.performanceId}`
                            setSavingKey(key)
                            const ok = await run(
                              setScores({
                                token: token,
                                performanceId: playerLine.performanceId,
                                scores: fd
                                  .entries()
                                  .toArray()
                                  .filter(([name]) => String(name).startsWith("juryScore_"))
                                  .map((entry) => {
                                    const score = Number(entry[1])
                                    return {
                                      jury: Number(entry[0].split("_")[1]),
                                      score: Number.isFinite(score) ? Math.max(0, score) : 0,
                                    }
                                  }),
                              }).unwrap(),
                              { success: "Оценки сохранены" },
                            )
                            if (ok) await refetchAction()
                            setSavingKey(null)
                          }}
                        >
                          <table className="border-border w-full table-fixed border-collapse overflow-hidden rounded-xl border">
                            <thead>
                              <tr>
                                <th className="border-border w-1/2 border px-3 py-2 text-left text-sm font-medium" scope="col">
                                  Жюри
                                </th>
                                <th className="border-border w-1/2 border px-3 py-2 text-left text-sm font-medium" scope="col">
                                  Оценка
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {resolvedJuryIds.map((jury) => (
                                <JuryRow
                                  juryId={jury}
                                  key={jury}
                                  score={
                                    scoreDrafts[playerLine.performanceId]?.[jury] ??
                                    scoreForJury(playerLine.scores, jury) ??
                                    0
                                  }
                                  onScoreChange={(value) => {
                                    setScoreDrafts((prev) => ({
                                      ...prev,
                                      [playerLine.performanceId]: {
                                        ...(prev[playerLine.performanceId] ?? {}),
                                        [jury]: value,
                                      },
                                    }))
                                  }}
                                />
                              ))}
                            </tbody>
                          </table>
                          <AdminButton type="submit" loading={savingKey === `scores-${playerLine.performanceId}`}>
                            Сохранить оценки
                          </AdminButton>
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

function scoreForJury(scores: { jury: number; value: number }[], juryId: number) {
  return scores.find((score) => Number(score.jury) === Number(juryId))?.value
}

function JuryRow({
  juryId,
  score,
  onScoreChange,
}: {
  juryId: number
  score: number
  onScoreChange: (score: number) => void
}) {
  const { data: jury, isLoading } = useGetUserByIdQuery({ id: juryId })
  return (
    <tr>
      <td className="border-border text-text-main w-1/2 border px-3 py-2 text-left text-sm">
        {isLoading
          ? "Загрузка..."
          : jury
            ? `${jury.secondName} ${jury.firstName} ${jury.thirdName}`
            : `ID ${juryId}`}
      </td>
      <td className="border-border w-1/2 border">
        <input
          className="bg-bg-alt text-text-main h-10 w-full border-0 px-3 text-base focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-accent-primary"
          type="number"
          name={`juryScore_${juryId}`}
          min={0}
          step="any"
          inputMode="decimal"
          value={Number.isFinite(score) ? score : 0}
          onChange={(e) => {
            const next = e.target.value === "" ? 0 : Number(e.target.value)
            onScoreChange(Number.isFinite(next) ? Math.max(0, next) : 0)
          }}
        />
      </td>
    </tr>
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
        <p className="text-text-main">Выбрана задача: </p>
        <Select.Root
          items={teams}
          onValueChange={(selected) => {
            console.log(selected)
            setPickedTeam(selected ?? "")
          }}
          value={pickedTeam ?? ""}
        >
          <input name={name} value={pickedTeam ?? ""} onChange={() => {}} className="hidden" />
          <Select.Trigger className={selectTriggerClass}>
            <Select.Value />
            <Select.Icon className="flex">
              <ChevronUpDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner className="z-10 outline-none select-none" sideOffset={8}>
              <Select.Popup className={selectPopupClass}>
                <Select.ScrollUpArrow className="top-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-bg-alt text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:top-[-100%]" />
                <Select.List className="relative max-h-[var(--available-height)] scroll-py-6 overflow-y-auto py-1">
                  {teams.map(({ label, value }) => (
                    <Select.Item
                      key={label}
                      value={value}
                      className={selectItemClass}
                    >
                      <Select.ItemIndicator className="col-start-1">
                        <CheckIcon className="size-3" />
                      </Select.ItemIndicator>
                      <Select.ItemText className="col-start-2">{label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.List>
                <Select.ScrollDownArrow className="bottom-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-bg-alt text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:bottom-[-100%]" />
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
    </>
  )
}

function CoeffPicker({
  value,
  name,
  isShown,
  setter,
}: {
  value: number
  name: string
  isShown: boolean
  setter: (value: number) => void
}) {
  return (
    <>
      {isShown && (
        <>
          <p className="text-text-main text-sm font-medium">{name}:</p>
          <input
            name={"c"}
            className={adminInputClass}
            type={"number"}
            defaultValue={value}
            step="any"
            onChange={(e) => {
              setter(Number(e.target.value))
            }}
          />
        </>
      )}
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

function callsFromDraftForm(form: HTMLFormElement, skipName?: string) {
  return [...new FormData(form).entries()]
    .filter(([name]) => name.startsWith("draft-") && name !== skipName)
    .map((entry, idx, arr) => ({
      problemId: Number(entry[1]),
      result: idx === arr.length - 1,
    }))
    .filter((call) => Number.isFinite(call.problemId) && call.problemId > 0)
}

function Drafts({
  defaultValue,
  actionId,
  onSaved,
}: {
  defaultValue: CallActionInterface[]
  actionId: number
  onSaved?: () => Promise<unknown> | unknown
}) {
  const [drafts, setDraft] = useState<{ key: string; problemId: string }[]>(() =>
    defaultValue.map((it) => ({
      key: `call-${it.id}`,
      problemId: it.problemId.toString(),
    })),
  )
  const params = useParams()
  const { data } = useGetProblemsForTournamentQuery({ tournamentId: Number(params.id ?? 10) })

  const problems =
    data?.map((problem) => {
      return {
        value: problem.id.toString(),
        label: `${problem.global_number}. ${problem.problem_translations[0].problem_name}`,
      }
    }) ?? []
  const token = useAppSelector((state) => state.auth.token)

  const [setDraftMutation, { isLoading: isSavingDrafts }] = useSetDraftsResultsMutation()
  const { run } = useAdminFeedback()
  const [removingKey, setRemovingKey] = useState<string | null>(null)

  const persistCalls = async (calls: { problemId: number; result: boolean }[], success: string) => {
    const ok = await run(
      setDraftMutation({
        token: token,
        actionId: actionId,
        calls: calls,
      }).unwrap(),
      { success },
    )
    if (ok) await onSaved?.()
    return ok
  }

  return (
    <>
      <form
        className="mb-4 flex flex-col items-start gap-2"
        onSubmit={async (e) => {
          e.preventDefault()
          await persistCalls(callsFromDraftForm(e.currentTarget), "Процедура выбора сохранена")
        }}
      >
        {drafts.map((item) => (
          <div key={item.key} className="flex flex-wrap items-end gap-2">
            <DraftItem name={`draft-${item.key}`} defaultValue={item.problemId} problems={problems} />
            <button
              type="button"
              className="border-border text-text-alt hover:bg-hover hover:text-text-main h-10 cursor-pointer rounded-md border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSavingDrafts || removingKey === item.key}
              onClick={async (e) => {
                const form = e.currentTarget.form
                if (!form) return
                setRemovingKey(item.key)
                const ok = await persistCalls(callsFromDraftForm(form, `draft-${item.key}`), "Выбор удалён")
                if (ok) {
                  setDraft((prev) => prev.filter((draft) => draft.key !== item.key))
                }
                setRemovingKey(null)
              }}
            >
              Удалить выбор
            </button>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <button
            className={adminButtonClass}
            type={"button"}
            onClick={(e) => {
              e.preventDefault()
              setDraft((prev) => [
                ...prev,
                {
                  key: `call-new-${Date.now()}`,
                  problemId: problems[0]?.value ?? "-1",
                },
              ])
            }}
          >
            Добавить выбор
          </button>
          <AdminButton type="submit" loading={isSavingDrafts && removingKey == null}>
            Сохранить процедуру выбора
          </AdminButton>
        </div>
      </form>
    </>
  )
}

function DraftItem({
  name,
  defaultValue,
  problems,
}: {
  name: string
  defaultValue: string
  problems: { label: string; value: string }[]
}) {
  const teams = [...problems]
  const [pickedTeam, setPickedTeam] = useState<string | undefined>(defaultValue)
  return (
    <>
      <Select.Root
        items={teams}
        onValueChange={(selected) => {
          setPickedTeam(selected ?? "-1")
        }}
        value={pickedTeam}
      >
        <input name={name} value={pickedTeam} onChange={() => {}} className="hidden" />
        <Select.Trigger className={selectTriggerClass}>
          <Select.Value />
          <Select.Icon className="flex">
            <ChevronUpDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className="z-10 outline-none select-none" sideOffset={8}>
            <Select.Popup className={selectPopupClass}>
              <Select.ScrollUpArrow className="top-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-bg-alt text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:top-[-100%]" />
              <Select.List className="relative max-h-[var(--available-height)] scroll-py-6 overflow-y-auto py-1">
                {teams.map(({ label, value }) => (
                  <Select.Item
                    key={label}
                    value={value}
                    className={selectItemClass}
                  >
                    <Select.ItemIndicator className="col-start-1">
                      <CheckIcon className="size-3" />
                    </Select.ItemIndicator>
                    <Select.ItemText className="col-start-2">{label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
              <Select.ScrollDownArrow className="bottom-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-bg-alt text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:bottom-[-100%]" />
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
