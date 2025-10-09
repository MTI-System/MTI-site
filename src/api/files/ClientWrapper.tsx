"use client"
import { Provider } from "react-redux"
import { useMemo } from "react"
import {AuthApiContext} from "@/api/auth/clientApiInterface";
import {makeAuthStoreClient} from "@/api/auth/clientStore";
import {makeFilesStoreClient} from "@/api/files/clientStore";
import {FilesApiContext} from "@/api/files/clientApiInterface";

export default function FilesProviderWrapper({ children }: { children: React.ReactNode }) {
    const store = useMemo(() => makeFilesStoreClient(), [])
    return (
        <Provider store={store} context={FilesApiContext}>
            {children}
        </Provider>
    )
}