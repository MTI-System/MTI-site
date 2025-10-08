import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import {problemsApiClient} from "@/api/problems/clientApiInterface";

export function makeProblemsStoreClient() {
    const store = configureStore({
        reducer: {
            [problemsApiClient.reducerPath]: problemsApiClient.reducer,
        },
        middleware: (gDM) => gDM().concat(problemsApiClient.middleware),
    })
    setupListeners(store.dispatch)
    return store
}
export type ProblemsApiStoreClient = ReturnType<typeof makeProblemsStoreClient>