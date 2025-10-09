import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { problemsBaseQuery, problemsReducerPath, defineProblemsEndpoints } from "./configuration"

const createApiServer = buildCreateApi(coreModule())

export const problemsApiServer = createApiServer({
  reducerPath: problemsReducerPath,
  baseQuery: problemsBaseQuery,
  endpoints: defineProblemsEndpoints,
})
