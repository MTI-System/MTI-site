"use server"
import { ProblemList } from "@/types/problemAPI"
import { connection } from "next/server"
import { PROBLEM_API, AUTH_API } from "@/constants/APIEndpoints"
import { User, UserSchema } from "@/types/authApi"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

async function fetchWithRetryAndTimeout(
  url: string,
  init?: RequestInit,
  retry: number = 0,
  timeout: number = 5000
): Promise<Response | null> {
  if (!init) init = {}
  try {
    const controller = new AbortController()
    if (init?.signal) init.signal.addEventListener("abort", controller.abort)
    init.signal = controller.signal
    const timeoutId =
      timeout > 0
        ? setTimeout(() => {
            console.log("Request timeout")
            controller.abort()
          }, timeout)
        : undefined
    const response = await fetch(url, init)
    if (timeoutId) clearTimeout(timeoutId)
    if (!response.ok) {
      console.error(`Request to ${url} failed with status ${response.status}`)
      if (retry > 1) return fetchWithRetryAndTimeout(url, init, retry - 1, timeout)
      return null
    }
    return response
  } catch (e) {
    console.error(`Request to ${url} failed with exception: ${e}`)
    if (retry > 1) return fetchWithRetryAndTimeout(url, init, retry - 1, timeout)
    return null
  }
}

async function fetchProblems(tournament: string, year: number): Promise<ProblemList | null> {
  await connection()
  try {
    const response = await fetchWithRetryAndTimeout(
      PROBLEM_API + `get_problems_by_tournament_type_and_year?tournamentTypeId=${tournament}&year=${year}`
    )
    if (!response) return null
    // TODO: REWRITE!!!
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
    const response = await fetchWithRetryAndTimeout(AUTH_API + "check_auth", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    if (!response) {
      if (!redirectPath) return null
      redirect(`login?redirect=${redirectPath}`)
    }
    const data: User = UserSchema.parse(await response.json())
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

  const response = await fetchWithRetryAndTimeout(PROBLEM_API + "delete_problem/" + problem.toString(), {
    method: "DELETE",
    body: formData,
  })
  return response != null
}

async function fetchYears(tournamentTypeId: number): Promise<number[]> {
  return (
    (await fetchWithRetryAndTimeout(
      "https://testbackend.mofius-server.ru/api/problems/years?tournamentTypeId=" + tournamentTypeId.toString()
    ).then((response) => response?.json())) ?? [new Date().getFullYear()]
  )
}

async function fetchAddSectionToTask(problemId: string, sectionId: string): Promise<boolean> {
  const token = (await cookies()).get("mtiyt_auth_token")?.value ?? ""
  const formData = new FormData()
  formData.set("token", token)
  formData.set("section", sectionId)
  const response = await fetchWithRetryAndTimeout(PROBLEM_API + `sections/add_section/${problemId}`, {
    method: "POST",
    body: formData,
  })
  return response != null
}
export { fetchProblems, fetchPermissions, deleteProblem, fetchYears, fetchAddSectionToTask }
