"use client"
import { createContext, useEffect, useState } from "react"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"

const TOURNAMENT_TYPE_KEY_NAME = "mtiyt_tournamentType"

type TournamentType = (typeof availableTournamentTypes)[number]

interface tournamentTypeValue {
  type: TournamentType
  updateType: (newType: TournamentType) => void
}

const isTournamentType = (value: string): value is TournamentType =>
  availableTournamentTypes.includes(value as TournamentType)

export const TournamentTypeContext = createContext<tournamentTypeValue | null>(null)

export function TournamentTypeProvider({ children }: { children: React.ReactNode }) {
  const [tournamentType, setTournamentType] = useState<TournamentType>("ypt")

  const updateType = (newType: TournamentType) => {
    setTournamentType(newType)
  }

  useEffect(() => {
    localStorage.setItem(TOURNAMENT_TYPE_KEY_NAME, tournamentType)
  }, [tournamentType])

  useEffect(() => {
    const savedTournamentType = localStorage.getItem(TOURNAMENT_TYPE_KEY_NAME)
    setTournamentType(
      savedTournamentType && isTournamentType(savedTournamentType) ? savedTournamentType : tournamentType
    )
  }, [])

  return (
    <TournamentTypeContext value={{ type: tournamentType, updateType: updateType }}>{children}</TournamentTypeContext>
  )
}
