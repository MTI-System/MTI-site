import { ActionTabs } from "@/components/tournaments/FightAction";
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import { FightInformationInterface } from "@/types/TournamentsAPI";
import { FightTable } from "@/components/tournaments/FightTable";


export default async function FightPage({ params }: { params: Promise<{ fightId: string}> }) {
  const { fightId } = await params
  const store = makeTournamentsStoreServer()
  const { data: fightData, error, isLoading} = await store.dispatch(
    tournamentsApiServer.endpoints.getFightInformation.initiate({ fightId: Number(fightId)}),
  )

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-red-600 text-xl font-bold">Error</h1>
        <p className="mt-2">{JSON.stringify(error)}</p>
      </div>
    )
  }

  if (!fightData) {
    return (
      <div className="p-4">
        <h1 className="text-yellow-600 text-xl font-bold">No fight data found</h1>
        <p className="mt-2">The requested fight information could not be loaded.</p>
      </div>
    )
  }

  return <Fight fightData={fightData} />
}


function Fight({
  fightData,
}: {
  fightData: FightInformationInterface
}) {
  return (
    <div className="flex flex-col p-6">
      <h1 className="mx-auto my-5 text-center text-2xl font-bold text-text-main">
        Действия боя
      </h1>

      <div className=" rounded-2xl border border-border overflow-x-auto">
        <FightTable teams={fightData.teams} />
      </div>

      <ActionTabs fightData={fightData} />
    </div>
  )
}