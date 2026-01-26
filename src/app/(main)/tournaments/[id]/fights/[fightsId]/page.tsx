import FightList from "@/components/tournaments/FightList"

import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ fightsId: string; id: string }>
}): Promise<Metadata> {
  const { fightsId, id: tournamentId } = await params
  const store = makeTournamentsStoreServer()
  const { data: containerData, error: containerError } = await store.dispatch(
    tournamentsApiServer.endpoints.getFightInfoByTournament.initiate({ tournamentId: Number(tournamentId) }),
  )
  const { data: fightsData, error: fightsError } = await store.dispatch(
    tournamentsApiServer.endpoints.getFightContainerInfo.initiate({ fightContainerId: Number(fightsId) }),
  )
  if (containerError || fightsError)
    return {
      title: "Ошибка загрузки боя – МТИ",
      description: "Не удалось загрузить запрошенный бой.",
    }
  if (!containerData)
    return {
      title: "турнир не найден – МТИ",
      description: "Запрошенный турнир не найден в системе МТИ.",
    }
  if (!fightsData)
    return {
      title: "Бой не найден – МТИ",
      description: "Запрошенный бой не найден в системе МТИ.",
    }
  const fight = Object.entries(containerData).find(
    ([name, data]) => data.filter((dId) => fightsData.find((fId) => dId.id === fId.id) === undefined).length === 0,
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
    title: `${containerCardData.title}: сводка по комнатам – МТИ`,
    description: `Краткая сводка результатов боя по всем комнатам`,
  }
}

export default async function AllFightPage({ params }: { params: Promise<{ fightsId: string; id: string }> }) {
  const { fightsId, id: tournamentId } = await params
  const store = makeTournamentsStoreServer()
  const {
    data: fightsData,
    error,
    isLoading,
  } = await store.dispatch(
    tournamentsApiServer.endpoints.getFightContainerInfo.initiate({ fightContainerId: Number(fightsId) }),
  )

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-red-600">Error</h1>
        <p className="mt-2">{JSON.stringify(error)}</p>
      </div>
    )
  }

  if (!fightsData) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-yellow-600">No fight data found</h1>
        <p className="mt-2">The requested fight information could not be loaded.</p>
      </div>
    )
  }
  return <FightList fightsData={fightsData} tournamentId={Number(tournamentId)} />
}
