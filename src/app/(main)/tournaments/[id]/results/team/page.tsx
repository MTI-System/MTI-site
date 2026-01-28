import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import FinalTable from "@/components/tournamentPage/FinalTable"
import ResultsTable from "@/components/tournamentPage/ResutsTable"
import { Metadata } from "next"
import { Suspense } from "react"

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
    title: `Результаты | ${data.title} – МТИ`,
    description: `Таблица с результатами командного зачёта участников турнира '${data.title}'`,
  }
}

export default async function TournamentResultPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const store = makeTournamentsStoreServer()
  const { data, error } = await store.dispatch(
    tournamentsApiServer.endpoints.getTournamentCard.initiate({ id: Number(id) }),
  )
  if (error)
    return <p>error</p>
  if (!data)
    return <p>error</p>
  const finalFight = data.fight_containers_cards.find(f => f.title.toLowerCase().includes('финал'))
  console.log("FINAL", finalFight)
  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
        {finalFight && <FinalTable fightId={finalFight.id} tournamentId={Number(id)} />}
        <ResultsTable tournamentId={Number(id)} />
      </Suspense>
    </>
  )
}
