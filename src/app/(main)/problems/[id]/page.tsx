import ProblemPage from "@/components/problems/ProblemPage"
import NotFound from "@/components/service/NotFound"
import { Metadata } from "next"
import ProblemsReduxProviderWrapper from "@/components/Redux/ProblemsReduxProvider"
import { makeProblemsStoreServer } from "@/api/problems/serverStore"
import { problemsApiServer } from "@/api/problems/serverApiInterface"
import { makeTournamentsStoreServer } from "@/api/tournaments/serverStore"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const store = makeProblemsStoreServer()
  const storeTournaments = makeTournamentsStoreServer()
  const promiseTournaments = storeTournaments.dispatch(
    tournamentsApiServer.endpoints.getAvailableTournamentTypes.initiate({}),
  )
  const { data: tournamentTypes } = await promiseTournaments
  const promise = store.dispatch(problemsApiServer.endpoints.getProblemsById.initiate({ problemId: Number(id) }))
  const { data: problem } = await promise
  if (!problem || problem.isHidden) {
    return {
      title: "Задача не найдена – МТИ",
      description: "Запрошенная задача не найдена в системе МТИ.",
    }
  }

  const ttype = tournamentTypes?.find((t) => t.id === problem.tournament_type)

  return {
    title: `Задача № ${problem.global_number} · ${problem.problem_translations[0].problem_name} · ${ttype?.longName ?? ""} · ${problem.year} год – МТИ`,
    description: `Задача для ${ttype?.name ?? "научного турнира"} № ${problem.global_number} - ${problem.problem_translations[0].problem_name || "Описание отсутствует"} ${problem.year} года.`,
    verification: { yandex: "aa838087dd1ef992" },
  }
}

async function ProblemPageMain({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const store = makeProblemsStoreServer()
  const promise = store.dispatch(problemsApiServer.endpoints.getProblemsById.initiate({ problemId: Number(id) }))
  const { data: problem } = await promise
  if (!problem || problem.isHidden) return <NotFound />
  return (
    <>
      <ProblemsReduxProviderWrapper>
        <ProblemPage problem={problem} />
      </ProblemsReduxProviderWrapper>
    </>
  )
}

export default ProblemPageMain
