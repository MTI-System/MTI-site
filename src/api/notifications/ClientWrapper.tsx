"use client"
import { Provider } from "react-redux"
import { useMemo } from "react"
import { NotificationsApiContext } from "@/api/notifications/clientApiInterface"
import { makeNotificationsStoreClient } from "@/api/notifications/clientStore"

export default function NotificationsProviderWrapper({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => makeNotificationsStoreClient(), [])
  return (
    <Provider store={store} context={NotificationsApiContext}>
      {children}
    </Provider>
  )
}
