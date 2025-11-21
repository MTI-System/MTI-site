import { configureStore } from "@reduxjs/toolkit"
import { ProblemsFilterSlice } from "@/redux_stores/Problems/ProblemsFiltersSlice"
export default function makeProblemsStore() {
  return configureStore({
    reducer: {
      problemsPageFilters: ProblemsFilterSlice.reducer,
    },
  })
}

export type ProblemsStore = ReturnType<typeof makeProblemsStore>
export type RootProblemsState = ReturnType<ProblemsStore["getState"]>
export type ProblemsDispatch = ProblemsStore["dispatch"]
