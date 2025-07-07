import ProblemCard from "@/components/sections/problems/ProblemCard"
import { Problem, ProblemList } from "@/types/problemAPI"
import style from "@/styles/problems/problemPage.module.css"
import { PROBLEM_API } from "@/components/constants"
import { connection } from "next/server"

async function ProblemsPage() {
  const respJSON: ProblemList = await fetchProblems(1, "2025")

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
        {respJSON.length === 0 && <FetchingErrorBanner />}
      </div>
    </div>
  )
}

async function fetchProblems(tournament: number, year: string): Promise<ProblemList> {
  await connection()
  try {
    const response = await fetch(
      PROBLEM_API + `get_problems_by_tournament_type_and_year?tournamentTypeId=${tournament}&year=${year}`
    )
    const respJSON: ProblemList = await response.json()
    if (!Array.isArray(respJSON)) {
      console.log("Unexpected response received!")
      return []
    }
    return respJSON
  } catch (e) {
    console.log(`Fetching error: ${e}`)
    return []
  }
}

function FetchingErrorBanner() {
  return (
    <div className={style.errorCard}>
      <h2>Error loading API response</h2>
      <div className={style.errorLogo}>Error image here</div>
      <p>Error occured while transfering API data. Please check your internet connection or try again later.</p>
    </div>
  )
}

export default ProblemsPage
