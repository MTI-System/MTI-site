"use client"
import { Provider } from "react-redux"
import { useMemo } from "react"
import { UsersApiContext } from "@/api/users/clientApiInterface"
import { makeUsersStoreClient } from "@/api/users/clientStore"

export default function UsersProviderWrapper({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => makeUsersStoreClient(), [])
  return (
    <Provider store={store} context={UsersApiContext}>
      {children}
    </Provider>
  )
}
