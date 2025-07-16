"use server"
import ProblemCard from "@/components/sections/problems/ProblemCard"
import { Problem, ProblemList } from "@/types/problemAPI"
import {fetchProblems} from "@/scripts/ApiFetchers";
import FetchingErrorBanner from "@/components/ui/FetchingErrorBanner";
import {availableTournamentTypes} from "@/constants/AvailableTournaments";

export default async function ProblemsList({ year, tt }: { year: number; tt: string }) {
  const respJSON: ProblemList|null = await fetchProblems((availableTournamentTypes.find(value => value.name === tt)?.id!!).toString(), year)
  
  return (
    <>
      {respJSON && respJSON.map((problem: Problem, index: number) => (
        <ProblemCard problem={problem} key={index + 1}></ProblemCard>
      ))}
      {respJSON === null && <FetchingErrorBanner />}
    </>
  )
}






