import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { usersApiClient } from "./clientApiInterface"

export function makeUsersStoreClient() {
  const store = configureStore({
    reducer: {
      [usersApiClient.reducerPath]: usersApiClient.reducer,
    },
    middleware: (gDM) => gDM().concat(usersApiClient.middleware),
  })
  setupListeners(store.dispatch)
  return store
}
export type UsersApiStoreClient = ReturnType<typeof makeUsersStoreClient>
export type UsersApiDispatch = UsersApiStoreClient["dispatch"]
