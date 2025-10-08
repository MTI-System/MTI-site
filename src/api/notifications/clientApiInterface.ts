"use client"

import React from "react"
import { createDispatchHook, createSelectorHook, createStoreHook } from "react-redux"
import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { reactHooksModule } from "@reduxjs/toolkit/query/react"
import {defineProblemsEndpoints, problemsBaseQuery, problemsReducerPath} from "@/api/problems/configuration";
import {
    defineNotificationsEndpoints,
    notificationsBaseQuery,
    notificationsReducerPath
} from "@/api/notifications/configuration";

export const NotificationsApiContext = React.createContext(null as any)

const createApiClient = buildCreateApi(
    coreModule(),
    reactHooksModule({
        hooks: {
            useDispatch: createDispatchHook(NotificationsApiContext),
            useSelector: createSelectorHook(NotificationsApiContext),
            useStore: createStoreHook(NotificationsApiContext),
        },
    })
)

export const notificationsApiClient = createApiClient({
    reducerPath: notificationsReducerPath,
    baseQuery: notificationsBaseQuery,
    endpoints: defineNotificationsEndpoints,
})

export const { useGetAllNotificationsQuery } = notificationsApiClient