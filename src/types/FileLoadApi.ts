import { z } from "zod"

export const FileLoadSchema = z.object({
  filename: z.string(),
})

export type FileLoadInterface = z.infer<typeof FileLoadSchema>
