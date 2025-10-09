import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { TOURNAMENTS_API } from "@/constants/APIEndpoints"
import { TournamentCard, TournamentCardInterface, TournamentResultsTableEntity } from "@/types/TournamentsAPI"
import { TournamentTypeIntarface, TournamentTypeSchema } from "@/types/TournamentTypeIntarface"

export const tournamentsReducerPath = "tournamentsApi" as const

export const tournamentsBaseQuery = fetchBaseQuery({ baseUrl: TOURNAMENTS_API })

export const defineTournamentsEndpoints = (
  builder: EndpointBuilder<typeof tournamentsBaseQuery, never, typeof tournamentsReducerPath>,
) => ({
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
