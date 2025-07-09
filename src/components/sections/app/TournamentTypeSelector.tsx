"use client"
import { TournamentTypeContext } from "@/context/app/TournamentContext"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import { StaticDropdown } from "@/components/ui/Dropdown"
import { useContext } from "react"

export default function TournamentTypeSelector({ className }: { className?: string }) {
  const ttContext = useContext(TournamentTypeContext)
  return (
    <StaticDropdown
      options={availableTournamentTypes.map((tt) => {
        return { displayName: tt.toUpperCase(), value: tt, active: true }
      })}
      onOptionSelect={(selectedValue) => ttContext?.updateType(selectedValue)}
      defaultSelection={0}
      className={className}
    ></StaticDropdown>
  )
}
