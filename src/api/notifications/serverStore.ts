import { configureStore } from "@reduxjs/toolkit"
import {notificationsApiServer} from "@/api/notifications/serverApiInterface";

export function makeNotificationsStoreServer() {
    return configureStore({
        reducer: {
            [notificationsApiServer.reducerPath]: notificationsApiServer.reducer,
        },
        middleware: (gDM) => gDM().concat(notificationsApiServer.middleware),
    })
}
export type AuthApiStoreServer = ReturnType<typeof makeNotificationsStoreServer>