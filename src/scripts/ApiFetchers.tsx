"use server"
import { ProblemList } from "@/types/problemAPI"
import { connection } from "next/server"
import { PROBLEM_API, AUTH_API } from "@/constants/APIEndpoints"
import { User } from "@/types/authApi"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

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

async function fetchPermissions(redirectPath?: string): Promise<User | null> {
  await connection()
  const token = (await cookies()).get("mtiyt_auth_token")?.value
  if (!token) {
    if (redirectPath) {
      redirect(`login?redirect=${redirectPath}`)
    }
    return null
  }
  try {
    const response = await fetch(AUTH_API + "check_auth", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    if (response.status != 200) {
      console.log(`response error with status ${response.status}`)
      if (redirectPath) {
        redirect(`login?redirect=${redirectPath}`)
      }
      return null
    }
    const data: User = await response.json()
    return data
  } catch (e) {
    console.log(`Permissions fetching error: ${e}`)
    return null
  }
}

async function deleteProblem(problem: number, tournamentTypeId: number): Promise<boolean> {
  const token = (await cookies()).get("mtiyt_auth_token")?.value ?? ""
  const formData = new FormData()
  formData.append("authToken", token)
  formData.append("tournamentType", tournamentTypeId.toString())
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  const r = await fetch(PROBLEM_API + "delete_problem/" + problem.toString(), {
    method: "DELETE",
    body: formData,
    signal: controller.signal,
  })
  clearTimeout(timeoutId)
  console.log(`Problem ${problem} delete with status ${r.status}`)
  return r.ok
}

async function fetchYears(tournamentTypeId: number): Promise<number[]> {
  return await fetch(PROBLEM_API + "years?tournamentTypeId=" + tournamentTypeId.toString()).then((response) =>
    response.json()
  )
}

async function fetchAddSectionToTask(problem_id: string, sectionId: string) {
  const token = (await cookies()).get("mtiyt_auth_token")?.value ?? ""
  const formData = new FormData()
  formData.set("token", token)
  formData.set("problem", problem_id)
  formData.set("section", sectionId)
  await fetch(PROBLEM_API + "add_section", {
    method: "POST",
    body: formData,
  })
}
export { fetchProblems, fetchPermissions, deleteProblem, fetchYears, fetchAddSectionToTask }
