"use server"
import ProblemCard from "@/components/sections/problems/ProblemCard"
import { ProblemInterface, ProblemListInterface } from "@/types/problemAPI"
import { fetchProblems } from "@/scripts/ApiFetchers"
import FetchingErrorBanner from "@/components/ui/FetchingErrorBanner"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
export default async function ProblemsList({
  year,
  tt,
  isEditable,
}: {
  year: number
  tt: string
  isEditable: boolean
}) {
  const ttid = availableTournamentTypes.find((value) => value.name === tt)?.id.toString()
  const respJSON: ProblemListInterface | null = ttid ? await fetchProblems(ttid, year) : null

  return (
      <>
      {respJSON !== null &&
        respJSON.map((problem: ProblemInterface, index: number) => (
          <ProblemCard problem={problem} isEditable={isEditable} key={index + 1}></ProblemCard>
        ))}
      {respJSON === null && <FetchingErrorBanner />}
    </>
  )
}
