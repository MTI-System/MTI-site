import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import cookies from "js-cookie"
import { TOURNAMENT_TYPE_KEY_NAME, TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"
import {TournamentTypeIntarface} from "@/types/TournamentTypeIntarface";
// import cookies from "next/headers"
interface SPState {
  tt: number | null
  availableTournamentTypes: TournamentTypeIntarface[] | null
}

const initialState: SPState = {
  tt: null,
  availableTournamentTypes: null
}

export const SPSlice = createSlice({
  name: "SearchParams",
  initialState,
  reducers: {
    setTT(state, action: PayloadAction<number>) {
      state.tt = Number(action.payload)
    },
    setAvailableTournamentTypes(state, action: PayloadAction<TournamentTypeIntarface[]>){
      state.availableTournamentTypes=action.payload
    }
  },
})

export const { setTT, setAvailableTournamentTypes } = SPSlice.actions
