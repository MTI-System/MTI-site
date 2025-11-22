import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { AUTH_API, FILES_API, FILES_SERVER } from "@/constants/APIEndpoints"
import { User, UserSchema } from "@/types/authApi"
import { FileLoadInterface, FileLoadSchema } from "@/types/FileLoadApi"

export const filesReducerPath = "filesApi" as const

export const filesBaseQuery = fetchBaseQuery({ baseUrl: FILES_API })

export const defineFilesEndpoints = (
  builder: EndpointBuilder<typeof filesBaseQuery, never, typeof filesReducerPath>,
) => ({
  loadFile: builder.mutation({
    query: ({ token, file }: { token: string; file: File }) => {
      const formData = new FormData()
      formData.set("token", token)
      formData.set("file", file)
      return {
        url: "add_file",
        method: "POST",
        body: formData,
      }
    },
    transformResponse: (response: string): FileLoadInterface | null => {
      const file = FileLoadSchema.safeParse(response)
      if (!file.success) {
        return null
      }
      return file.data
    },
  }),
})
