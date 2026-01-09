import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { TOURNAMENTS_API } from "@/constants/APIEndpoints"
import {
  FightActionInterface,
  fightActionSchema,
  FightContainerCard,
  FightContainerCardInterface,
  FightContainerInfoInterface,
  fightContainerInfoSchema,
  FightInfoByTournamentInterface,
  fightInfoByTournamentSchema,
  FightInformationInterface,
  fightInformationSchema,
  TeamInTournamentInterface,
  teamInTournamentSchema,
  TournamentCard,
  TournamentCardInterface,
  TournamentCreationRequest,
  TournamentResultsTableEntity,
} from "@/types/TournamentsAPI"
import { TournamentTypeIntarface, TournamentTypeSchema } from "@/types/TournamentTypeIntarface"
import { TournamentStateInterface, tournamentStateSchema } from "@/types/TournamentStateType"

export const tournamentsReducerPath = "tournamentsApi" as const

export const tournamentsBaseQuery = fetchBaseQuery({ baseUrl: TOURNAMENTS_API })

export const defineTournamentsEndpoints = (
  builder: EndpointBuilder<typeof tournamentsBaseQuery, never, typeof tournamentsReducerPath>,
) => ({
  getAvailableStates: builder.query({
    query: ({ year, tt }: { tt: number; year: number }) => `statuses?tournamentTypeId=${tt}&year=${year}`,
    transformResponse: (response: unknown): TournamentStateInterface[] => {
      const parsed = tournamentStateSchema.array().safeParse(response)
      if (parsed.success) return parsed.data
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

  getFightInformation: builder.query({
    query: ({ fightId }: { fightId: number }) => `fight_info/${fightId}`,
    transformResponse: (response: unknown): FightInformationInterface | null => {
      const parsed = fightInformationSchema.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing fight information: ${parsed.error}`)
      return null
    },
  }),
  getActionInformation: builder.query({
    query: ({ actionId }: { actionId: number }) => `action_table/${actionId}`,
    transformResponse: (response: unknown): FightActionInterface | null => {
      const parsed = fightActionSchema.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing action information: ${parsed.error}`)
      return null
    },
  }),
  getTeamInTournament: builder.query({
    query: ({ teamId }: { teamId: number }) => `team_in_tournament/${teamId}`,
    transformResponse: (response: unknown): TeamInTournamentInterface | null => {
      const parsed = teamInTournamentSchema.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing team information: ${parsed.error}`)
      return null
    },
  }),
  getFightInfoByTournament: builder.query({
    query: ({ tournamentId }: { tournamentId: number }) => `fights_info_by_tournament/${tournamentId}`,
    transformResponse: (response: unknown): FightInfoByTournamentInterface | null => {
      const parsed = fightInfoByTournamentSchema.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing team information: ${parsed.error}`)
      return null
    },
  }),
  getFightContainerInfo: builder.query({
    query: ({ fightContainerId }: { fightContainerId: number }) => `fight_container_info/${fightContainerId}`,
    transformResponse: (response: unknown): FightContainerInfoInterface | null => {
      const parsed = fightContainerInfoSchema.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing fight container information: ${parsed.error}`)
      return null
    },
  }),
  getAllTournamentCards: builder.query({
    query: () => `all_tournaments`,
    transformResponse: (response: unknown): TournamentCardInterface[] | null => {
      return response as any[]
      // const parsed = TournamentCard.array().safeParse(response)
      // if (parsed.success) return parsed.data
      // console.error(`Unexpected response while parsing tournament cards: ${parsed.error}`)
      // return null
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
      console.log("creating tournament response", response)
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
  closeRegistration: builder.mutation({
    query: ({ tournamentId, token }: { tournamentId: number; token: string }) => {
      const body = new FormData()
      body.set("tournamentId", tournamentId.toString())
      body.set("token", token.toString())
      return {
        url: "close_registration",
        method: "POST",
        body: body,
      }
    },
    transformResponse: (response: unknown): TournamentCardInterface | null => {
      const parsed = TournamentCard.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing tournament card: ${parsed.error}`)
      return null
    },
  }),
  getFightContainerCard: builder.query({
    query: ({ id }: { id: number }) => {
      return {
        url: `fight_container_card/${id}`,
        method: "GET",
      }
    },
    transformResponse: (response: unknown): FightContainerCardInterface | null => {
      const parsed = FightContainerCard.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing tournament card: ${parsed.error}`)
      return null
    },
  }),

  // TEMP ADMIN PANEL. DELETE AFTER FIRST RELEASE
  addFight: builder.mutation({
    query: ({ token, fightContainerId }: { token: string; fightContainerId: number }) => {
      return {
        url: `add_fight/${fightContainerId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
      }
    },
  }),

  setTeamsToFight: builder.mutation({
    query: ({ teams, fightId, token }: { teams: number[]; fightId: number; token: string }) => {
      return {
        url: `set_teams_to_fight/${fightId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: {
          teams: teams,
        },
      }
    },
  }),

  setJuryToFight: builder.mutation({
    query: ({ fightId, juries, token }: { fightId: number; juries: number[]; token: string }) => {
      return {
        url: `set_jury_to_fight/${fightId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: {
          juries: juries,
        },
      }
    },
  }),

  setLinkAndTimestampToFight: builder.mutation({
    query: ({
      token,
      timestamp,
      link,
      fightId,
    }: {
      token: string
      timestamp: number
      link: string
      fightId: number
    }) => {
      return {
        url: `set_link_and_timestamp_to_fight/${fightId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: {
          timestamp: timestamp,
          link: link,
        },
      }
    },
  }),

  addActionToFight: builder.mutation({
    query: ({ token, fightId }: { token: string; fightId: number }) => {
      return {
        url: `add_action_to_fight/${fightId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    },
  }),

  setDraftResult: builder.mutation({
    query: ({ token, problemId, actionId }: { token: string; problemId: number; actionId: number }) => {
      return {
        url: `set_draft_result/${actionId}/${problemId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    },
  }),

  setScores: builder.mutation({
    query: ({
      token,
      performanceId,
      scores,
    }: {
      token: string
      performanceId: number
      scores: { score: number; jury: number }[]
    }) => {
      return {
        url: `set_scores_to_perfomance/${performanceId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: {
          scores: scores,
        },
      }
    },
  }),

  setPlayerToPerformance: builder.mutation({
    query: ({ token, performanceId, playerId }: { token: string; performanceId: number; playerId: number }) => {
      return {
        url: `set_player_to_performance/${performanceId}/${playerId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    },
  }),
})
