import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface SystemState {
  theme: string
  isPending: boolean
}

const initialState: SystemState = {
  theme: "light",
  isPending: false,
}

export const SystemSlice = createSlice({
  name: "System",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload
    },
    setIsPending: (state, action: PayloadAction<boolean>) => {
      state.isPending = action.payload
    },
  },
})

export const { setTheme, setIsPending } = SystemSlice.actions
