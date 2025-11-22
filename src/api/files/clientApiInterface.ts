"use client"

import React from "react"
import { createDispatchHook, createSelectorHook, createStoreHook } from "react-redux"
import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { reactHooksModule } from "@reduxjs/toolkit/query/react"

import { authBaseQuery, authReducerPath, defineAuthEndpoints } from "@/api/auth/configuration"
import { defineFilesEndpoints, filesBaseQuery, filesReducerPath } from "@/api/files/configuration"

export const FilesApiContext = React.createContext(null as any)

const createApiClient = buildCreateApi(
  coreModule(),
  reactHooksModule({
    hooks: {
      useDispatch: createDispatchHook(FilesApiContext),
      useSelector: createSelectorHook(FilesApiContext),
      useStore: createStoreHook(FilesApiContext),
    },
  }),
)

export const filesApiClient = createApiClient({
  reducerPath: filesReducerPath,
  baseQuery: filesBaseQuery,
  endpoints: defineFilesEndpoints,
})

export const { useLoadFileMutation } = filesApiClient
