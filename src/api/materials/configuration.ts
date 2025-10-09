import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { MATERIAL_API } from "@/constants/APIEndpoints"
import { EmbeddingInterface, EmbeddingSchema, EmbeddingTypeInterface, EmbeddingTypeSchema } from "@/types/embeddings"

export const materialsReducerPath = "materialsApi" as const

export const materialsBaseQuery = fetchBaseQuery({ baseUrl: MATERIAL_API })

export const defineMaterialsEndpoints = (
  builder: EndpointBuilder<typeof materialsBaseQuery, never, typeof materialsReducerPath>,
) => ({
  getMaterialList: builder.query({
    query: ({ ids }: { ids: number[] }) => `get_material_list?ids=${ids.toString()}`,
    transformResponse: (response: unknown): EmbeddingInterface[] | null => {
      const parsed = EmbeddingSchema.array().safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing material data: ${parsed.error}`)
      return null
    },
  }),
  getAvailableContentTypes: builder.query({
    query: () => "get_available_content_types",
    transformResponse: (response: unknown): EmbeddingTypeInterface[] | null => {
      const parsed = EmbeddingTypeSchema.array().safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing content types: ${parsed.error}`)
      return null
    },
  }),
})
