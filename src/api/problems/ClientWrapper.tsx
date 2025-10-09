"use client"
import { Provider } from "react-redux"
import { useMemo } from "react"
import { ProblemsApiContext } from "@/api/problems/clientApiInterface"
import { makeProblemsStoreClient } from "@/api/problems/clientStore"

export default function ProblemsProviderWrapper({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => makeProblemsStoreClient(), [])
  return (
    <Provider store={store} context={ProblemsApiContext}>
      {children}
    </Provider>
  )
}
