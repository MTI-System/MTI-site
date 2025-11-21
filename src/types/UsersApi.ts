import { z } from "zod"

export const UserSchema = z.object({
  id: z.number(),
  auth: z.number(),
  firstName: z.string(),
  secondName: z.string(),
  thirdName: z.string(),
  birthday: z.number(),
})

export type User = z.infer<typeof UserSchema>