import { EndpointBuilder, fetchBaseQuery } from "@reduxjs/toolkit/query"
import z from "zod"
import { NOTIFICATIONS_API } from "@/constants/APIEndpoints"
import { NotificationInterface, NotificationSchema } from "@/types/NotificationsApi"

export const notificationsReducerPath = "notificationsApi" as const

export const notificationsBaseQuery = fetchBaseQuery({ baseUrl: NOTIFICATIONS_API })

export const defineNotificationsEndpoints = (
  builder: EndpointBuilder<typeof notificationsBaseQuery, never, typeof notificationsReducerPath>,
) => ({
  getAllNotifications: builder.query({
    query: ({ userId, param }: { userId: number; param: string }) => `notifications/${userId}/${param}`,
    transformResponse: (response: unknown): NotificationInterface[] | null => {
      console.log("Response", response)
      const respJSON = z.array(NotificationSchema).safeParse(response)
      if (respJSON.success) return respJSON.data
      console.error(`Unexpected response while parsing problems: ${respJSON.error}`)
      return null
    },
  }),
})
