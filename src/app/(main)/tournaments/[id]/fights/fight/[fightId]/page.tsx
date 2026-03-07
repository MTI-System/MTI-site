import { ActionTabs } from "@/components/tournaments/FightAction"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import { FightInformationInterface } from "@/types/TournamentsAPI"
import { FightTable } from "@/components/tournaments/FightTable"
import { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ fightId: string; id: string }>
}): Promise<Metadata> {
  const { fightId, id: tournamentId } = await params
  const store = makeTournamentsStoreServer()
  const { data: containerData, error: containerError } = await store.dispatch(
    tournamentsApiServer.endpoints.getFightInfoByTournament.initiate({ tournamentId: Number(tournamentId) }),
  )
  const { data: fightData, error: fightError } = await store.dispatch(
    tournamentsApiServer.endpoints.getFightInformation.initiate({ fightId: Number(fightId) }),
  )
  console.log(containerError, fightError)
  if (containerError || fightError)
    return {
      title: "Ошибка загрузки комнаты – МТИ",
      description: "Не удалось загрузить запрошенную комнату.",
    }
  if (!containerData)
    return {
      title: "турнир не найден – МТИ",
      description: "Запрошенный турнир не найден в системе МТИ.",
    }
  if (!fightData)
    return {
      title: "Комната не найдена – МТИ",
      description: "Запрошенный бой не найден в системе МТИ.",
    }
  const fight = Object.entries(containerData).find(
    ([name, data]) => data.find((dId) => fightData.id === dId.id) !== undefined,
  )
  if (!fight)
    return {
      title: "Ошибка загрузки боя 2 – МТИ",
      description: "Не удалось загрузить запрошенный бой.",
    }
  const { data: containerCardData, error: containerCardError } = await store.dispatch(
    tournamentsApiServer.endpoints.getFightContainerCard.initiate({ id: Number(fight[0]) }),
  )
  if (!containerCardData || containerCardError)
    return {
      title: "Ошибка загрузки боя 3 – МТИ",
      description: "Не удалось загрузить запрошенный бой.",
    }

  return {
    title: `${containerCardData.title}: сводка по действиям – МТИ`,
    description: `Краткая сводка результатов боя в комнате`,
  }
}

export default async function FightPage({ params }: { params: Promise<{ fightId: string; id: string }> }) {
  const { fightId, id: tournamentId } = await params
  const store = makeTournamentsStoreServer()
  const {
    data: fightData,
    error,
    isLoading,
  } = await store.dispatch(tournamentsApiServer.endpoints.getFightInformation.initiate({ fightId: Number(fightId) }))

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-red-600">Error</h1>
        <p className="mt-2">{JSON.stringify(error)}</p>
      </div>
    )
  }

  if (!fightData) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-yellow-600">No fight data found</h1>
        <p className="mt-2">The requested fight information could not be loaded.</p>
      </div>
    )
  }

  return <Fight fightData={fightData} tournamentId={Number(tournamentId)} />
}

function Fight({ fightData, tournamentId }: { fightData: FightInformationInterface, tournamentId: number }) {
  return (
    <div className="flex flex-col p-6">
      <h1 className="text-text-main mx-auto my-5 text-center text-2xl font-bold">Действия боя</h1>

      <div className="border-border overflow-x-auto rounded-2xl border">
        <FightTable teams={fightData.teams ?? []} tournamentId={tournamentId} />
      </div>

      <ActionTabs fightData={fightData} tournamentId={tournamentId} />
    </div>
  )
}
