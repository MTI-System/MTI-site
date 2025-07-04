import ProblemCard from "@/components/sections/problems/ProblemCard"
import { Problem, ProblemList } from "@/types/problemAPI"
import style from "@/styles/problems/problemPage.module.css"

async function ProblemsPage() {
  const response = await fetch(process.env.PROBLEM_API!!)
  const respJSON: ProblemList = await response.json()
  return (
    <div className="flex flex-col items-center bg-gray-100">
      <div className={style.problemsContainer}>
        <div className={style.filters}>
          <div className={style.tournamen + " " + style.filter}>Tournament dropdown</div>
          <div className={style.year + " " + style.filter}>Year dropdown</div>
        </div>
        {respJSON.map((problem: Problem, index: number) => (
          <ProblemCard problem={problem} key={index + 1}></ProblemCard>
        ))}
      </div>
    </div>
  )
}

// async function fetchProblems(tournament: string, year: string): Promise<undefined | ProblemList> {
//   return
// }

export default ProblemsPage
