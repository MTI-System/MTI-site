import { configureStore } from "@reduxjs/toolkit"
import { tournamentsApiServer } from "@/api/tournaments/serverApiInterface"

export function makeTournamentsStoreServer() {
  return configureStore({
    reducer: {
      [tournamentsApiServer.reducerPath]: tournamentsApiServer.reducer,
    },
    middleware: (gDM) => gDM().concat(tournamentsApiServer.middleware),
  })
}
export type TournamentsApiStoreServer = ReturnType<typeof makeTournamentsStoreServer>
