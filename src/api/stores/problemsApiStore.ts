import { configureStore } from "@reduxjs/toolkit/react"
import problemsApi from "../problemsApiRTK"

export default function makeProblemsApiStore() {
  return configureStore({
    reducer: {
      [problemsApi.reducerPath]: problemsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(problemsApi.middleware),
  })
}

export type ProblemsStore = ReturnType<typeof makeProblemsApiStore>
export type RootProblemsState = ReturnType<ProblemsStore["getState"]>
export type ProblemsDispatch = ProblemsStore["dispatch"]
