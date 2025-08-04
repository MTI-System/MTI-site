"use server"
import { ProblemListInterface, ProblemSchema, ProblemSectionInterface, ProblemSectionSchema } from "@/types/problemAPI"
import {
  EmbeddingInterface,
  EmbeddingSchema,
  EmbeddingTypeInterface,
  EmbeddingTypeSchema,
  LoadFileForm,
} from "@/types/embeddings"
import { connection } from "next/server"
import { PROBLEM_API, AUTH_API, MATERIAL_API } from "@/constants/APIEndpoints"
import { User, UserSchema } from "@/types/authApi"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import z from "zod"

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

async function fetchProblems(tournament: string, year: number): Promise<ProblemListInterface | null> {
  await connection()
  const response = await fetchWithRetryAndTimeout(
    PROBLEM_API + `get_problems_by_tournament_type_and_year?tournamentTypeId=${tournament}&year=${year}`
  )
  if (!response) return null
  const respJSON = z.array(ProblemSchema).safeParse(await response.json())
  if (respJSON.success) return respJSON.data
  console.error(`Unexpected response while parsing problems: ${respJSON.error}`)
  return null
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
    (await fetchWithRetryAndTimeout(PROBLEM_API + "years?tournamentTypeId=" + tournamentTypeId.toString()).then(
      (response) => response?.json()
    )) ?? [new Date().getFullYear()]
  )
}

async function fetchAllAvailableSections(): Promise<ProblemSectionInterface[]> {
  const response = await fetchWithRetryAndTimeout(PROBLEM_API + "sections/all_possible_sections", {
    next: {
      revalidate: 3600,
    },
  })
  if (!response) return []
  const parseRes = z.array(ProblemSectionSchema).safeParse(await response.json())
  if (parseRes.success) return parseRes.data
  console.error(`Unexpected response while parsing sections: ${parseRes.error}`)
  return []
}

async function fetchModifySectionOnTask(
  problemId: string,
  sectionId: string,
  action: "add_section" | "delete_section"
): Promise<boolean> {
  if (action !== "add_section" && action !== "delete_section") return false
  const token = (await cookies()).get("mtiyt_auth_token")?.value ?? ""
  const formData = new FormData()
  formData.set("token", token)
  formData.set("sectionId", sectionId)
  formData.set("problemId", problemId)
  const response = await fetchWithRetryAndTimeout(PROBLEM_API + `sections/${action}`, {
    method: action === "delete_section" ? "DELETE" : "POST",
    body: formData,
  })
  return response != null
}

async function fetchEmbeddingsInfo(embeddingIds: number[]): Promise<EmbeddingInterface[]> {
  const response = await fetchWithRetryAndTimeout(MATERIAL_API + `get_material_list?ids=${embeddingIds.toString()}`)
  if (!response) return []
  const parsed = z.array(EmbeddingSchema).safeParse(await response.json())
  if (parsed.success) return parsed.data
  console.error(`Unexpected response while parsing embedding data: ${parsed.error}`)
  return []
}

async function fetchAddLinkEmbedding(embedding: Omit<LoadFileForm, "file">): Promise<boolean> {
  const formData = new FormData()
  formData.set("link", embedding.link ?? "")
  formData.set("materialTitle", embedding.materialTitle)
  formData.set("contentType", embedding.contentType.toString())
  formData.set("isExternal", embedding.isPrimary.toString())
  formData.set("problemId", embedding.problemId.toString())
  formData.set("token", embedding.token)
  const response = await fetchWithRetryAndTimeout(PROBLEM_API + "add_material", {
    method: "POST",
    body: formData,
  })
  return response != null
}

async function fetchAllAvailableEmbeddingTypes(): Promise<EmbeddingTypeInterface[]> {
  const response = await fetchWithRetryAndTimeout(MATERIAL_API + "get_available_content_types")
  if (!response) return []
  const parsed = z.array(EmbeddingTypeSchema).safeParse(await response.json())
  if (parsed.success) return parsed.data
  console.error(`Unexpected response while parsing embedding types content types: ${parsed.error}`)
  return []
}

export {
  fetchProblems,
  fetchPermissions,
  deleteProblem,
  fetchYears,
  fetchAllAvailableSections,
  // fetchAddSectionToTask,
  fetchModifySectionOnTask,
  // fetchDeleteSectionFromTask,
  fetchEmbeddingsInfo,
  fetchAddLinkEmbedding,
  fetchAllAvailableEmbeddingTypes,
}
