import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TournamentCardInterface} from "@/types/TournamentsAPI";

interface TournamentsSliceState {
    tournament: TournamentCardInterface| null
}

const initialState: TournamentsSliceState = {
    tournament: null,
}

export const TournamentPageSlice = createSlice({
    name: "tournamentPageSlice",
    initialState,
    reducers: {
        setTournament(state, action: PayloadAction<TournamentCardInterface>) {
            state.tournament = action.payload;
        },

    },
})

export const {setTournament} = TournamentPageSlice.actions;