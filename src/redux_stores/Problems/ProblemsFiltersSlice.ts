import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ProblemsSPState {
  sectionList: number[] | null
  year: number | null
  tournament: number | null
}

const initialState: ProblemsSPState = {
  year: 2026,
  sectionList: null,
  tournament: null,
}

export const ProblemsFilterSlice = createSlice({
  name: "tournamentsPageFiltersSlice",
  initialState,
  reducers: {
    setYear(state, action: PayloadAction<number | null>) {
      console.log("PayloadYear", action.payload)
      state.year = action.payload
    },
    setSectionList(state, action: PayloadAction<number[] | null>) {
      console.log("PayloadSection", action.payload)
      state.sectionList = action.payload
    },
    setTournamentFilter(state, action: PayloadAction<number | null>) {
      state.tournament = action.payload
    },
  },
})

export const { setYear, setSectionList, setTournamentFilter } = ProblemsFilterSlice.actions
