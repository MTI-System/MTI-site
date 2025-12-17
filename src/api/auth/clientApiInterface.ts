"use client"

import React from "react"
import { createDispatchHook, createSelectorHook, createStoreHook } from "react-redux"
import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { reactHooksModule } from "@reduxjs/toolkit/query/react"

import { authBaseQuery, authReducerPath, defineAuthEndpoints } from "@/api/auth/configuration"

export const AuthApiContext = React.createContext(null as any)

const createApiClient = buildCreateApi(
  coreModule(),
  reactHooksModule({
    hooks: {
      useDispatch: createDispatchHook(AuthApiContext),
      useSelector: createSelectorHook(AuthApiContext),
      useStore: createStoreHook(AuthApiContext),
    },
  }),
)

export const authApiClient = createApiClient({
  reducerPath: authReducerPath,
  baseQuery: authBaseQuery,
  endpoints: defineAuthEndpoints,
})

export const { usePersonalDAtaRequestGrandMutation, usePersonalDataRequestsQuery, useIsLoginTakenMutation, useLoginMutation, useRegisterMutation, useFetchPermissionsMutation, useIsEmailTakenMutation } = authApiClient
