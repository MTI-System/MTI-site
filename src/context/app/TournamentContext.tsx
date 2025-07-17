"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import cookies from "js-cookie"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import { TOURNAMENT_TYPE_KEY_NAME, TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"
import useSearchParam from "@/hooks/useSearchParam"

type TournamentType = string//(typeof availableTournamentTypes)[number]

interface tournamentTypeValue {
  value: TournamentType
  updateValue: (newType: TournamentType, noSave?: boolean) => void
  isLocked: boolean
  toggleLock: (lockContext: boolean) => void
}

const isTournamentType = (value: string): value is TournamentType =>
  availableTournamentTypes.find((val)=>val.name === value) != undefined

export const TournamentTypeContext = createContext<tournamentTypeValue | null>(null)

export function TournamentTypeProvider({ children }: { children: React.ReactNode }) {
  const [spTournamentType, setSPTournamentType] = useSearchParam(TOURNAMENT_TYPE_SEARCH_PARAM_NAME)
  const [tournamentType, setTournamentType] = useState<TournamentType>(availableTournamentTypes[0].name)
  const [isLocked, setIsLocked] = useState(false)
  console.log(isLocked)

  const updateType = (newType: TournamentType, noSave: boolean = false) => {
    if (!isTournamentType(newType)) return false
    setTournamentType(newType)
    if (noSave || isLocked) return true
    cookies.set(TOURNAMENT_TYPE_KEY_NAME, newType)
    if (spTournamentType) setSPTournamentType(newType)
    return true
  }

  useEffect(() => {
    if (isLocked) return
    const savedTournamentType = cookies.get(TOURNAMENT_TYPE_KEY_NAME)
    if (spTournamentType && spTournamentType !== savedTournamentType) {
      updateType(spTournamentType, true)
      return
    }
    console.log(`Cookie get ${savedTournamentType}`)
    setTournamentType(
      savedTournamentType && isTournamentType(savedTournamentType) ? savedTournamentType : tournamentType
    )
  }, [spTournamentType, isLocked])

  return (
    <TournamentTypeContext
      value={{ value: tournamentType, updateValue: updateType, isLocked: isLocked, toggleLock: setIsLocked }}
    >
      {children}
    </TournamentTypeContext>
  )
}

export function TournamentTypeContextLock({ children, lockValue }: { children: ReactNode; lockValue: string }) {
  const contextObject = useContext(TournamentTypeContext)
  let newContext = contextObject ? { ...contextObject } : null

  useEffect(() => {
    if (!contextObject) return
    contextObject.toggleLock(true)
    contextObject.updateValue(lockValue, true)
    return () => {
      contextObject.toggleLock(false)
    }
  }, [])

  if (newContext) newContext.toggleLock = () => {}
  return <TournamentTypeContext value={newContext}>{children}</TournamentTypeContext>
}
