import { createContext, useContext } from "react"

interface CardsRootContextType<T> {
  
}

export const CardsRootContext = createContext<CardsRootContextType<any> | null>(null)

export function useCardsRoot() {
  const ctx = useContext(CardsRootContext)
  if (!ctx) throw new Error("useCardseRoot must be used within an CardRoot")
  return ctx
}
