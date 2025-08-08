import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import cookies from "js-cookie";
import {TOURNAMENT_TYPE_KEY_NAME, TOURNAMENT_TYPE_SEARCH_PARAM_NAME} from "@/constants/CookieKeys";
// import cookies from "next/headers"
interface SPState {
  tt: string|null,
  year: number|null,
  // isTTLocked: boolean,
}

const initialState: SPState = {
  tt: null,
  year: 2026,
  // isTTLocked: false
}

export const SPSlice = createSlice({
  name: "SearchParams",
  initialState,
  reducers: {
    setTT(state, action: PayloadAction<string>) {
      state.tt = action.payload
    },
    setYear(state, action: PayloadAction<number|null>) {
      state.year = action.payload
    },
  }
})

export const { setTT, setYear } = SPSlice.actions