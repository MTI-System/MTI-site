import {PROBLEM_API} from "@/constants/APIEndpoints"
import ProblemPage from "@/components/sections/problems/[id]/ProblemPage"
import {ProblemInterface} from "@/types/problemAPI"
import NotFound from "@/components/sections/problems/[id]/NotFound"
import {availableTournamentTypes} from "@/constants/AvailableTournaments"
import {Metadata} from "next";
import { cache } from 'react'
import { fetchProblemById } from "@/scripts/ApiFetchers"


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const problem = await fetchProblemById(id)
  if (problem === null) {
    return {
      title: "Задача не найдена – МТИ",
      description: "Запрошенная задача не найдена в системе МТИ.",
    };
  }

  const ttype = availableTournamentTypes.find((t) => t.id === problem.tournament_type);

  return {
    title: `Задача № ${problem.global_number} · ${problem.problem_translations[0].problem_name} · ${ttype?.longName??""} · ${problem.year} год – МТИ`,
    description: `Задача для ${ttype?.name??"научного турнира"} № ${problem.global_number} - ${problem.problem_translations[0].problem_name || "Описание отсутствует"} ${problem.year} года.`,
    verification: { yandex: "aa838087dd1ef992" },
  };
}

async function ProblemPageMain({ params }: PageProps) {
  const { id } = await params
  const problem = await fetchProblemById(id)
  if (problem === null) return <NotFound />
  return (
    <>
      <ProblemPage problem={problem} />
    </>
  )
}

export default ProblemPageMain
