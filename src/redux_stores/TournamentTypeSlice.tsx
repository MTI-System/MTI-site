import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TTState {
  tt: string
}

const initialState: TTState = { tt: "ТЮФ" }

export const ttSlice = createSlice({
  name: "tt",
  initialState,
  reducers: {
    setTT(state, action: PayloadAction<string>) {
      state.tt = action.payload
    }
  }
})

export const { setTT } = ttSlice.actions