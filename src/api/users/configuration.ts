import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { USERS_API } from "@/constants/APIEndpoints"
import { User, UserSchema } from "@/types/UsersApi"
import { io, Socket } from "socket.io-client"

export const usersReducerPath = "usersApi" as const

export const usersBaseQuery = fetchBaseQuery({ baseUrl: USERS_API })

export const defineUsersEndpoints = (
  builder: EndpointBuilder<typeof usersBaseQuery, never, typeof usersReducerPath>,
) => ({
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
  requestEmailVerification: builder.mutation<string, { email: string }>({
    queryFn: async ({ email }) => {
      const socket = await getSocket()
      return new Promise((resolve, reject) => {
        socket.emit(email, (response: string) => {
          resolve({data: response})
        })
      })
    },
  }),
  verifyEmail: builder.query<string | null, void>({
    queryFn: () => { return { data: null } },
    async onCacheEntryAdded(
      arg,
      { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
    ) {
      const socket = await getSocket()
      try{
        await cacheDataLoaded
        socket.on("message", (message: string) => {
          updateCachedData(() => message)
        })
      }
      catch {
      }
      await cacheEntryRemoved
      socket.off("message")
      socket.disconnect()

    }
  })
})

const getSocket = createSocketFactory()

function createSocketFactory() {
  let _socket: Socket
  return async (): Promise<Socket> => {
    if (_socket) {
      if (_socket.disconnected) _socket.connect()
      return _socket
    }
    _socket = io(USERS_API + "/verify")
    return _socket
  }
}
