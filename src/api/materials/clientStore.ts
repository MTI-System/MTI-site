import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { materialsApiClient } from "./clientApiInterface"

export function makeMaterialsStoreClient() {
  const store = configureStore({
    reducer: {
      [materialsApiClient.reducerPath]: materialsApiClient.reducer,
    },
    middleware: (gDM) => gDM().concat(materialsApiClient.middleware),
  })
  setupListeners(store.dispatch)
  return store
}
export type MaterialsApiStoreClient = ReturnType<typeof makeMaterialsStoreClient>
