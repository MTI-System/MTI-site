import { configureStore } from "@reduxjs/toolkit"
import { registrationApiServer } from "@/api/registration/serverApiInterface"

export function makeRegistrationStoreServer() {
  return configureStore({
    reducer: {
      [registrationApiServer.reducerPath]: registrationApiServer.reducer,
    },
    middleware: (gDM) => gDM().concat(registrationApiServer.middleware),
  })
}
export type RegistrationApiStoreServer = ReturnType<typeof makeRegistrationStoreServer>
