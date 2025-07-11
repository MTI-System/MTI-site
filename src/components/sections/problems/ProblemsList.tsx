"use server"
import ProblemCard from "@/components/sections/problems/ProblemCard"
import { Problem, ProblemList } from "@/types/problemAPI"
import style from "@/styles/problems/problemsList.module.css"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import { connection } from "next/server"

export default async function ProblemsList({ year }: { year: number }) {
  const respJSON: ProblemList = await fetchProblems("1", year)
  return (
    <>
      {respJSON.map((problem: Problem, index: number) => (
        <ProblemCard problem={problem} key={index + 1}></ProblemCard>
      ))}
      {respJSON.length === 0 && <FetchingErrorBanner />}
    </>
  )
}

async function fetchProblems(tournament: string, year: number): Promise<ProblemList> {
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
