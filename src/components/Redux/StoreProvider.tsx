"use client"
import React, {useMemo, useRef} from "react"
import { Provider } from "react-redux"
import makeStore, { AppStore } from "@/redux_stores/Global/tournamentTypeRedixStore"
import { useSearchParams } from "next/navigation"
import {TournamentTypeIntarface} from "@/types/TournamentTypeIntarface";

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
  console.log("Make redux provider")
  if (!storeRef.current) {
    storeRef.current = makeStore(theme, Number(tt), token, year)
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}
