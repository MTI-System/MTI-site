"use client"
import {
  useGetFightInfoByTournamentQuery,
  useGetTournamentCardQuery,
  useGetTournamentTableQuery,
  useSetTeamOpeningScoreMutation,
} from "@/api/tournaments/clientApiInterface"
import Loading from "@/app/loading"
import { Accordion } from "@base-ui-components/react"
import FightContainerAdminPanel from "@/components/tournamentPage/adminPanel/FightContainerAdminPanel"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"
import UsersProviderWrapper from "@/api/users/ClientWrapper"
import { AdminButton, AdminToastProvider, useAdminFeedback } from "@/components/tournamentPage/adminPanel/adminUi"
import { useState } from "react"

const adminInputClass =
  "bg-bg-alt text-text-main border-border h-10 w-32 rounded-md border px-3 text-base focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-accent-primary"
const accordionTriggerClass =
  "group bg-bg-accent text-text-main hover:bg-hover relative flex w-full cursor-pointer items-baseline justify-between gap-4 py-3 pr-3 pl-4 text-left text-lg font-medium focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary"

export default function AdminPanel({ tournamentId }: { tournamentId: number }) {
  const {
    data: informationAboutFights,
    isLoading,
    isError,
  } = useGetFightInfoByTournamentQuery({ tournamentId: tournamentId })
  const { data: tournamentInfo } = useGetTournamentCardQuery({ id: tournamentId })
  const isYNT = tournamentInfo?.tournament_type === 2
  return (
    <UsersProviderWrapper>
      <AdminToastProvider>
        {isLoading && <Loading />}
        {isError && <p className="px-2 py-4 text-red-500">Не удалось загрузить бои</p>}
        {informationAboutFights && (
          <Accordion.Root className="text-text-main flex w-full flex-col gap-3">
            {isYNT && <PerformanceSettingsTab tournamentId={tournamentId} />}
            {Object.entries(informationAboutFights ?? {}).map(([fightContainerId, fightsInfo]) => (
              <FightContainerAdminPanel
                key={fightContainerId}
                fightContainerId={Number(fightContainerId)}
                fightsInfo={fightsInfo}
                tournamentId={tournamentId}
              />
            ))}
          </Accordion.Root>
        )}
      </AdminToastProvider>
    </UsersProviderWrapper>
  )
}

function PerformanceSettingsTab({ tournamentId }: { tournamentId: number }) {
  const [setTeamOpeningScore] = useSetTeamOpeningScoreMutation()
  const token = useAppSelector((state) => state.auth.token)
  const { data: resultsTable, refetch } = useGetTournamentTableQuery({ id: tournamentId })
  const { run } = useAdminFeedback()
  const [savingTeamId, setSavingTeamId] = useState<number | null>(null)
  return (
    <Accordion.Item className="border-border bg-bg-alt overflow-hidden rounded-2xl border" key={"performance-setter"}>
      <Accordion.Header>
        <Accordion.Trigger className={accordionTriggerClass}>
          <p className="text-text-main">Представление</p>
          <PlusIcon className="text-text-main mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel className="border-border h-[var(--accordion-panel-height)] overflow-hidden border-t text-base transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
        {resultsTable?.table_lines.map((team) => (
          <form
            className="border-border flex flex-col gap-2 border-t px-4 py-3 first:border-t-0 sm:flex-row sm:items-center"
            key={team.team_id}
            onSubmit={async (e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              const score = Number(fd.get("score"))
              setSavingTeamId(team.team_id)
              const ok = await run(
                setTeamOpeningScore({
                  token: token,
                  teamId: team.team_id,
                  score: score,
                }).unwrap(),
                { success: "Оценка представления сохранена" },
              )
              if (ok) await refetch()
              setSavingTeamId(null)
            }}
          >
            <p className="text-text-main min-w-0 flex-1 font-medium">{team.team_name}</p>
            <input
              className={adminInputClass}
              name="score"
              type="number"
              step="any"
              defaultValue={team.opening_score}
            />
            <AdminButton type="submit" loading={savingTeamId === team.team_id}>
              Сохранить
            </AdminButton>
          </form>
        ))}
      </Accordion.Panel>
    </Accordion.Item>
  )
}

function PlusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 12 12" fill="currentcolor" {...props}>
      <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
    </svg>
  )
}
