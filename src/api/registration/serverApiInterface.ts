import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { registrationBaseQuery, registrationReducerPath, defineRegistrationEndpoints } from "./configuration"

const createApiServer = buildCreateApi(coreModule())

export const registrationApiServer = createApiServer({
  reducerPath: registrationReducerPath,
  baseQuery: registrationBaseQuery,
  endpoints: defineRegistrationEndpoints,
})
