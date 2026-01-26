import TournamentsProviderWrapper from "@/api/tournaments/ClientWrapper";
import UserResultsTable from "@/components/tournamentPage/UserResutsTable";
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import { Metadata } from "next"

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
    title: `Личный зачёт | ${data.title} – МТИ`,
    description: `Таблица с результатами личного зачёта участников турнира '${data.title}'`,
  }
}


export default async function InfoProblemsTournamentPage({ params }: { params: Promise<{ id: number }> }) {
  const tournamentId = (await params).id
  return (
    <>
      <TournamentsProviderWrapper>
        <UserResultsTable tournamentId={tournamentId} />
      </TournamentsProviderWrapper>
    </>
  )
}
