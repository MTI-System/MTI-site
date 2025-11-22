import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { authBaseQuery, authReducerPath, defineAuthEndpoints } from "./configuration"

const createApiServer = buildCreateApi(coreModule())

export const authApiServer = createApiServer({
  reducerPath: authReducerPath,
  baseQuery: authBaseQuery,
  endpoints: defineAuthEndpoints,
})
