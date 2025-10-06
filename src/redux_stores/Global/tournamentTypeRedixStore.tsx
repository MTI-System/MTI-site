import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit"
import { useDispatch, useSelector, useStore } from "react-redux"
import { SPSlice } from "@/redux_stores/Global/SearchParamsSlice"
import { AuthSlice } from "@/redux_stores/Global/AuthSlice"
import { SystemSlice } from "@/redux_stores/Global/SystemSlice"
import { ProblemsSlice } from "@/redux_stores/Global/ProblemSlice"
import {TournamentTypeIntarface} from "@/types/TournamentTypeIntarface";

export default function makeStore(theme: string, tt: number, token: string, year: string | null, availableTournamentTypes: TournamentTypeIntarface[]) {
  return configureStore({
    devTools: {name: "Global store"},
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
        availableTournamentTypes: availableTournamentTypes,
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
