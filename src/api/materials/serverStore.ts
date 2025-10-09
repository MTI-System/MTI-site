import { configureStore } from "@reduxjs/toolkit"
import { materialsApiServer } from "@/api/materials/serverApiInterface"

export function makeMaterialsStoreServer() {
  return configureStore({
    reducer: {
      [materialsApiServer.reducerPath]: materialsApiServer.reducer,
    },
    middleware: (gDM) => gDM().concat(materialsApiServer.middleware),
  })
}
export type MaterialsApiStoreServer = ReturnType<typeof makeMaterialsStoreServer>
