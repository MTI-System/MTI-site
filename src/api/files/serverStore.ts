import { configureStore } from "@reduxjs/toolkit"
import { notificationsApiServer } from "@/api/notifications/serverApiInterface"
import { authApiServer } from "@/api/auth/serverApiInterface"
import { filesApiServer } from "@/api/files/serverApiInterface"

export function makeFilesStoreServer() {
  return configureStore({
    reducer: {
      [filesApiServer.reducerPath]: filesApiServer.reducer,
    },
    middleware: (gDM) => gDM().concat(filesApiServer.middleware),
  })
}
export type AuthApiStoreServer = ReturnType<typeof makeFilesStoreServer>
