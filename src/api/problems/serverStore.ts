import { configureStore } from "@reduxjs/toolkit"
import { problemsApiServer } from "@/api/problems/serverApiInterface"

export function makeProblemsStoreServer() {
  return configureStore({
    reducer: {
      [problemsApiServer.reducerPath]: problemsApiServer.reducer,
    },
    middleware: (gDM) => gDM().concat(problemsApiServer.middleware),
  })
}
export type ProblemsApiStoreServer = ReturnType<typeof makeProblemsStoreServer>
