import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { EMAIL_VERIFICATION_API, USERS_API } from "@/constants/APIEndpoints"
import { User, UserSchema } from "@/types/UsersApi"

export const usersReducerPath = "usersApi" as const

export const usersBaseQuery = fetchBaseQuery({ baseUrl: USERS_API })

export const defineUsersEndpoints = (
  builder: EndpointBuilder<typeof usersBaseQuery, never, typeof usersReducerPath>,
) => ({
  getUserByAuthId: builder.query({
    query: ({ id }: { id: number }) => `users/by_auth/${id}`,
    transformResponse: (response: unknown): User | null => {
      const user = UserSchema.safeParse(response)
      if (!user.success) {
        console.error(`Unexpected response while parsing user: ${user.error}`)
        return null
      }
      return user.data
    },
  }),
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
  verifyEmail: builder.query<string | null, { email: string|null }>({
    queryFn: async ({ email }) => {
      if (!email) return { data: null }
      const socket = await getSocket
      console.log("sending email to socket", email)
      socket.send(email)
      return { data: null }
    },
    async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
      const socket = await getSocket

      const handleMessage = (event: MessageEvent) => {
        console.log("received message2:", event.data)
        updateCachedData(() => event.data)
      }
      try {
        await cacheDataLoaded
        socket.addEventListener("message", handleMessage)
      } catch {}
      await cacheEntryRemoved
      socket.removeEventListener("message", handleMessage)
    },
  }),
})

let _socket: WebSocket | null = null
const getSocket = new Promise<WebSocket>((resolve, reject) => {
  console.log("initializing socket")
  if (_socket !== null) resolve(_socket)

  _socket = new WebSocket(EMAIL_VERIFICATION_API) as WebSocket
  const openHandler = () => {
    if (!_socket) return
    console.log("socket opened")
    resolve(_socket)
  }
  _socket.addEventListener("open", openHandler)
  const errorHandler = (event: Event) => {
    if (!_socket) return
    console.log("socket error", event)
    reject(new Error("Failed to connect to socket"))
    _socket.removeEventListener("error", errorHandler)
    _socket.removeEventListener("open", openHandler)
  }
  _socket.addEventListener("error", errorHandler)
  _socket.addEventListener("close", ()=>{
    console.log("Closed!")
  })
})
