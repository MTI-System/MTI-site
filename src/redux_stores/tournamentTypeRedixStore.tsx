import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit"
import { useDispatch, useSelector, useStore } from "react-redux"
import { SPSlice } from "@/redux_stores/SearchParamsSlice"
import { AuthSlice } from "@/redux_stores/AuthSlice"
import { SystemSlice } from "@/redux_stores/SystemSlice"
import { ProblemsSlice } from "@/redux_stores/ProblemSlice"
import { ProblemSectionInterface } from "@/types/problemAPI"

export default function makeStore(theme: string, tt: string, token: string, year: string | null) {
  return configureStore({
    reducer: {
      searchParams: SPSlice.reducer,
      auth: AuthSlice.reducer,
      system: SystemSlice.reducer,
      problems: ProblemsSlice.reducer,
    },
    preloadedState: {
      system: {
        theme: theme,
        isPending: false,
      },
      searchParams: {
        tt: tt,
        year: year === null ? null : Number(year),
        sectionList: null,
      },
      auth: {
        token: token,
        isAuthenticated: token.length > 0,
        authInfo: null,
      },
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
