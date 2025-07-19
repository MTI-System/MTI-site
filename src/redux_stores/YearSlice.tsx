import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface YearState {
  year: number
}

const initialState: YearState = { year: 2025}

export const yearSlice = createSlice({
  name: "year",
  initialState,
  reducers: {
    setYear(state, action: PayloadAction<number>) {
      state.year = action.payload
    }
  }
})

export const { setYear } = yearSlice.actions