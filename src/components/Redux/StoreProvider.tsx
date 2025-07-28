"use client"
import { useRef } from "react"
import { Provider } from "react-redux"
import makeStore, { AppStore } from "@/redux_stores/tournamentTypeRedixStore"

export default function StoreProvider({ children, theme }: { children: React.ReactNode; theme: string }) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore(theme)
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}
