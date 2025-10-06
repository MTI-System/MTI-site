import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ProblemsSPState {
    sectionList: number[] | null;
    year: number| null;
}

const initialState: ProblemsSPState = {
    year: 2026,
    sectionList: null,
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
    },
})

export const {setYear, setSectionList} = ProblemsFilterSlice.actions;