"use client"
import { Provider } from "react-redux"
import { useMemo } from "react"
import { RegistrationApiContext } from "@/api/registration/clientApiInterface"
import { makeRegistrationStoreClient } from "@/api/registration/clientStore"

export default function RegistrationProviderWrapper({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => makeRegistrationStoreClient(), [])
  return (
    <Provider store={store} context={RegistrationApiContext}>
      {children}
    </Provider>
  )
}
