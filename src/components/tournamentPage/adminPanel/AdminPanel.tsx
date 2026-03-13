"use client"
import {
  useAddFightMutation,
  useGetFightInfoByTournamentQuery,
  useGetTournamentCardQuery,
  useGetTournamentTableQuery,
  useSetTeamOpeningScoreMutation,
} from "@/api/tournaments/clientApiInterface"
import Loading from "@/app/loading"
import FightsAdmin from "@/components/tournamentPage/adminPanel/FightsAdmin"
import { Accordion } from "@base-ui-components/react"
import FightContainerAdminPanel from "@/components/tournamentPage/adminPanel/FightContainerAdminPanel"
import { useRouter } from "next/navigation"
import { TournamentCardInterface } from "@/types/TournamentsAPI"
import { useAppSelector } from "@/redux_stores/Global/tournamentTypeRedixStore"

export default function AdminPanel({ tournamentId }: { tournamentId: number }) {
  const {
    data: informationAboutFights,
    isLoading,
    isError,
  } = useGetFightInfoByTournamentQuery({ tournamentId: tournamentId })
  const { data: tournamentInfo, refetch: refetchTournamentInfo } = useGetTournamentCardQuery({ id: tournamentId })
  const isYNT = tournamentInfo?.tournament_type === 2
  const router = useRouter()
  return (
    <>
      {isLoading && <Loading />}
      {isError && <p>Ошибка aaa{tournamentId}</p>}
      {informationAboutFights && (
        <>
          {/*<button className="bg-black/20 my-2 mx-2 cursor-pointer" onClick={()=>{*/}
          {/*  router.refresh()*/}
          {/*}}>Обновить</button>*/}

          <Accordion.Root className="flex w-full flex-col justify-center text-gray-900">
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
        </>
      )}
    </>
  )
}

function PerformanceSettingsTab({ tournamentId }: { tournamentId: number }) {
  const [setTeamOpeningScore, { isLoading: isTeamOpeningScoreLoading, isSuccess: isTeamOpeningScoreSuccess }] =
    useSetTeamOpeningScoreMutation()
  const token = useAppSelector((state) => state.auth.token)
  const { data: resultsTable } = useGetTournamentTableQuery({ id: tournamentId })
  return (
    <Accordion.Item className="border-border border" key={"performance-setter"}>
      <Accordion.Header>
        <Accordion.Trigger className="group bg-bg-alt hover:bg-hover relative flex w-full items-baseline justify-between gap-4 py-2 pr-1 pl-3 text-left font-medium focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800">
          <p className="text-text-main">Представление</p>
          <PlusIcon className="text-text-main mr-2 size-3 shrink-0 transition-all ease-out group-data-[panel-open]:scale-110 group-data-[panel-open]:rotate-45" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-gray-600 transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
        {resultsTable?.table_lines.map((team) => (
          <form
            className="flex flex-row gap-2"
            key={team.team_id}
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              const score = Number(fd.get("score"))
              setTeamOpeningScore({
                token: token,
                teamId: team.team_id,
                score: score,
              })
            }}
          >
            <p>{team.team_name}</p>
            <input
              className="border-border border"
              name="score"
              type="number"
              step="any"
              defaultValue={team.opening_score}
            />
            <button className="mx-2 my-2 cursor-pointer bg-black/20" type="submit">
              Сохранить
            </button>
          </form>
        ))}
        {isTeamOpeningScoreLoading && <p>Загрузка...</p>}
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
