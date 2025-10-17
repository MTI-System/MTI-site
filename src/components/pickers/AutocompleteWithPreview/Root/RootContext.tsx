"use client"
import { createContext, useContext } from "react"

interface AutocompleteRootContextType<T> {
  selectedItem: any
  scrollCallback: () => Promise<void>
  isLoading: boolean
  error?: string
  preview: T | undefined
  handlePreview: (item: T) => void
}

export const AutocompleteRootContext = createContext<AutocompleteRootContextType<any> | null>(null)

export function useAutocompleteRoot() {
  const ctx = useContext(AutocompleteRootContext)
  if (!ctx) throw new Error("useAutocompleteRoot must be used within an AutocompleteRootProvider")
  return ctx
}
