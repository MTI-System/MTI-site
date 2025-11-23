import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { REGISTRATION_API } from "@/constants/APIEndpoints"
import {
  TournamentRegistrationFormInfo,
  TournamentRegistrationFormInfoInterface,
} from "@/types/TournamentRegistrationApi"
import { BooleanResponseSchema } from "@/types/generalAPITypes"

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
  isFormFilled: builder.query({
    query: ({tournamentId, formFlag, userId}: {tournamentId: number,
      formFlag: string, userId: number
    }) => ({
      url: `is_form_filled/${tournamentId}/${formFlag}?userId=${userId}`,
      method: "GET"
    }),
    transformResponse: (response: string): boolean=> {
      if (!response) return false
      const is_login_taken = BooleanResponseSchema.safeParse(response)
      return is_login_taken.data?.result ?? false 
    }
  }),
  submitFormAnswer: builder.mutation({
    query: ({ formData, formId}: { formData: FormData, formId:number }) => ({
      url: `answer_form/${formId}`,
      method: "POST",
      body: formData,
    }),
    transformResponse: (response: unknown): boolean => {
      return response !== null
    },
  }),
})
