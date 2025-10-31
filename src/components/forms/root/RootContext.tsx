"use client"
import {createContext, ReactNode, RefObject, useCallback, useContext, useMemo, useRef, useState} from "react"


type FunctionItem= {
  func: () => boolean,
  id: number
}


type CardsRootContextType = {
  items: FunctionItem[]
  register: (fn: () => boolean) => number
  unregister: (id: number) => void
  isEdit: boolean
  isExpanded: boolean
}

const CardsRootContext = createContext<CardsRootContextType | null>(null)

export function * getId(){
  let counter = 0
  while (true) {
    yield counter
    counter++
  }
  return -1
}



export function CardsRootProvider({
                                    isEdit = false,
                                    isExpanded = false,
                                    children, }: {
  isEdit?: boolean
  isExpanded?: boolean
  children: ReactNode
}) {
  const [items, setItems] = useState<FunctionItem[]>([])
  const nextId = useRef(1)

  const register = useCallback((fn: () => boolean) => {
    const id = nextId.current++
    setItems(prev => [...prev, { id, func: fn }])
    return id
  }, [])

  const unregister = useCallback((id: number) => {
    setItems(prev => prev.filter(it => it.id !== id))
  }, [])

  const value = useMemo(
    () => ({ items, register, unregister, isEdit, isExpanded }),
    [items, register, unregister, isEdit, isExpanded]
  )

  return <CardsRootContext.Provider value={value}>{children}</CardsRootContext.Provider>
}



export function useCardsRoot() {
  const ctx = useContext(CardsRootContext)


  if (!ctx) throw new Error("useCardseRoot must be used within an CardRoot")
  return {...ctx}
}
