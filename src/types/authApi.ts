import { z } from "zod"

export const RightSchema = z.object({
  id: z.number(),
  right_title: z.string().nonempty(),
  right_flag: z.string().nonempty(),
})

export const UserSchema = z.object({
  user_id: z.number(),
  username: z.string().nonempty(),
  email: z.email(),
  rights: z.array(RightSchema),
})

export type Right = z.infer<typeof RightSchema>
export type User = z.infer<typeof UserSchema>
