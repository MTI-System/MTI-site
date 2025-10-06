import {configureStore} from "@reduxjs/toolkit";
import {useDispatch, useSelector, useStore} from "react-redux";
import {TournamentsPageFiltersSlice} from "@/redux_stores/Tournaments/TournamentsPageFiltersSlice";


export default function makeTournamentsStore() {
  return configureStore({
    devTools: {name: "Tournament store"},
    reducer: {
      tournamentsPageFilters: TournamentsPageFiltersSlice.reducer
    },
  })
}

export type TournamentsStore = ReturnType<typeof makeTournamentsStore>
export type RootTournamentsState = ReturnType<TournamentsStore["getState"]>
export type TournamentsDispatch = TournamentsStore["dispatch"]
