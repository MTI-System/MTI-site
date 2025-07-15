import {ProblemList} from "@/types/problemAPI";
import {connection} from "next/server";
import {PROBLEM_API, AUTH_API} from "@/constants/APIEndpoints";
import {User, Right} from "@/types/authApi"
import { redirect } from "next/navigation";

async function fetchProblems(tournament: string, year: number): Promise<ProblemList | null> {
  await connection()
  try {
    const response = await fetch(
      PROBLEM_API + `get_problems_by_tournament_type_and_year?tournamentTypeId=${tournament}&year=${year}`
    )
    const respJSON: ProblemList = await response.json()
    if (!Array.isArray(respJSON)) {
      console.log("Unexpected response received!")
      return null
    }
    return respJSON
  } catch (e) {
    console.log(`Problem fetching error: ${e}`)
    return null
  }
}


async function fetchPermissions(token: string, isRedirect: boolean, redirectPath: string ): Promise<Right[] | null>{
  await connection()
  try{
    const response = await fetch(AUTH_API + `check_auth`, {
      method: "POST",
      headers: {"Authorization": "Bearer " + token}
    })
    if (response.status != 200){
      console.log(`response error with status ${response.status}`)
      if (isRedirect){
        redirect(`login?redirect=${redirectPath}`)
      }
      return null
    }
    const data: User = await response.json()
    return data.rights
  }catch (e){
    console.log(`Permissions fetching error: ${e}`)
return null
  }
}
export {fetchProblems, fetchPermissions};