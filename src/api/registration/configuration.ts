import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { REGISTRATION_API } from "@/constants/APIEndpoints"
import {
  TournamentRegistrationFormInfo,
  TournamentRegistrationFormInfoInterface,
} from "@/types/TournamentRegistrationApi"

export const registrationReducerPath = "registrationApi" as const

export const registrationBaseQuery = fetchBaseQuery({ baseUrl: REGISTRATION_API })

export const defineRegistrationEndpoints = (
  builder: EndpointBuilder<typeof registrationBaseQuery, never, typeof registrationReducerPath>,
) => ({
  getRegistrationForm: builder.query({
    query: ({ id, type }: { id: number; type: string }) => `get_form_for_tournament/${id}/${type}`,
    transformResponse: (response: unknown): TournamentRegistrationFormInfoInterface | null => {
      const parsed = TournamentRegistrationFormInfo.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing registration form: ${parsed.error}`)
      return null
    },
  }),
  submitFormAnswer: builder.mutation({
    query: ({ formData }: { formData: FormData }) => ({
      url: "answer_form",
      method: "POST",
      body: formData,
    }),
    transformResponse: (response: unknown): boolean => {
      return response !== null
    },
  }),
})
