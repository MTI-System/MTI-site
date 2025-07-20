import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import cookies from "js-cookie";
import {TOURNAMENT_TYPE_KEY_NAME, TOURNAMENT_TYPE_SEARCH_PARAM_NAME} from "@/constants/CookieKeys";

interface SPState {
  tt: string,
  year: number
}

const initialState: SPState = {
  tt: "ТЮФ",
  year: 2026
}

export const SPSlice = createSlice({
  name: "SearchParams",
  initialState,
  reducers: {
    setTT(state, action: PayloadAction<string>) {
      cookies.set(TOURNAMENT_TYPE_KEY_NAME, action.payload)
      console.log("SET_TT", action.payload, cookies.get(TOURNAMENT_TYPE_KEY_NAME))
      state.tt = action.payload
    },
    setYear(state, action: PayloadAction<number>) {
      state.year = action.payload
    }
  }
})

export const { setTT, setYear } = SPSlice.actions