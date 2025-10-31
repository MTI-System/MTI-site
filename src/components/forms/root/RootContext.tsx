"use client"
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react"

type FunctionItem = {
  func: () => InputVerificationStatus
  id: number
}

type CardsRootContextType = {
  items: FunctionItem[]
  register: (fn: () => InputVerificationStatus) => number
  unregister: (id: number) => void
  isEdit: boolean
  isExpanded: boolean
}

const CardsRootContext = createContext<CardsRootContextType | null>(null)

export function CardsRootProvider({
  isEdit = false,
  isExpanded = false,
  children,
}: {
  isEdit?: boolean
  isExpanded?: boolean
  children: ReactNode
}) {
  const [items, setItems] = useState<FunctionItem[]>([])
  const nextId = useRef(1)

  const register = useCallback((fn: () => InputVerificationStatus) => {
    const id = nextId.current++
    setItems((prev) => [...prev, { id, func: fn }])
    return id
  }, [])

  const unregister = useCallback((id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }, [])

  return <CardsRootContext value={{ items, register, unregister, isEdit, isExpanded }}>{children}</CardsRootContext>
}

export function useCardsRoot() {
  const ctx = useContext(CardsRootContext)

  if (!ctx) throw new Error("useCardseRoot must be used within an CardRoot")
  return { ...ctx }
}
