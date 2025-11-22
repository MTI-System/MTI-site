import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { notificationsApiClient } from "@/api/notifications/clientApiInterface"
import { authApiClient } from "./clientApiInterface"

export function makeAuthStoreClient() {
  const store = configureStore({
    reducer: {
      [authApiClient.reducerPath]: authApiClient.reducer,
    },
    middleware: (gDM) => gDM().concat(authApiClient.middleware),
  })
  setupListeners(store.dispatch)
  return store
}
export type AuthApiStoreClient = ReturnType<typeof makeAuthStoreClient>
