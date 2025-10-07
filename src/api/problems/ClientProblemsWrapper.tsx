import { Provider } from "react-redux"
import { useMemo } from "react"

import {makeProblemsStoreClient} from "@/api/problems/clientStore";
import {ProblemsApiContext} from "@/api/problems/client";

export default function NotificationsProviderWrapper({ children }: { children: React.ReactNode }) {
    const store = useMemo(() => makeProblemsStoreClient(), [])
    return (
        <Provider store={store} context={ProblemsApiContext}>
            {children}
        </Provider>
    )
}