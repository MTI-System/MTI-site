import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import TeamLogsList from "@/components/tournamentPage/teamLogs/TeamList"
import { TeamLogsInterface } from "@/types/TournamentsAPI"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id: tournamentId } = await params
  const store = makeTournamentsStoreServer()
  const { data, error } = await store.dispatch(
    tournamentsApiServer.endpoints.getTournamentCard.initiate({ id: Number(tournamentId) }),
  )
  if (error)
    return {
      title: "Ошибка загрузки турнира – МТИ",
      description: "Не удалось загрузить запрошенный турнир.",
    }
  if (!data)
    return {
      title: "Турнир не найден – МТИ",
      description: "Запрошенный турнир не найден в системе МТИ.",
    }
  return {
    title: `Путевые листы | ${data.title} – МТИ`,
    description: `Путевые листы турнира '${data.title}'`,
  }
}

export default async function teamLogsPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const store = makeTournamentsStoreServer()
  const { data, error } = await store.dispatch(tournamentsApiServer.endpoints.getTeamLogs.initiate({ id: Number(id) }))
  const tournamentStore = makeTournamentsStoreServer()
  const { data: tournamentData, error: tournamentError } = await tournamentStore.dispatch(
    tournamentsApiServer.endpoints.getTournamentCard.initiate({ id: Number(id) }),
  )
  if (!data || !tournamentData) return (
    <>
      <p className="text-accent-warning text-xl">Произошла ошибка {JSON.stringify(error)}</p>
    </>
  )
  const promise = store.dispatch(tournamentsApiServer.endpoints.getTournamentTable.initiate({ id: Number(id) }))
  const { data: table, error: tableError } = await promise
  console.log("tournament fetch", table, error)

  const maxFilledFightsIndex =
    table?.table_lines.map((x, i) => [x.scores.length, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1] ?? 0
  const fights =
    table?.table_lines[maxFilledFightsIndex].scores.map((s) => ({
      name: s.fight_container_name,
      id: s.fight_container_id,
    })) ?? []


  return <TeamLogsList logs={data} fightsList={fights} isYNT={tournamentData.tournament_type === 2} />

}
