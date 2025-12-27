import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
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
    description: `Таблица с результатами турнира '${data.title}'`,
  }
}

export default async function TournamentResultPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
        <ResultsTable tournamentId={Number(id)} />
      </Suspense>
    </>
  )
}
