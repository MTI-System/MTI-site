import { z } from "zod"

export const UserSchema = z.object({
  id: z.number(),
  auth: z.number().nullable().optional(),
  firstName: z.string(),
  secondName: z.string(),
  thirdName: z.string(),
  birthday: z.number().optional(),
  email: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>
