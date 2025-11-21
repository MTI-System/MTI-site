import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { materialsBaseQuery, materialsReducerPath, defineMaterialsEndpoints } from "./configuration"

const createApiServer = buildCreateApi(coreModule())

export const materialsApiServer = createApiServer({
  reducerPath: materialsReducerPath,
  baseQuery: materialsBaseQuery,
  endpoints: defineMaterialsEndpoints,
})
