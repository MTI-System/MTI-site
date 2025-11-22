"use client"
import { ReactNode, useRef } from "react"
import makeProblemsStore, { ProblemsStore } from "@/redux_stores/Problems/ProblemsReduxStore"
import { ProblemsStoreProvider } from "@/components/Redux/ProblemsStoreContext"

export default function ProblemsReduxProviderWrapper({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ProblemsStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeProblemsStore()
  }
  return <ProblemsStoreProvider store={storeRef.current}>{children}</ProblemsStoreProvider>
}
