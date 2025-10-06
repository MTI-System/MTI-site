import { z } from "zod"

export const TournamentRegistrationFormField = z.object(
  {
    id: z.number(),
    type: z.string(),
    title: z.string(),
    key: z.string(),
  }
)

export const TournamentRegistrationFormInfo = z.object({
  id: z.number(),
  tournament: z.number(),
  fields: z.array(TournamentRegistrationFormField),
})



export type TournamentRegistrationFormInfoInterface = z.infer<typeof TournamentRegistrationFormInfo>
export type TournamentRegistrationFormFieldInterface = z.infer<typeof TournamentRegistrationFormField>