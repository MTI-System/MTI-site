"use client"
import { createContext, useEffect, useState } from "react"
import cookies from "js-cookie"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import { TOURNAMENT_TYPE_KEY_NAME, TOURNAMENT_TYPE_SEARCH_PARAM_NAME } from "@/constants/CookieKeys"
import useSearchParam from "@/hooks/useSearchParam"

type TournamentType = (typeof availableTournamentTypes)[number]

interface tournamentTypeValue {
  value: TournamentType
  updateValue: (newType: TournamentType, noSave?: boolean) => void
}

const isTournamentType = (value: string): value is TournamentType =>
  availableTournamentTypes.includes(value as TournamentType)

export const TournamentTypeContext = createContext<tournamentTypeValue | null>(null)

export function TournamentTypeProvider({ children }: { children: React.ReactNode }) {
  const [spTournamentType, setSPTournamentType] = useSearchParam(TOURNAMENT_TYPE_SEARCH_PARAM_NAME)
  const [tournamentType, setTournamentType] = useState<TournamentType>(availableTournamentTypes[0])

  const updateType = (newType: TournamentType, noSave: boolean = false) => {
    if (!isTournamentType(newType)) return false
    setTournamentType(newType)
    if (noSave) return true
    console.log(`Cookie set ${newType}`)
    cookies.set(TOURNAMENT_TYPE_KEY_NAME, newType)
    console.log(spTournamentType)
    if (spTournamentType) setSPTournamentType(newType)
    return true
  }

  useEffect(() => {
    const savedTournamentType = cookies.get(TOURNAMENT_TYPE_KEY_NAME)
    if (spTournamentType && spTournamentType !== savedTournamentType) {
      console.log(spTournamentType)
      console.log("Non cookie tournament type set")
      updateType(spTournamentType, true)
      return
    }
    console.log(`Cookie get ${savedTournamentType}`)
    setTournamentType(
      savedTournamentType && isTournamentType(savedTournamentType) ? savedTournamentType : tournamentType
    )
  }, [spTournamentType])

  return (
    <TournamentTypeContext value={{ value: tournamentType, updateValue: updateType }}>{children}</TournamentTypeContext>
  )
}
