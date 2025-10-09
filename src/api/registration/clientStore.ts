import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { registrationApiClient } from "./clientApiInterface"

export function makeRegistrationStoreClient() {
  const store = configureStore({
    reducer: {
      [registrationApiClient.reducerPath]: registrationApiClient.reducer,
    },
    middleware: (gDM) => gDM().concat(registrationApiClient.middleware),
  })
  setupListeners(store.dispatch)
  return store
}
export type RegistrationApiStoreClient = ReturnType<typeof makeRegistrationStoreClient>
