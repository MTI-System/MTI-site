"use client"

import React from "react"
import { createDispatchHook, createSelectorHook, createStoreHook } from "react-redux"
import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { reactHooksModule } from "@reduxjs/toolkit/query/react"
import {defineProblemsEndpoints, problemsBaseQuery, problemsReducerPath} from "@/api/problems/configuration";

export const ProblemsApiContext = React.createContext(null as any)

const createApiClient = buildCreateApi(
    coreModule(),
    reactHooksModule({
        hooks: {
            useDispatch: createDispatchHook(ProblemsApiContext),
            useSelector: createSelectorHook(ProblemsApiContext),
            useStore: createStoreHook(ProblemsApiContext),
        },
    })
)

export const problemsApiClient = createApiClient({
    reducerPath: problemsReducerPath,
    baseQuery: problemsBaseQuery,
    endpoints: defineProblemsEndpoints,
})