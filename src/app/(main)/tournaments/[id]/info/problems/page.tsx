import ProblemsList from "@/components/problems/ProblemsList"
import { makeProblemsStoreServer } from "@/api/problems/serverStore"
import { problemsApiServer } from "@/api/problems/serverApiInterface"
import type {Metadata} from "next";
import {makeTournamentsStoreServer} from "@/api/tournaments/serverStore";
import {tournamentsApiServer} from "@/api/tournaments/serverApiInterface";


export async function generateMetadata({
                                         params,
                                       }: {
  params: Promise<{ id: number }>
}): Promise<Metadata> {
  const searchP = await params

  const store = makeTournamentsStoreServer()
  const promise = store.dispatch(tournamentsApiServer.endpoints.getTournamentCard.initiate({id: searchP.id}))
  const { data: tournamentCard } = await promise
  const titleText = tournamentCard ? `Список задач · ${tournamentCard.title} – МТИ` : `Турнир – МТИ`

  const descriptionText = tournamentCard
    ? `Список задач турнира ${tournamentCard.title} ${tournamentCard.year} года: регистрируйся на научный турнир!.`
    : "Список задач научного турниа в системе МТИ."

  return {
    title: titleText,
    description: descriptionText,
    verification: { yandex: "aa838087dd1ef992" },
  }
}


export default async function InfoProblemsTournamentPage({ params }: { params: Promise<{ id: number }> }) {
  const id = (await params).id
  // const problems = await fetchProblemsForTournament(id)
  const store = makeProblemsStoreServer()
  const promise = store.dispatch(
    problemsApiServer.endpoints.getProblemsForTournament.initiate(
      { tournamentId: id },
      { subscribe: false, forceRefetch: true },
    ),
  )
  const { data: problems, isLoading, isError, error } = await promise
  return (
    <>
      <h1 className="font-bold mx-auto text-2xl text-center mb-5 text-text-main">Задачи на турнире</h1>
      {isError && <div>Ошибка загрузки задач: {JSON.stringify(error)}</div>}
      <ProblemsList problems={problems} isEditable={false} sectionsFilter={[]} />
    </>
  )
}
