"use client"

import React from "react"
import { createDispatchHook, createSelectorHook, createStoreHook } from "react-redux"
import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { reactHooksModule } from "@reduxjs/toolkit/query/react"

import { usersBaseQuery, usersReducerPath, defineUsersEndpoints } from "@/api/users/configuration"

export const UsersApiContext = React.createContext(null as any)

const createApiClient = buildCreateApi(
  coreModule(),
  reactHooksModule({
    hooks: {
      useDispatch: createDispatchHook(UsersApiContext),
      useSelector: createSelectorHook(UsersApiContext),
      useStore: createStoreHook(UsersApiContext),
    },
  }),
)

export const usersApiClient = createApiClient({
  reducerPath: usersReducerPath,
  baseQuery: usersBaseQuery,
  endpoints: defineUsersEndpoints,
})

export const { useGetUserByIdQuery, useFindUsersQuery, useRequestEmailVerificationMutation, useVerifyEmailQuery } = usersApiClient
