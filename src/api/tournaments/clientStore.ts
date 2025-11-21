import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { tournamentsApiClient } from "./clientApiInterface"

export function makeTournamentsStoreClient() {
  const store = configureStore({
    reducer: {
      [tournamentsApiClient.reducerPath]: tournamentsApiClient.reducer,
    },
    middleware: (gDM) => gDM().concat(tournamentsApiClient.middleware),
  })
  setupListeners(store.dispatch)
  return store
}
export type TournamentsApiStoreClient = ReturnType<typeof makeTournamentsStoreClient>
