import z from "zod"

export const EmbeddingTypeSchema = z.object({
  id: z.number(),
  typeName: z.string(),
  iconSource: z.string(),
})

export type EmbeddingTypeInterface = z.infer<typeof EmbeddingTypeSchema>

export const EmbeddingMetadataSchema = z.record(z.string(), z.union([z.string(), z.number()]))

export type EmbeddingmetadataInterface = z.infer<typeof EmbeddingMetadataSchema>

export const EmbeddingSchema = z.object({
  id: z.number(),
  title: z.string(),
  content_type: EmbeddingTypeSchema,
  content: z.string(),
  metadata: EmbeddingMetadataSchema,
})

export type EmbeddingInterface = z.infer<typeof EmbeddingSchema>
