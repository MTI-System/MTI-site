"use client"
import { useAutocompleteRoot } from "../../Root/RootContext"

export function Info({ children }: { children: React.ReactNode }) {
  const { isLoading, error } = useAutocompleteRoot()
  return !error && !isLoading ? children : null
}