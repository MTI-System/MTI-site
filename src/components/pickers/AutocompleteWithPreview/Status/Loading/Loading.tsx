"use client"
import { Autocomplete } from "@base-ui-components/react/autocomplete"
import { useAutocompleteRoot } from "../../Root/RootContext"

export function Loading({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAutocompleteRoot()
  return isLoading ? children : null
}
