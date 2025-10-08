import {EndpointBuilder, fetchBaseQuery} from "@reduxjs/toolkit/query"
import z from "zod"
import {AUTH_API, NOTIFICATIONS_API, PROBLEM_API} from "@/constants/APIEndpoints"
import {NotificationInterface, NotificationSchema} from "@/types/NotificationsApi";
import src from "zod";
import {User, UserSchema} from "@/types/authApi";

export const authReducerPath = "notificationsApi" as const

export const authBaseQuery = fetchBaseQuery({baseUrl: AUTH_API})

export const defineAuthEndpoints = (
    builder: EndpointBuilder<typeof authBaseQuery, never, typeof authReducerPath>
) => ({
    login: builder.mutation({
        query: ({formData}: { formData: FormData }) => ({
            url: "login",
            method: "POST",
            body: formData
        }),
        transformResponse: (response: string): string | null => {
            if (!response) return null
            if (!response.trim()) return null;
            return response
        }
    }),
    fetchPermissions: builder.mutation({
        query: ({token}: {token: string}) => {
            return {
                url: "check_auth",
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                }
            }
        },
        transformResponse: (response: unknown): User | null => {
            const user = UserSchema.safeParse(response)
            if (!user.success){
                return null
            }
            return user.data
        }
    })
})
