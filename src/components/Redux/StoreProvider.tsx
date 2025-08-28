"use client"
import { useRef } from "react"
import { Provider } from "react-redux"
import makeStore, { AppStore } from "@/redux_stores/tournamentTypeRedixStore"
import { useSearchParams } from "next/navigation"

export default function StoreProvider({
  children,
  theme,
  tt,
  token,
}: {
  children: React.ReactNode
  theme: string
  tt: string
  token: string
}) {
  const storeRef = useRef<AppStore | null>(null)
  const year = useSearchParams().get("year")
  if (!storeRef.current) {
    storeRef.current = makeStore(theme, tt, token, year)
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}
