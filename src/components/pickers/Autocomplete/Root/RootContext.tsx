"use client"
import { createContext, useContext } from "react"

interface AutocompleteRootContextType {
  selectedItem: any
  scrollCallback: () => void
  isLoading: boolean
  loadedResultsCount: number
  overallResultsCount: number
}

export const AutocompleteRootContext = createContext<AutocompleteRootContextType | null>(null)

export function useAutocompleteRoot() {
  const ctx = useContext(AutocompleteRootContext)
  if (!ctx) throw new Error("useAutocompleteRoot must be used within an AutocompleteRootProvider")
  return ctx
}
