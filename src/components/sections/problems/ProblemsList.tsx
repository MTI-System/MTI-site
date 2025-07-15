"use server"
import ProblemCard from "@/components/sections/problems/ProblemCard"
import { Problem, ProblemList } from "@/types/problemAPI"
import style from "@/styles/problems/problemsList.module.css"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import { connection } from "next/server"
import fetchProblems from "@/scripts/ApiFetchers";
import FetchingErrorBanner from "@/components/ui/FetchingErrorBanner";

export default async function ProblemsList({ year, tt }: { year: number; tt: string }) {
  const respJSON: ProblemList = await fetchProblems((availableTournamentTypes.indexOf(tt) + 1).toString(), year)
  return (
    <>
      {respJSON.map((problem: Problem, index: number) => (
        <ProblemCard problem={problem} key={index + 1}></ProblemCard>
      ))}
      {respJSON.length === 0 && <FetchingErrorBanner />}
    </>
  )
}






