import { configureStore } from "@reduxjs/toolkit"
import { usersApiServer } from "./serverApiInterface"

export function makeUsersStoreServer() {
  return configureStore({
    reducer: {
      [usersApiServer.reducerPath]: usersApiServer.reducer,
    },
    middleware: (gDM) => gDM().concat(usersApiServer.middleware),
  })
}
export type UsersApiStoreServer = ReturnType<typeof makeUsersStoreServer>
