import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import {  defineFilesEndpoints, filesBaseQuery, filesReducerPath,
} from "./configuration"

const createApiServer = buildCreateApi(coreModule())

export const filesApiServer = createApiServer({
    reducerPath: filesReducerPath,
    baseQuery: filesBaseQuery,
    endpoints: defineFilesEndpoints,
})