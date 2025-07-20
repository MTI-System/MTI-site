import {createSlice, configureStore, PayloadAction} from '@reduxjs/toolkit'
import {useDispatch, useSelector, useStore} from "react-redux";
import {ttSlice} from "@/redux_stores/TournamentTypeSlice";
import {yearSlice} from "@/redux_stores/YearSlice";

export default function makeStore() {
  return configureStore({
    reducer: {
      tt: ttSlice.reducer,
      year: yearSlice.reducer,
    }
  })
}


export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()