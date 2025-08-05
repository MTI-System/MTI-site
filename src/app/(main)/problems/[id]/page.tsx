import {PROBLEM_API} from "@/constants/APIEndpoints"
import ProblemPage from "@/components/sections/problems/[id]/ProblemPage"
import {ProblemInterface} from "@/types/problemAPI"
import NotFound from "@/components/sections/problems/[id]/NotFound"
import LockTournamentType from "@/components/Redux/LockTournamentType"
import {availableTournamentTypes} from "@/constants/AvailableTournaments"
import {Metadata} from "next";
import { cache } from 'react'

const getProblemData = cache(async (id: number): Promise<ProblemInterface | null> => {
  console.log("Getting problem data", id)
  const response = await fetch(PROBLEM_API + "get_problem_by_global_id/" + id.toString())
  return response ?  await response.json() : null;
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const problem = await getProblemData(id)
  if (problem === null) {
    return {
      title: "Задача не найдена – МТИ",
      description: "Запрошенная задача не найдена в системе МТИ.",
    };
  }

  const ttype = availableTournamentTypes.find((t) => t.id === problem.tournament_type);

  return {
    title: `Задача № ${problem.global_number} - ${problem.problem_translations[0].problem_name} · ${ttype?.longName??""} – МТИ`,
    description: `Задача для ${ttype?.name??"научного турнира"} № ${problem.global_number} - ${problem.problem_translations[0].problem_name || "Описание отсутствует"}.`,
    verification: { yandex: "aa838087dd1ef992" },
  };
}

async function ProblemPageMain({ params }: PageProps) {
  const { id } = await params
  const problem = await getProblemData(id)
  if (problem === null) return <NotFound />
  return (
    <>
      <LockTournamentType
        tt={availableTournamentTypes.find((tType) => tType.id === problem.tournament_type)?.name ?? "ТЮФ"}
      />
      <ProblemPage problem={problem} />
    </>
  )
}

export default ProblemPageMain
