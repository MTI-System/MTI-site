import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import { ProblemListInterface, ProblemSchema } from "@/types/problemAPI"
import z from "zod"

const problemsApi = createApi({
  reducerPath: "problemsApi",
  baseQuery: fetchBaseQuery({ baseUrl: PROBLEM_API }),
  endpoints: (builder) => ({
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
  }),
})

export const { useGetProblemsQuery } = problemsApi
export default problemsApi
