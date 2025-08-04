import z from "zod"

export const EmbeddingTypeSchema = z.object({
  id: z.number(),
  type_name: z.string(),
  icon_source: z.string(),
})

export type EmbeddingTypeInterface = z.infer<typeof EmbeddingTypeSchema>

export const EmbeddingMetadataSchema = z.record(z.string(), z.union([z.string(), z.number()])).and(
  z.object({
    extension: z.string().optional(),
    is_external: z.string().optional(),
  })
)

export type EmbeddingmetadataInterface = z.infer<typeof EmbeddingMetadataSchema>

export const EmbeddingSchema = z.object({
  id: z.number(),
  title: z.string(),
  content_type: EmbeddingTypeSchema,
  content: z.string(),
  metadata: EmbeddingMetadataSchema,
})

export type EmbeddingInterface = z.infer<typeof EmbeddingSchema>
