import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { usersBaseQuery, usersReducerPath, defineUsersEndpoints } from "./configuration"

const createApiServer = buildCreateApi(coreModule())

export const usersApiServer = createApiServer({
  reducerPath: usersReducerPath,
  baseQuery: usersBaseQuery,
  endpoints: defineUsersEndpoints,
})
