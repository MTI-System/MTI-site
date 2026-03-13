"use client"

import React from "react"
import { createDispatchHook, createSelectorHook, createStoreHook } from "react-redux"
import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { reactHooksModule } from "@reduxjs/toolkit/query/react"
import {
  defineRegistrationEndpoints,
  registrationBaseQuery,
  registrationReducerPath,
} from "@/api/registration/configuration"

export const RegistrationApiContext = React.createContext(null as any)

const createApiClient = buildCreateApi(
  coreModule(),
  reactHooksModule({
    hooks: {
      useDispatch: createDispatchHook(RegistrationApiContext),
      useSelector: createSelectorHook(RegistrationApiContext),
      useStore: createStoreHook(RegistrationApiContext),
    },
  }),
)

export const registrationApiClient = createApiClient({
  reducerPath: registrationReducerPath,
  baseQuery: registrationBaseQuery,
  endpoints: defineRegistrationEndpoints,
})

export const {
  useGetUserAnswersQuery,
  useGetAnswerQuery,
  useGetAnswersQuery,
  useSetFieldsMutation,
  useCreateFormMutation,
  useFormsInformationQuery,
  useIsFormFilledQuery,
  useGetRegistrationFormQuery,
  useSubmitFormAnswerMutation,
} = registrationApiClient
