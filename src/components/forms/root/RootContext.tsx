"use client"
import { createContext, ReactNode, RefObject, useCallback, useContext, useRef, useState } from "react"

type FunctionItem = {
  func: () => InputVerificationStatus
  id: number
}

type CardsRootContextType = {
  items: FunctionItem[]
  register: (fn: () => InputVerificationStatus) => number
  unregister: (id: number) => void
  setFormField: (key: string, value: string) => void
  getFormData: () => FormData
  isEdit: boolean
  isExpanded: boolean
  formDataMap: RefObject<Map<string, string>>
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
  const formDataMap = useRef(new Map())

  const register = useCallback((fn: () => InputVerificationStatus) => {
    const id = nextId.current++
    setItems((prev) => [...prev, { id, func: fn }])
    return id
  }, [])

  const unregister = useCallback((id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }, [])

  const setFormField = useCallback((key: string, value: string) => {
    formDataMap.current.set(key, value)
  }, [])

  const getFormData = useCallback(() => {
    const formData = new FormData()
    formDataMap.current.entries().forEach((element) => {
      formData.set(element[0], element[1])
    })
    return formData
  }, [])

  return (
    <CardsRootContext
      value={{ items, register, unregister, isEdit, isExpanded, formDataMap, setFormField, getFormData }}
    >
      {children}
    </CardsRootContext>
  )
}

export function useCardsRoot() {
  const ctx = useContext(CardsRootContext)

  if (!ctx) throw new Error("useCardseRoot must be used within an CardRoot")
  return { ...ctx }
}
