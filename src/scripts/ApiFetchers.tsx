import {ProblemList} from "@/types/problemAPI";
import {connection} from "next/server";
import {PROBLEM_API} from "@/constants/APIEndpoints";

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

export default fetchProblems;