import { z } from "zod"

export const tournamentStateFlagsSchema = z.union([
  z.literal("all"),
  z.literal("FUTURED"),
  z.literal("REGISTRATION"),
  z.literal("PROCESSING"),
  z.literal("ENDED"),
])

export type TournamentStateFlagsInterface = z.infer<typeof tournamentStateFlagsSchema>

export const tournamentStateSchema = z.object({
  id: z.number(),
  status_color: z.string().min(7).max(9),
  status_title: z.string(),
  status_flag: tournamentStateFlagsSchema,
})

export type TournamentStateInterface = z.infer<typeof tournamentStateSchema>
