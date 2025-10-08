import {EndpointBuilder, fetchBaseQuery} from "@reduxjs/toolkit/query"
import z from "zod"
import { PROBLEM_API } from "@/constants/APIEndpoints"
import {ProblemListInterface, ProblemSchema} from "@/types/problemAPI";

export const problemsReducerPath = "problemsApi" as const

export const problemsBaseQuery = fetchBaseQuery({ baseUrl: PROBLEM_API })

export const defineProblemsEndpoints = (
    builder: EndpointBuilder<typeof problemsBaseQuery, never, typeof problemsReducerPath>
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
})
