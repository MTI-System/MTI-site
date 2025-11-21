import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { tournamentsBaseQuery, tournamentsReducerPath, defineTournamentsEndpoints } from "./configuration"

const createApiServer = buildCreateApi(coreModule())

export const tournamentsApiServer = createApiServer({
  reducerPath: tournamentsReducerPath,
  baseQuery: tournamentsBaseQuery,
  endpoints: defineTournamentsEndpoints,
})
