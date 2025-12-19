import FightList from "@/components/tournaments/FightList";
import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper"

import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"

export default async function AllFightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const store = makeTournamentsStoreServer()
  const { data: fightsData, error, isLoading} = await store.dispatch(
    tournamentsApiServer.endpoints.getFightInfoByTournament.initiate({ tournamentId: Number(id) }),
  )

  if (fightsData){
    return (
      <>
        <FightList fightsData={fightsData}/>
      </>
    )
  }else{
    return(error)
  }
}
