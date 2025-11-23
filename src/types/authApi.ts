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

export const TokenSchema = z.object({
  token: z.string().nonempty(),
})

export const PersonalDataTypeSchema = z.object({
  id: z.number(),
  typeTitle: z.string(),
  typeFlag: z.string(),
  triggerType: z.string()
})

export const PersonalDataSchema = z.object({
  requestId: z.number(),
  type: PersonalDataTypeSchema
})



export type Token = z.infer<typeof TokenSchema>
export type Right = z.infer<typeof RightSchema>
export type User = z.infer<typeof UserSchema>
export type PersonalDataRequest = z.infer<typeof PersonalDataSchema>