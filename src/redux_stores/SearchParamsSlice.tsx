import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import cookies from "js-cookie"
import { TOURNAMENT_TYPE_KEY_NAME, TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"
// import cookies from "next/headers"
interface SPState {
  tt: string | null
  year: number | null
  sectionList: number[] | null
}

const initialState: SPState = {
  tt: null,
  year: 2026,
  sectionList: null,
}

export const SPSlice = createSlice({
  name: "SearchParams",
  initialState,
  reducers: {
    setTT(state, action: PayloadAction<string>) {
      state.tt = action.payload
    },
    setYear(state, action: PayloadAction<number | null>) {
      console.log("PayloadYear", action.payload)
      state.year = action.payload
    },
    setSectionList(state, action: PayloadAction<number[] | null>) {
      console.log("PayloadSection", action.payload)
      state.sectionList = action.payload
    },
  },
})

export const { setTT, setYear, setSectionList } = SPSlice.actions
