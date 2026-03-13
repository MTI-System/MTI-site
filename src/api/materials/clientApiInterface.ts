"use client"

import React from "react"
import { createDispatchHook, createSelectorHook, createStoreHook } from "react-redux"
import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { reactHooksModule } from "@reduxjs/toolkit/query/react"
import { defineMaterialsEndpoints, materialsBaseQuery, materialsReducerPath } from "@/api/materials/configuration"

export const MaterialsApiContext = React.createContext(null as any)

const createApiClient = buildCreateApi(
  coreModule(),
  reactHooksModule({
    hooks: {
      useDispatch: createDispatchHook(MaterialsApiContext),
      useSelector: createSelectorHook(MaterialsApiContext),
      useStore: createStoreHook(MaterialsApiContext),
    },
  }),
)

export const materialsApiClient = createApiClient({
  reducerPath: materialsReducerPath,
  baseQuery: materialsBaseQuery,
  endpoints: defineMaterialsEndpoints,
})

export const {
  useGetMaterialListQuery,
  useGetAvailableContentTypesQuery,
  useAddMaterialMutation,
  useDeleteMaterialMutation,
} = materialsApiClient
