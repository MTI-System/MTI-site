import { configureStore } from "@reduxjs/toolkit"
import { TournamentPageSlice } from "@/redux_stores/TournamentPage/TournamentPageSlice"
import { TournamentCardInterface } from "@/types/TournamentsAPI"

export default function makeTournamentPageStore(tournament: TournamentCardInterface) {
  return configureStore({
    devTools: { name: "Tournament page store" },
    preloadedState: {
      tournamentPage: {
        tournament: tournament,
      },
    },
    reducer: {
      tournamentPage: TournamentPageSlice.reducer,
    },
  })
}

export type TournamentPageStore = ReturnType<typeof makeTournamentPageStore>
export type RootTournamentPageState = ReturnType<TournamentPageStore["getState"]>
export type TournamentPageDispatch = TournamentPageStore["dispatch"]
