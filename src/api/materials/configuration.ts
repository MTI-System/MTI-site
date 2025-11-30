import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { MATERIAL_API } from "@/constants/APIEndpoints"
import {
  AddEmbeddingResponseSchema,
  EmbeddingInterface,
  EmbeddingSchema,
  EmbeddingTypeInterface,
  EmbeddingTypeSchema,
} from "@/types/embeddings"

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
  addMaterial: builder.mutation({
    query: ({
      content,
      materialTitle,
      contentType,
      token,
    }: {
      content: string
      materialTitle: string
      contentType: number
      token: string
    }) => {
      const fd = new FormData()
      fd.set("content", content)
      fd.set("materialTitle", materialTitle)
      fd.set("contentType", contentType.toString())
      fd.set("token", token)
      return {
        url: "add_material",
        method: "POST",
        body: fd,
      }
    },
    transformResponse: (response: unknown): number | null => {
      if (!response) return null
      const parsed = AddEmbeddingResponseSchema.safeParse(response)
      if (parsed.success) return parsed.data
      console.error(`Unexpected response while parsing add embedding response: ${parsed.error}`)
      return null
    },
  }),
  deleteMaterial: builder.mutation({
    query: ({ id, token }: { id: number; token: string }) => {
      const fd = new FormData()
      fd.set("token", token)
      return {
        url: `delete_material/${id}`,
        method: "DELETE",
        body: fd,
      }
    },
    transformResponse: (response: unknown): null => {
      return null
    },
  }),
})
