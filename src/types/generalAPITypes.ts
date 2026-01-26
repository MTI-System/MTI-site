import { z } from "zod"

export const BooleanResponseSchema = z.object({
  result: z.boolean(),
})

export type BooleanResponse = z.infer<typeof BooleanResponseSchema>
