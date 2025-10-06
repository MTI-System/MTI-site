import { z } from "zod"

export const FightContainerCard = z.object({
  id: z.number(),
  title: z.string(),
})

export const TournamentCard = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  main_image: z.string(),
  tournament_logo: z.string(),
  year: z.number(),
  tournament_status: z.string(),
  fight_containers_cards: z.array(FightContainerCard),
  materials: z.array(z.number()),
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