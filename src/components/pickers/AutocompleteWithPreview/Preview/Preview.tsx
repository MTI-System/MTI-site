"use client"
import { ReactNode, useEffect, useState } from "react"
import { useAutocompleteRoot } from "../Root/RootContext"

export function Preview<T>({
  children,
  frozen = false,
}: {
  children: (preview: T | null) => ReactNode
  frozen?: boolean
}) {
  const { preview } = useAutocompleteRoot()
  const [internalPreview, setInternalPreview] = useState<T | null>(preview)
  useEffect(() => {
    if (frozen) return
    setInternalPreview(preview)
  }, [preview, frozen])
  return children(internalPreview)
}
