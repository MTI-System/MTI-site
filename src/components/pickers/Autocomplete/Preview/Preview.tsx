import { ReactNode } from "react"
import { useAutocompleteRoot } from "../Root/RootContext"

export function Preview<T>({ children }: { children: (preview: T | null) => ReactNode }) {
  const { preview } = useAutocompleteRoot()
  return children(preview)
}
