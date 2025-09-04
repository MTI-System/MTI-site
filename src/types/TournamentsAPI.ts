import { z } from "zod"

export const TournamentCard = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  mainImage: z.string(),
  tournamentLogo: z.string(),
  year: z.number(),
  tournament_status: z.string(),
})

export const TournamentScoreEntity = z.object({
  fight_container_id: z.number(),
  fight_container_name: z.string(),
  score: z.number(),
})

export const TournamentResultsTableLine = z.object({
  team_id: z.number(),
  team_name: z.string(),
  is_unknown_team: z.boolean(),
  scores: z.array(TournamentScoreEntity),
  resultScore: z.number(),
})

export const TournamentResultsTableEntity = z.object({
  table_lines: z.array(TournamentResultsTableLine),
})

export type TournamentResultsTableEntity = z.infer<typeof TournamentResultsTableEntity>
export type TournamentCardInterface = z.infer<typeof TournamentCard>