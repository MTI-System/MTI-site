"use client"
import React from "react"
import { createDispatchHook, createSelectorHook, createStoreHook } from "react-redux"
import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { reactHooksModule } from "@reduxjs/toolkit/query/react"

import { usersBaseQuery, usersReducerPath, defineUsersEndpoints } from "@/api/users/configuration"
import { UsersApiDispatch } from "./clientStore"

export const UsersApiContext = React.createContext(null as any)

export const useUsersDispatch = createDispatchHook<UsersApiDispatch>(UsersApiContext)

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
  tagTypes: ["Users"],
})

export const {
  useEditUserMutation,
  useGetUserByIdQuery,
  useGetUserByAuthIdQuery,
  useFindUsersQuery,
  useVerifyEmailQuery,
} = usersApiClient
