"use client"
import { Provider } from "react-redux"
import { useMemo } from "react"
import { TournamentsApiContext } from "@/api/tournaments/clientApiInterface"
import { makeTournamentsStoreClient } from "@/api/tournaments/clientStore"

export default function TournamentsProviderWrapper({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => makeTournamentsStoreClient(), [])
  return (
    <Provider store={store} context={TournamentsApiContext}>
      {children}
    </Provider>
  )
}
