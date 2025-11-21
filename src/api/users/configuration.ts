import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { USERS_API } from "@/constants/APIEndpoints"
import { User, UserSchema } from "@/types/UsersApi"

export const usersReducerPath = "usersApi" as const

export const usersBaseQuery = fetchBaseQuery({ baseUrl: USERS_API })

export const defineUsersEndpoints = (builder: EndpointBuilder<typeof usersBaseQuery, never, typeof usersReducerPath>) => ({
  getUserById: builder.query({
    query: ({ id }: { id: number }) => `user/${id}`,
    transformResponse: (response: unknown): User | null => {
      const user = UserSchema.safeParse(response)
      if (!user.success) {
        console.error(`Unexpected response while parsing user: ${user.error}`)
        return null
      }
      return user.data
    },
  }),
  findUsers: builder.query({
    query: ({ query }: { query: string }) => `users/find?query=${query}`,
    transformResponse: (response: unknown): User[] | null => {
      const users = UserSchema.array().safeParse(response)
      if (!users.success) {
        console.error(`Unexpected response while parsing users: ${users.error}`)
        return null
      }
      return users.data
    },
  }),
})
