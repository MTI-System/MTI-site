import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import {
    defineNotificationsEndpoints,
    notificationsBaseQuery,
    notificationsReducerPath
} from "./configuration"

const createApiServer = buildCreateApi(coreModule())

export const notificationsApiServer = createApiServer({
    reducerPath: notificationsReducerPath,
    baseQuery: notificationsBaseQuery,
    endpoints: defineNotificationsEndpoints,
})