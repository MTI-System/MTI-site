import {coreModule, createApi, fetchBaseQuery, reactHooksModule} from "@reduxjs/toolkit/query/react"
import { NOTIFICATIONS_API } from "@/constants/APIEndpoints"
import z from "zod"
import {NotificationInterface, NotificationSchema} from "@/types/NotificationsApi";
import {buildCreateApi} from "@reduxjs/toolkit/query";
import {createDispatchHook, createSelectorHook, createStoreHook} from "react-redux";
import React from "react";

export const NotificationsApiContext = React.createContext(null as any);

const createApiWithContext = buildCreateApi(
    coreModule(),
    reactHooksModule({
        hooks: {
            useDispatch: createDispatchHook(NotificationsApiContext),
            useSelector: createSelectorHook(NotificationsApiContext),
            useStore: createStoreHook(NotificationsApiContext),
        },
    })
)

const notificationsApi = createApiWithContext({
    reducerPath: "notificationsApi",
    baseQuery: fetchBaseQuery({ baseUrl: NOTIFICATIONS_API }),
    endpoints: (builder) => ({
        getAllNotifications: builder.query({
            query: ({ userId, param}: { userId: number, param: string }) =>
                `notifications/${userId}/${param}`,
            transformResponse: (response: unknown): NotificationInterface[] | null => {
                console.log("Response", response)
                const respJSON = z.array(NotificationSchema).safeParse(response)
                if (respJSON.success) return respJSON.data
                console.error(`Unexpected response while parsing problems: ${respJSON.error}`)
                return null
            },
        }),
    }),
})

export const { useGetAllNotificationsQuery } = notificationsApi
export default notificationsApi
