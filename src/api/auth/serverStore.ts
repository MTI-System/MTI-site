import { configureStore } from "@reduxjs/toolkit"
import { notificationsApiServer } from "@/api/notifications/serverApiInterface"
import { authApiServer } from "@/api/auth/serverApiInterface"

export function makeAuthStoreServer() {
  return configureStore({
    reducer: {
      [authApiServer.reducerPath]: authApiServer.reducer,
    },
    middleware: (gDM) => gDM().concat(authApiServer.middleware),
  })
}
export type AuthApiStoreServer = ReturnType<typeof makeAuthStoreServer>
