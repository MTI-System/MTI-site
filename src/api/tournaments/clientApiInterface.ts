"use client"

import React from "react"
import { createDispatchHook, createSelectorHook, createStoreHook } from "react-redux"
import { buildCreateApi, coreModule } from "@reduxjs/toolkit/query"
import { reactHooksModule } from "@reduxjs/toolkit/query/react"
import {
  defineTournamentsEndpoints,
  tournamentsBaseQuery,
  tournamentsReducerPath,
} from "@/api/tournaments/configuration"

export const TournamentsApiContext = React.createContext(null as any)

const createApiClient = buildCreateApi(
  coreModule(),
  reactHooksModule({
    hooks: {
      useDispatch: createDispatchHook(TournamentsApiContext),
      useSelector: createSelectorHook(TournamentsApiContext),
      useStore: createStoreHook(TournamentsApiContext),
    },
  }),
)

export const tournamentsApiClient = createApiClient({
  reducerPath: tournamentsReducerPath,
  baseQuery: tournamentsBaseQuery,
  endpoints: defineTournamentsEndpoints,
})

export const {
  useCloseRegistrationMutation,
  useGetAvailableStatesQuery,
  useGetAvailableYearsQuery,
  useGetAvailableTournamentTypesQuery,
  useGetTournamentCardsQuery,
  useGetAllTournamentCardsQuery,
  useGetOrganizatorTournamentsMutation,
  useGetTournamentCardQuery,
  useGetTournamentTableQuery,
  useAddTournamentMutation,
  useGetFightInformationQuery,
  useGetActionInformationQuery,
  useGetTeamInTournamentQuery,
  useGetFightContainerInfoQuery,
  useGetFightInfoByTournamentQuery,
  useGetFightContainerCardQuery,


  // TMP ADMIN PANEL. DELETE IN FUTURE
  useAddFightMutation,
  useSetTeamsToFightMutation, //maked
  useSetJuryToFightMutation,
  useSetLinkAndTimestampToFightMutation, // maked
  useAddActionToFightMutation, // Не хочу это делать
  useSetDraftResultMutation, // maked
  useSetScoresMutation,
  useSetPlayerToPerformanceMutation

} = tournamentsApiClient
