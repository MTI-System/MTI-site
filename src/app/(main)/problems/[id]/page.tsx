import { PROBLEM_API } from "@/constants/APIEndpoints"
import ProblemPage from "@/components/problems/ProblemPage"
import { ProblemInterface } from "@/types/problemAPI"
import NotFound from "@/components/service/NotFound"
import { Metadata } from "next"
import { cache } from "react"
import {fetchTournamentTypes} from "@/scripts/ApiFetchers"
import TournamentsPageTabs from "@/components/tournamentPage/TournamentsPageTabs";
import ProblemsReduxProviderWrapper from "@/components/Redux/ProblemsReduxProvider";
import makeStore from "@/redux_stores/Global/tournamentTypeRedixStore";
import {makeProblemsStoreServer} from "@/api/problems/serverStore";
import {problemsApiServer} from "@/api/problems/serverApiInterface";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const store = makeProblemsStoreServer()
  const promise = store.dispatch(
      problemsApiServer.endpoints.getProblemsById.initiate(
          {problemId: id},
      )
  )
  const {data: problem} = await promise
  if (!problem) {
    return {
      title: "Задача не найдена – МТИ",
      description: "Запрошенная задача не найдена в системе МТИ.",
    }
  }

  const ttype = (await fetchTournamentTypes()).find((t) => t.id === problem.tournament_type)

  return {
    title: `Задача № ${problem.global_number} · ${problem.problem_translations[0].problem_name} · ${ttype?.longName ?? ""} · ${problem.year} год – МТИ`,
    description: `Задача для ${ttype?.name ?? "научного турнира"} № ${problem.global_number} - ${problem.problem_translations[0].problem_name || "Описание отсутствует"} ${problem.year} года.`,
    verification: { yandex: "aa838087dd1ef992" },
  }
}

async function ProblemPageMain({ params }: PageProps) {
  const { id } = await params
  const store = makeProblemsStoreServer()
  const promise = store.dispatch(
      problemsApiServer.endpoints.getProblemsById.initiate(
          {problemId: id},
      )
  )
  const {data: problem} = await promise
  if (!problem) return <NotFound />
  return (
    <>
      <ProblemsReduxProviderWrapper>
        <ProblemPage problem={problem} />
      </ProblemsReduxProviderWrapper>
    </>
  )
}

export default ProblemPageMain
