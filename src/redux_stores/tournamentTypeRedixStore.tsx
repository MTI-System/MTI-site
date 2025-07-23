import {createSlice, configureStore, PayloadAction} from '@reduxjs/toolkit'
import {useDispatch, useSelector, useStore} from "react-redux";
import {SPSlice} from "@/redux_stores/SearchParamsSlice";
import {AuthSlice} from "@/redux_stores/AuthSlice";
import {SystemSlice} from "@/redux_stores/SystemSlice";

export default function makeStore() {
  return configureStore({
    reducer: {
      searchParams: SPSlice.reducer,
      auth: AuthSlice.reducer,
      system: SystemSlice.reducer,
    }
  })
}


export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()