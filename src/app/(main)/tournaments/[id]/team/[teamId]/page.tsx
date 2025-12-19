import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import {Page} from "@/app/(main)/tmp/page"


export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params
  const store = makeTournamentsStoreServer()
  const { data: teamData } = await store.dispatch(
    tournamentsApiServer.endpoints.getTeamInTournament.initiate({ teamId: Number(teamId) }),
  )
  if(!teamData) return <p>error</p>
  return (
    //<p>{JSON.stringify(teamData)}</p>
    <Page mainData={teamData} />
  )
}