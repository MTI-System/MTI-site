import {configureStore} from "@reduxjs/toolkit"
import notificationsApi from "@/api/notificationsApiRTK";

export default function makeNotificationsStore() {
    return configureStore({
        reducer: {
            [notificationsApi.reducerPath]: notificationsApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(notificationsApi.middleware),
    })
}


export type NotificationsApiStore = ReturnType<typeof makeNotificationsStore>
export type RootNotificationsApiState = ReturnType<NotificationsApiStore["getState"]>
export type NotificationsApiDispatch = NotificationsApiStore["dispatch"]
