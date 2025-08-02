"use server"
import ProblemCard from "@/components/sections/problems/ProblemCard"
import { ProblemInterface, ProblemListInterface } from "@/types/problemAPI"
import { fetchPermissions, fetchProblems } from "@/scripts/ApiFetchers"
import FetchingErrorBanner from "@/components/ui/FetchingErrorBanner"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"

export default async function ProblemsList({ year, tt }: { year: number; tt: string }) {
  const ttid = availableTournamentTypes.find((value) => value.name === tt)?.id.toString()
  const respJSON: ProblemListInterface | null = ttid ? await fetchProblems(ttid, year) : null
  const userAuth = await fetchPermissions()
  let isEditable = false
  if (userAuth && userAuth.rights.length !== 0) {
    isEditable = userAuth.rights
      .map(
        (right) =>
          right.right_flag == "MODERATE_PROBLEMS_" + availableTournamentTypes.find((val) => val.name === tt)?.id
      )
      .some((x) => x)
  }

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
