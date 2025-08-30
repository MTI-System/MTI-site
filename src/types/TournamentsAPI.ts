import { z } from "zod"

export const TournamentCard = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  mainImage: z.string(),
  tournamentLogo: z.string(),
  year: z.number(),
  tournamentStatus: z.string(),
})

export const TournamentScoreEntity = z.object({
  fightContainerId: z.number(),
  fightContainerName: z.string(),
  score: z.number(),
})

export const TournamentResultsTableLine = z.object({
  teamId: z.number(),
  teamName: z.string(),
  isUnknownTeam: z.boolean(),
  scores: z.array(TournamentScoreEntity),
  resultScore: z.number(),
})

export const TournamentResultsTableEntity = z.object({
  tableLines: z.array(TournamentResultsTableLine),
})

export type TournamentResultsTableEntity = z.infer<typeof TournamentResultsTableEntity>
export type TournamentCardInterface = z.infer<typeof TournamentCard>