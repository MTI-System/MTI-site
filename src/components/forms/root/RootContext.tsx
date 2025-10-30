"use client"
import { createContext, RefObject, useContext, useRef } from "react"


interface CardsRootContextType<T> {
  registeredItemsFunctions?:  RefObject<(() => boolean)[]>,
  isEdit: boolean;
  isExpanded: boolean;
}
export const CardsRootContext = createContext<CardsRootContextType<any> | null>(null)

export function useCardsRoot() {
  const ctx = useContext(CardsRootContext)
  if (!ctx) throw new Error("useCardseRoot must be used within an CardRoot")
  return ctx
}
