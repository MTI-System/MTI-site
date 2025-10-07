import { configureStore } from "@reduxjs/toolkit"
import { ProblemsFilterSlice } from "@/redux_stores/Problems/ProblemsFiltersSlice"
import { useDispatch, useSelector, useStore } from "react-redux"
import problemsApi from "@/api/problemsApiRTK"

export default function makeProblemsStore() {
  return configureStore({
    reducer: {
      problemsPageFilters: ProblemsFilterSlice.reducer,
      [problemsApi.reducerPath]: problemsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(problemsApi.middleware),
  })
}

export type ProblemsStore = ReturnType<typeof makeProblemsStore>
export type RootProblemsState = ReturnType<ProblemsStore["getState"]>
export type ProblemsDispatch = ProblemsStore["dispatch"]
