import { ProblemSectionInterface } from "@/types/problemAPI"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface SectionsState {
  isLoaded: boolean
  sections: ProblemSectionInterface[] | null
}

const initialState: SectionsState = {
  sections: null,
  isLoaded: false,
}

export const ProblemsSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {
    setSections: (state, action: PayloadAction<ProblemSectionInterface[] | null>) => {
      state.sections = action.payload
    },
    setIsLoaded: (state) => {
      state.isLoaded = true
    },
  },
})

export const { setSections, setIsLoaded } = ProblemsSlice.actions
