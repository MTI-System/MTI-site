import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { TOURNAMENTS_API } from "@/constants/APIEndpoints"
import {
  TournamentCard,
  TournamentCardInterface,
  TournamentCreationRequest,
  TournamentResultsTableEntity,
} from "@/types/TournamentsAPI"
import { TournamentTypeIntarface, TournamentTypeSchema } from "@/types/TournamentTypeIntarface"
import { TournamentState } from "@/types/TournamentStateType"

export const tournamentsReducerPath = "tournamentsApi" as const

export const tournamentsBaseQuery = fetchBaseQuery({ baseUrl: TOURNAMENTS_API })

export const defineTournamentsEndpoints = (
  builder: EndpointBuilder<typeof tournamentsBaseQuery, never, typeof tournamentsReducerPath>,
) => ({
  getAvailableStates: builder.query({
    query: ({ year, tt }: { tt: number; year: number }) => `statuses?tournamentTypeId=${tt}&year=${year}`,
    transformResponse: (response: unknown): TournamentState[] => {
      if (Array.isArray(response)) return response
      return []
    },
  }),
  getAvailableYears: builder.query({
    query: ({ tt }: { tt: number }) => `years?tournamentTypeId=${tt}`,
    transformResponse: (response: unknown): number[] => {
      if (Array.isArray(response)) return response
      return [new Date().getFullYear()]
    },
  }),
  getAvailableTournamentTypes: builder.query({
    query: () => "get_available_tt",
    transformResponse: (response: unknown): TournamentTypeIntarface[] | null => {
      const parsed = TournamentTypeSchema.array().safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing tournament types: ${parsed.error}`)
      return null
    },
  }),
  getTournamentCards: builder.query({
    query: ({ tt, year }: { tt: number; year: number }) => `get_tournament_cards_by_year_and_tt?tt=${tt}&year=${year}`,
    transformResponse: (response: unknown): TournamentCardInterface[] | null => {
      const parsed = TournamentCard.array().safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing tournament cards: ${parsed.error}`)
      return null
    },
  }),
  getOrganizatorTournaments: builder.mutation({
    query: ({ tt, year, token }: { tt: number; year: number; token: string }) => {
      const formData = new FormData()
      formData.set("token", token)
      formData.set("year", year.toString())
      formData.set("tournamentType", tt.toString())
      return {
        url: "get_organizator_tournaments",
        method: "POST",
        body: formData,
      }
    },
    transformResponse: (response: unknown): TournamentCardInterface[] | null => {
      const parsed = TournamentCard.array().safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing tournament cards: ${parsed.error}`)
      return null
    },
  }),
  addTournament: builder.mutation({
    query: ({ tournamentObject }: { tournamentObject: TournamentCreationRequest }) => {
      return {
        url: "create_tournament",
        method: "PUT",
        body: tournamentObject,
      }
    },
    transformResponse: (response: unknown): TournamentCardInterface | null => {
      const parsed = TournamentCard.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing organizator tournaments: ${parsed.error}`)
      return null
    },
  }),

  getTournamentCard: builder.query({
    query: ({ id }: { id: number }) => `get_tournament_card/${id}`,
    transformResponse: (response: unknown): TournamentCardInterface | null => {
      const parsed = TournamentCard.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing tournament card: ${parsed.error}`)
      return null
    },
  }),
  getTournamentTable: builder.query({
    query: ({ id }: { id: number }) => `get_tournament_table/${id}`,
    transformResponse: (response: unknown): TournamentResultsTableEntity | null => {
      const parsed = TournamentResultsTableEntity.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing tournament table: ${parsed.error}`)
      return null
    },
  }),
})
