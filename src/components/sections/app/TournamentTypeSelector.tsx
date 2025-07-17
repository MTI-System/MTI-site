"use client"
import { TournamentTypeContext } from "@/context/app/TournamentContext"
import { availableTournamentTypes } from "@/constants/AvailableTournaments"
import { StaticDropdown } from "@/components/ui/Dropdown"
import { useContext } from "react"

export default function TournamentTypeSelector({ className }: { className?: string }) {
  const ttContextObject = useContext(TournamentTypeContext)

  return (
    <StaticDropdown
      options={availableTournamentTypes.map((tt) => {
        return { displayName: tt.name.toUpperCase(), value: tt.name, active: true }
      })}
      onOptionSelect={(selectedValue) => ttContextObject?.updateValue(selectedValue)}
      defaultSelection={
        ttContextObject !== null
          ? {
              displayName: ttContextObject.value.toUpperCase(),
              value: ttContextObject.value,
              active: true,
            }
          : 0
      }
      className={className}
      disabled={ttContextObject?.isLocked}
    ></StaticDropdown>
  )
}
