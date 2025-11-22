"use client"
import { Provider } from "react-redux"
import { useMemo } from "react"
import { AuthApiContext } from "@/api/auth/clientApiInterface"
import { makeAuthStoreClient } from "@/api/auth/clientStore"

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => makeAuthStoreClient(), [])
  return (
    <Provider store={store} context={AuthApiContext}>
      {children}
    </Provider>
  )
}
