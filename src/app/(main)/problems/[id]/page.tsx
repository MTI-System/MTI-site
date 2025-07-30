import { PROBLEM_API } from "@/constants/APIEndpoints"
import ProblemPage from "@/components/sections/problems/[id]/ProblemPage"
import { Problem } from "@/types/problemAPI"
import NotFound from "@/components/sections/problems/[id]/NotFound"

async function ProblemPageMain({ params }: PageProps) {
  const { id } = await params
  const problemRequest = await fetch(PROBLEM_API + "get_problem_by_global_id/" + id.toString())
  if (!problemRequest.ok) return <NotFound />
  const problem: Problem = await problemRequest.json()
  if (problem === null) return <NotFound />
  return <ProblemPage problem={problem} />
}

export default ProblemPageMain
