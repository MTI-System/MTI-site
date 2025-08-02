import { PROBLEM_API } from "@/constants/APIEndpoints"
import ProblemPage from "@/components/sections/problems/[id]/ProblemPage"
import { ProblemInterface } from "@/types/problemAPI"
import NotFound from "@/components/sections/problems/[id]/NotFound"
import LockTournamentType from "@/components/Redux/LockTournamentType"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"

async function ProblemPageMain({ params }: PageProps) {
  const { id } = await params
  const problemRequest = await fetch(PROBLEM_API + "get_problem_by_global_id/" + id.toString())
  if (!problemRequest.ok) return <NotFound />
  const problem: ProblemInterface = await problemRequest.json()
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
