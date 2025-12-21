import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"

import TeamInTournamentPage from "@/components/tournaments/TeamInTournamentPage"

export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params
  const store = makeTournamentsStoreServer()
  const { data: teamData } = await store.dispatch(
    tournamentsApiServer.endpoints.getTeamInTournament.initiate({ teamId: Number(teamId) }),
  )
  if (!teamData) return <p>error</p>
  return (
    //<p>{JSON.stringify(teamData)}</p>
    <TeamInTournamentPage mainData={teamData} />
  )
}
