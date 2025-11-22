"use client"
import { useAutocompleteRoot } from "../../Root/RootContext"

export function Error({ className }: { className: string }) {
  const { error, isLoading } = useAutocompleteRoot()
  return error && !isLoading ? <p className={className}>{error}</p> : null
}
