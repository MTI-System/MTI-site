import { FightInformationInterface } from "@/types/TournamentsAPI"
import { Accordion, Select } from "@base-ui-components/react"
import ActionAdmin from "@/components/tournamentPage/adminPanel/ActionAdmin"
import ProblemsProviderWrapper from "@/api/problems/ClientWrapper"
import {
  useGetFightInfoByTournamentQuery,
  useGetTournamentCardQuery,
  useGetTournamentTableQuery,
  useSetJuryToFightMutation,
  useSetLinkAndTimestampToFightMutation,
  useSetTeamsToFightMutation,
} from "@/api/tournaments/clientApiInterface"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useState } from "react"
import PersonPicker from "@/components/pickers/PersonPicker"
import { AdminButton, adminButtonClass, useAdminFeedback } from "@/components/tournamentPage/adminPanel/adminUi"
const adminInputClass =
  "bg-bg-alt text-text-main border-border h-10 rounded-md border px-3 text-base focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-accent-primary"
const accordionTriggerClass =
  "group bg-bg-accent text-text-main hover:bg-hover relative flex w-full cursor-pointer items-baseline justify-between gap-4 py-3 pr-3 pl-4 text-left font-medium focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary"
const selectTriggerClass =
  "border-border bg-bg-alt text-text-main hover:bg-hover flex h-10 w-full min-w-36 items-center justify-between gap-3 rounded-md border pr-3 pl-3.5 text-base select-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-accent-primary data-[popup-open]:bg-hover"
const selectPopupClass =
  "group border-border bg-bg-alt text-text-main min-w-[var(--anchor-width)] origin-[var(--transform-origin)] rounded-md border bg-clip-padding shadow-lg outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none dark:shadow-none"
const selectItemClass =
  "grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-text-main data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-hover pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"

export function tsMsToHHMM(tsMs: number): string {
  const d = new Date(tsMs)
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}

export function hhmmToTsMs(hhmm: string, baseTsMs: number): number {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) throw new Error(`Bad time format: "${hhmm}"`)

  const hh = Number(m[1])
  const mm = Number(m[2])

  const d = new Date(baseTsMs)
  d.setHours(hh, mm, 0, 0)
  return d.getTime()
}

const teamSlots = [
  { name: "team1", title: "Команда 1", hint: "первый доклад", index: 0 },
  { name: "team2", title: "Команда 2", hint: "первое оппонирование", index: 1 },
  { name: "team3", title: "Команда 3", hint: "первое рецензирование", index: 2 },
  { name: "team4", title: "Команда 4", hint: "первое наблюдение", index: 3 },
] as const

export default function FightsAdmin({
  fight,
  idx,
  tournamentId,
}: {
  fight: FightInformationInterface
  idx: number
  tournamentId: number
}) {
  const { data: fullTableObject } = useGetTournamentTableQuery({ id: tournamentId })
  const { data: tournamentInfo } = useGetTournamentCardQuery({ id: tournamentId })
  const { refetch: refetchFights } = useGetFightInfoByTournamentQuery({ tournamentId })
  const token = useAppSelector((state) => state.auth.token)
  const { run } = useAdminFeedback()
  const teams = fullTableObject?.table_lines.map((l) => {
    return {
      label: l.team_name,
      value: l.team_id.toString(),
    }
  })
  const [addTimestampAndLink, { isLoading: isSavingLink }] = useSetLinkAndTimestampToFightMutation()
  const [setTeamsToFight, { isLoading: isSavingTeams }] = useSetTeamsToFightMutation()
  const [setJuryToFight, { isLoading: isSavingJury }] = useSetJuryToFightMutation()
  const [jurySlots, setJurySlots] = useState<{ key: string; userId?: number }[]>(() =>
    fight.jouries.map((userId) => ({
      key: `jury-${fight.id}-${userId}-${Math.random().toString(36).slice(2, 8)}`,
      userId,
    })),
  )
  const [juryIds, setJuryIds] = useState<number[]>(() => [...fight.jouries])
  if (!tournamentInfo) return <p className="text-text-alt px-2 py-2">Загрузка...</p>
  return (
    <>
      <Accordion.Root className="text-text-main flex w-full flex-col justify-center">
        <Accordion.Item className="border-border bg-bg-main overflow-hidden rounded-2xl border">
          <Accordion.Header>
            <Accordion.Trigger className={accordionTriggerClass}>
              <p className="text-text-main">Комната {idx + 1}</p>
              <PlusIcon className="text-text-main mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden border-t border-border text-base transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0 data-[open]:h-auto">
            <div className="flex flex-col gap-6 p-4">
              <form
                className="flex flex-col gap-3"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const form = new FormData(e.currentTarget)
                  form.set("token", token)
                  //@ts-ignore
                  form.set("fightId", fight.id)
                  const data = Object.fromEntries(form.entries())
                  const hhmm = String(data.timestamp) // "09:33"
                  ;(data as any).timestamp = hhmmToTsMs(hhmm, fight.startTime) // ms
                  const ok = await run(
                    //@ts-ignore
                    addTimestampAndLink(data).unwrap(),
                    { success: "Комната сохранена" },
                  )
                  if (ok) await refetchFights()
                }}
              >
                <label className="text-text-main flex flex-col gap-1 text-sm font-medium">
                  Ссылка на комнату
                  <input className={`${adminInputClass} w-full`} type="text" name={"link"} defaultValue={fight.location} />
                </label>
                <label className="text-text-main flex w-fit flex-col gap-1 text-sm font-medium">
                  Время начала
                  <input
                    className={`${adminInputClass} w-40`}
                    type="time"
                    name={"timestamp"}
                    defaultValue={tsMsToHHMM(fight.startTime)}
                  />
                </label>
                <AdminButton type="submit" loading={isSavingLink}>
                  Сохранить изменения
                </AdminButton>
              </form>

              <div className="flex flex-col gap-3">
                <p className="text-text-main font-semibold">Команды в этой комнате</p>
                <form
                  className="flex flex-col gap-3"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const form = new FormData(e.currentTarget)
                    const newForm = new FormData()
                    const data = Object.fromEntries(form.entries())

                    const teamsArr = [data.team1, data.team2]
                    if (data.team3 !== "") {
                      teamsArr.push(data.team3)
                    }
                    if (data.team4 !== "") {
                      teamsArr.push(data.team4)
                    }

                    newForm.set("token", token)

                    newForm.set("fightId", fight.id.toString())
                    const finalData = Object.fromEntries(newForm.entries())
                    //@ts-ignore
                    finalData.teams = teamsArr
                    const ok = await run(
                      //@ts-ignore
                      setTeamsToFight(finalData).unwrap(),
                      { success: "Команды сохранены" },
                    )
                    if (ok) await refetchFights()
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {teamSlots.map((slot) => (
                      <label key={slot.name} className="text-text-main flex flex-col gap-1 text-sm font-medium">
                        {slot.title}
                        <span className="text-text-alt text-xs font-normal">{slot.hint}</span>
                        <TeamsPicker
                          name={slot.name}
                          defaultValue={fight.teams?.[slot.index]?.id?.toString()}
                          teams={teams ?? []}
                        />
                      </label>
                    ))}
                  </div>
                  <AdminButton type="submit" loading={isSavingTeams}>
                    Сохранить команды
                  </AdminButton>
                </form>
                <form
                  className="flex flex-col gap-3"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const form = new FormData(e.currentTarget)
                    const juries = form
                      .getAll("juries")
                      .map((juryId) => Number(juryId))
                      .filter((juryId) => Number.isFinite(juryId) && juryId > 0)
                    const ok = await run(
                      setJuryToFight({
                        juries,
                        fightId: fight.id,
                        token: token,
                      }).unwrap(),
                      { success: "Жюри сохранены" },
                    )
                    if (ok) {
                      setJuryIds(juries)
                      await refetchFights()
                    }
                  }}
                >
                  <div className="flex flex-col gap-3">
                    <p className="text-text-main font-semibold">Жюри</p>
                    {jurySlots.map((slot, slotIndex) => (
                      <div key={slot.key} className="flex flex-wrap items-end gap-2">
                        <PersonPicker
                          label={`Жюри ${slotIndex + 1}`}
                          placeholder="Найдите человека"
                          name="juries"
                          defaultUserId={slot.userId}
                        />
                        <button
                          type="button"
                          className="border-border text-text-alt hover:bg-hover hover:text-text-main h-10 cursor-pointer rounded-md border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                          disabled={isSavingJury}
                          onClick={async (e) => {
                            const form = e.currentTarget.form
                            if (!form) return
                            const remaining = new FormData(form)
                              .getAll("juries")
                              .map((juryId) => Number(juryId))
                              .filter((_, index) => index !== slotIndex)
                              .filter((juryId) => Number.isFinite(juryId) && juryId > 0)
                            const ok = await run(
                              setJuryToFight({
                                juries: remaining,
                                fightId: fight.id,
                                token: token,
                              }).unwrap(),
                              { success: "Жюри удалены" },
                            )
                            if (ok) {
                              setJurySlots((prev) => prev.filter((item) => item.key !== slot.key))
                              setJuryIds(remaining)
                              await refetchFights()
                            }
                          }}
                        >
                          Удалить
                        </button>
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={adminButtonClass}
                        onClick={() => {
                          setJurySlots((prev) => [...prev, { key: `jury-${fight.id}-new-${Date.now()}` }])
                        }}
                      >
                        Добавить жюри
                      </button>
                      <AdminButton type="submit" loading={isSavingJury}>
                        Сохранить жюри
                      </AdminButton>
                    </div>
                  </div>
                </form>
              </div>

              {fight.actions.map((action, index) => (
                <ProblemsProviderWrapper key={action}>
                  <ActionAdmin
                    actionId={action}
                    idx={index}
                    fight={fight}
                    juryIds={juryIds}
                    tournamentInfo={tournamentInfo}
                  />
                </ProblemsProviderWrapper>
              ))}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </>
  )
}

function TeamsPicker({
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
            <Select.ScrollUpArrow className="bg-bg-alt top-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:top-[-100%]" />
            <Select.List className="relative max-h-[var(--available-height)] scroll-py-6 overflow-y-auto py-1">
              {teams.map(({ label, value }) => (
                <Select.Item key={label} value={value} className={selectItemClass}>
                  <Select.ItemIndicator className="col-start-1">
                    <CheckIcon className="size-3" />
                  </Select.ItemIndicator>
                  <Select.ItemText className="col-start-2">{label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
            <Select.ScrollDownArrow className="bg-bg-alt bottom-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:bottom-[-100%]" />
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
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

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  )
}
