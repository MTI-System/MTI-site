import { z } from "zod"

export const TournamentTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  longName: z.string(),
  color: z.string(),
})

export type TournamentTypeIntarface = z.infer<typeof TournamentTypeSchema>
