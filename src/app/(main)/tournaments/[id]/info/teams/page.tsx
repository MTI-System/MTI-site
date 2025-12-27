import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"
import TeamInTournamentPage from "@/components/tournaments/TeamInTournamentPage"
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
    title: `Список команд | ${data.title} – МТИ`,
    description: `Полное расписание боев на турнире '${data.title}'`,
  }
}

export default async function InfoProblemsTournamentPage({ params }: { params: Promise<{ id: number }> }) {
  const id = (await params).id
  const tournamentsStore = makeTournamentsStoreServer()
  const { data: tournamentCard, error } = await tournamentsStore.dispatch(
    tournamentsApiServer.endpoints.getTournamentCard.initiate({ id: id }),
  )
  return (
    <>
      <h1 className="text-text-main mb-4 w-full text-center text-2xl font-bold">
        Команды, принимающие участие в турнире
      </h1>
      <div className="flex flex-col gap-2">
        {tournamentCard?.teams.map((t) => (
          <div key={t.id} className="border-border rounded-2xl border px-10 py-3">
            <TeamInTournamentPage mainData={t} />
          </div>
        ))}
      </div>
    </>
  )
}
