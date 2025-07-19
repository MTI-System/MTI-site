"use server"
import ProblemCard from "@/components/sections/problems/ProblemCard"
import { Problem, ProblemList } from "@/types/problemAPI"
import { fetchProblems } from "@/scripts/ApiFetchers"
import FetchingErrorBanner from "@/components/ui/FetchingErrorBanner"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import { AddProblem } from "./ProblemForms"

export default async function ProblemsList({
  year,
  tt,
  isEditable,
}: {
  year: number
  tt: string
  isEditable: boolean
}) {
  const respJSON: ProblemList | null = await fetchProblems(
    availableTournamentTypes.find((value) => value.name === tt)!!.id.toString(),
    year
  )

  return (
    <>
      {/* {isEditable && <AddProblem isShown={isEditable} />} */}
      {respJSON &&
        respJSON.map((problem: Problem, index: number) => (
          <ProblemCard problem={problem} isEdiatable={isEditable} key={index + 1}></ProblemCard>
        ))}
      {respJSON === null && <FetchingErrorBanner />}
    </>
  )
}
