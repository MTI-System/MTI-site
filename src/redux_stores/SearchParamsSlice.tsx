import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import cookies from "js-cookie";
import {TOURNAMENT_TYPE_KEY_NAME, TOURNAMENT_TYPE_SEARCH_PARAM_NAME} from "@/constants/CookieKeys";
// import cookies from "next/headers"
interface SPState {
  tt: string|null,
  year: number,
  isTTLocked: boolean,
}

const initialState: SPState = {
  tt: null,
  year: 2026,
  isTTLocked: false
}

export const SPSlice = createSlice({
  name: "SearchParams",
  initialState,
  reducers: {
    setTT(state, action: PayloadAction<string>) {
      // cookies.set(TOURNAMENT_TYPE_KEY_NAME, action.payload)
      // console.log("SET_TT", action.payload, cookies.get(TOURNAMENT_TYPE_KEY_NAME))
      state.tt = action.payload
    },
    setYear(state, action: PayloadAction<number>) {
      state.year = action.payload
    },
    setIsTTLocked(state, action: PayloadAction<boolean>) {
      state.isTTLocked = action.payload
    }
  }
})

export const { setTT, setYear, setIsTTLocked } = SPSlice.actions