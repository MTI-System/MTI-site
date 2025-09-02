import z from "zod"

export const TournamentCard = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  mainImage: z.string(),
  tournamentLogo: z.string(),
  year: z.number(),
})

export type TournamentCardInterface = z.infer<typeof TournamentCard>
