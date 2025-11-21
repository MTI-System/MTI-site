import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import {notificationsApiClient} from "@/api/notifications/clientApiInterface";

export function makeNotificationsStoreClient() {
    const store = configureStore({
        reducer: {
            [notificationsApiClient.reducerPath]: notificationsApiClient.reducer,
        },
        middleware: (gDM) => gDM().concat(notificationsApiClient.middleware),
    })
    setupListeners(store.dispatch)
    return store
}
export type NotificationsApiStoreClient = ReturnType<typeof makeNotificationsStoreClient>
