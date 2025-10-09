import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { filesApiClient} from "./clientApiInterface";

export function makeFilesStoreClient() {
    const store = configureStore({
        reducer: {
            [filesApiClient.reducerPath]: filesApiClient.reducer,
        },
        middleware: (gDM) => gDM().concat(filesApiClient.middleware),
    })
    setupListeners(store.dispatch)
    return store
}
export type FilesApiStoreClient = ReturnType<typeof makeFilesStoreClient>
