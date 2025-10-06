import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface TournamentsSPState {
  year: number | null
  page:  number | null
}

const initialState: TournamentsSPState = {
  year: null,
  page: null,
}

export const TournamentsPageFiltersSlice = createSlice({
  name: "tournamentsPageFiltersSlice",
  initialState,
  reducers: {
    setYear(state, action: PayloadAction<number>) {
      state.year = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    }
  },
})

export const {setYear, setPage} = TournamentsPageFiltersSlice.actions;