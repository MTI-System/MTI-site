import FightList from "@/components/tournaments/FightList";

import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"

export default async function AllFightPage({ params }: { params: Promise<{ fightsId: string }> }) {
  const { fightsId } = await params
  const store = makeTournamentsStoreServer()
  const { data: fightsData, error, isLoading} = await store.dispatch(
    tournamentsApiServer.endpoints.getFightContainerInfo.initiate({ fightContainerId: Number(fightsId) }),
  )

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-red-600 text-xl font-bold">Error</h1>
        <p className="mt-2">{JSON.stringify(error)}</p>
      </div>
    )
  }

  if (!fightsData) {
    return (
      <div className="p-4">
        <h1 className="text-yellow-600 text-xl font-bold">No fight data found</h1>
        <p className="mt-2">The requested fight information could not be loaded.</p>
      </div>
    )
  }
    return <FightList fightsData={fightsData}/>
}
