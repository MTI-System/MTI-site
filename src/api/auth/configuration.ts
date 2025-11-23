import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { AUTH_API } from "@/constants/APIEndpoints"
import { Token, TokenSchema, User, UserSchema } from "@/types/authApi"
import { BooleanResponseSchema } from "@/types/generalAPITypes"

export const authReducerPath = "notificationsApi" as const

export const authBaseQuery = fetchBaseQuery({ baseUrl: AUTH_API })

export const defineAuthEndpoints = (builder: EndpointBuilder<typeof authBaseQuery, never, typeof authReducerPath>) => ({
  register: builder.mutation({
    query: ({ formData }: { formData: FormData }) => ({
      url: "register",
      method: "PUT",
      body: formData,
    }),
    transformResponse: (response: string): string | null => {
      if (!response) return null
      const token = TokenSchema.safeParse(response)
      return token.data?.token ?? null
    },
  }),
  login: builder.mutation({
    query: ({ formData }: { formData: FormData }) => ({
      url: "login",
      method: "POST",
      body: formData,
    }),
    transformResponse: (response: string): string | null => {
      if (!response) return null
      const token = TokenSchema.safeParse(response)
      return token.data?.token ?? null
    },
  }),
  isLoginTaken: builder.mutation({
    query: ({login}: {login: string}) => ({
      url: `is_login_taken?login=${login}`,
      method: "GET"
    }),
    transformResponse: (response: string): boolean=> {
      if (!response) return false
      const is_login_taken = BooleanResponseSchema.safeParse(response)
      return is_login_taken.data?.result ?? false 
    }
  }),
  fetchPermissions: builder.mutation({
    query: ({ token }: { token: string }) => {
      return {
        url: "check_auth",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    },
    transformResponse: (response: unknown): User | null => {
      const user = UserSchema.safeParse(response)
      console.log("response: ", response, user)
      if (!user.success) {
        return null
      }
      return user.data
    },
  }),
  
})
