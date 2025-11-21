"use client"
import { Provider } from "react-redux"
import { useMemo } from "react"
import { MaterialsApiContext } from "@/api/materials/clientApiInterface"
import { makeMaterialsStoreClient } from "@/api/materials/clientStore"

export default function MaterialsProviderWrapper({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => makeMaterialsStoreClient(), [])
  return (
    <Provider store={store} context={MaterialsApiContext}>
      {children}
    </Provider>
  )
}
