import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TournamentStateFlagsInterface } from "@/types/TournamentStateType"

interface TournamentsSPState {
  year: number | null
  page: number | null
  state: TournamentStateFlagsInterface
}

const initialState: TournamentsSPState = {
  year: null,
  page: null,
  state: "all",
}

export const TournamentsPageFiltersSlice = createSlice({
  name: "tournamentsPageFiltersSlice",
  initialState,
  reducers: {
    setYear(state, action: PayloadAction<number>) {
      state.year = action.payload
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setState(state, action: PayloadAction<TournamentStateFlagsInterface>) {
      state.state = action.payload
    },
  },
})

export const { setYear, setPage, setState } = TournamentsPageFiltersSlice.actions
