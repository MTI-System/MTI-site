import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import z from "zod"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import {
  ProblemInterface,
  ProblemListInterface,
  ProblemSchema,
  ProblemSectionWithSciencesInterface,
  ProblemSectionWithSciencesSchema,
} from "@/types/problemAPI"

export const problemsReducerPath = "problemsApi" as const

export const problemsBaseQuery = fetchBaseQuery({ baseUrl: PROBLEM_API })

export const defineProblemsEndpoints = (
  builder: EndpointBuilder<typeof problemsBaseQuery, never, typeof problemsReducerPath>,
) => ({
  getProblems: builder.query({
    query: ({ tournament, year }: { tournament: string; year: number }) =>
      `get_problems_by_tournament_type_and_year?tournamentTypeId=${tournament}&year=${year}`,
    transformResponse: (response: unknown): ProblemListInterface | null => {
      const respJSON = z.array(ProblemSchema).safeParse(response)
      if (respJSON.success) return respJSON.data
      console.error(`Unexpected response while parsing problems: ${respJSON.error}`)
      return null
    },
  }),
  getProblemsForTournament: builder.query({
    query: ({ tournamentId }: { tournamentId: number }) => `get_problems_for_tournament/${tournamentId}`,
    transformResponse: (response: unknown): ProblemListInterface | null => {
      const respJSON = z.array(ProblemSchema).safeParse(response)
      if (respJSON.success) return respJSON.data
      console.error(`Unexpected response while parsing problems: ${respJSON.error}`)
      return null
    },
  }),
  getProblemsById: builder.query({
    query: ({ problemId }: { problemId: number }) => `get_problem_by_global_id/${problemId}`,
    transformResponse: (response: unknown): ProblemInterface | null => {
      const respJSON = ProblemSchema.safeParse(response)
      if (respJSON.success) return respJSON.data
      console.error(`Unexpected response while parsing problems: ${respJSON.error}`)
      return null
    },
  }),
  addProblem: builder.mutation({
    query: ({ formData }: { formData: FormData }) => ({
      url: "add_problem",
      method: "POST",
      body: formData,
    }),
  }),
  deleteProblem: builder.mutation({
    query: ({ problemId, tournamentTypeId, token }: { problemId: number; tournamentTypeId: number; token: string }) => {
      const formData = new FormData()
      formData.append("authToken", token)
      formData.append("tournamentType", tournamentTypeId.toString())
      return {
        url: `delete_problem/${problemId}`,
        method: "DELETE",
        body: formData,
      }
    },
    transformResponse: (response: unknown): boolean => {
      return response !== null
    },
  }),
  deleteMaterial: builder.mutation({
    query: ({ problemId, materialId, token }: { problemId: number; materialId: number; token: string }) => {
      const formData = new FormData()
      formData.append("token", token)
      formData.append("problemId", problemId.toString())
      formData.append("materialId", materialId.toString())
      return {
        url: "delete_material",
        method: "DELETE",
        body: formData,
      }
    },
    transformResponse: (response: unknown): boolean => {
      return response !== null
    },
  }),
  getYears: builder.query({
    query: ({ tournamentTypeId }: { tournamentTypeId: number }) => `years?tournamentTypeId=${tournamentTypeId}`,
    transformResponse: (response: unknown): number[] => {
      if (Array.isArray(response)) return response
      return [new Date().getFullYear()]
    },
  }),
  getAllAvailableSections: builder.query({
    query: () => "sections/all_possible_sections",
    transformResponse: (response: unknown): ProblemSectionWithSciencesInterface[] | null => {
      const parsed = ProblemSectionWithSciencesSchema.array().safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing sections: ${parsed.error}`)
      return null
    },
  }),
  modifySectionOnTask: builder.mutation({
    query: ({
      problemId,
      sectionIds,
      action,
      token,
    }: {
      problemId: string
      sectionIds: string[] | string
      action: "add_section" | "delete_section"
      token: string
    }) => {
      const formData = new FormData()
      formData.set("token", token)
      const sectionIdsName = action === "add_section" ? "sectionIds" : "sectionId"
      formData.set(sectionIdsName, sectionIds.toString())
      formData.set("problemId", problemId)
      return {
        url: `sections/${action}`,
        method: action === "delete_section" ? "DELETE" : "POST",
        body: formData,
      }
    },
    transformResponse: (response: unknown): boolean => {
      return response !== null
    },
  }),
  addLinkEmbedding: builder.mutation({
    query: ({
      embedding,
      token,
    }: {
      embedding: {
        link: string
        materialTitle: string
        contentType: number
        isPrimary: boolean
        problemId: number
      }
      token: string
    }) => {
      const formData = new FormData()
      formData.set("link", embedding.link)
      formData.set("materialTitle", embedding.materialTitle)
      formData.set("contentType", embedding.contentType.toString())
      formData.set("isPrimary", embedding.isPrimary.toString())
      formData.set("problemId", embedding.problemId.toString())
      formData.set("token", token)
      return {
        url: "add_material",
        method: "POST",
        body: formData,
      }
    },
    transformResponse: (response: unknown): boolean => {
      return response !== null
    },
  }),
})
