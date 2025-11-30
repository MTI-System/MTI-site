

import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { REGISTRATION_API } from "@/constants/APIEndpoints"
import {
  TournamentInformationResponse,
  TournamentInformationResponseInterface,
  TournamentRegistrationAnswer,
  TournamentRegistrationAnswerInterface,
  TournamentRegistrationFormInfo,
  TournamentRegistrationFormInfoInterface,
} from "@/types/TournamentRegistrationApi"
import { BooleanResponseSchema } from "@/types/generalAPITypes"
import { FormConstructorResponse } from "@/types/formConstructor"
import z from "zod"

export const registrationReducerPath = "registrationApi" as const

export const registrationBaseQuery = fetchBaseQuery({ baseUrl: REGISTRATION_API })

export const defineRegistrationEndpoints = (
  builder: EndpointBuilder<typeof registrationBaseQuery, never, typeof registrationReducerPath>,
) => ({
  formsInformation: builder.query({
    query: ({id} : {id: number}) => `get_info_about_forms/${id}`, 
    transformResponse: (response: unknown): TournamentInformationResponseInterface | null => {
      const parsed = TournamentInformationResponse.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing registration form: ${parsed.error}`)
      return null
    }
  }),

  createForm: builder.mutation({
    query: ({
      token,
      tournamentId,
      formTypeFlag,
      formTitle
    } : {
      token: string,
      tournamentId: number,
      formTypeFlag: string,
      formTitle: string
    }) => ({
      url: `create_form`,
      method: 'POST',
      body: (()=>{
        const fd = new FormData()
        fd.set('token', token)
        fd.set('tournamentId', tournamentId.toString())
        fd.set('formTypeFlag', formTypeFlag)
        fd.set('formTitle', formTitle)
        
        return fd
      })()
    }),
    
  }),

  setFields: builder.mutation({
    query: ({
      newForm
    }: {
      newForm: FormConstructorResponse
    })=>{
      console.log("result: ", newForm)
      return {
      url: "set_from_fields",
      method: "POST",
      body: newForm
    }}

  }),
   
  getAnswers: builder.query({
    query: ({id, token}) => ({
      url: "get_answers",
      method: "POST",
      body: (()=>{
        const fd = new FormData()
        fd.set('token', token)
        fd.set('formId', id.toString())
        return fd
      })()
    }),
    transformResponse: (response: unknown): TournamentRegistrationAnswerInterface[] | null => {
      console.log("getAnswers response: ", response)
      const parsed = z.array(TournamentRegistrationAnswer).safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing registration form: ${parsed.error}`)
      return null
    },
  }),

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
