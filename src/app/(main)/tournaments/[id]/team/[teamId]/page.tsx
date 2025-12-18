import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"

export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params
  const store = makeTournamentsStoreServer()
  const { data: teamData } = await store.dispatch(
    tournamentsApiServer.endpoints.getTeamInTournament.initiate({ teamId: Number(teamId) }),
  )
  return (
    <>
      {JSON.stringify(teamData)}
    </>
  )
}